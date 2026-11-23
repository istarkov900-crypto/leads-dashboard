import Anthropic from '@anthropic-ai/sdk';
import { buildUserPrompt, cleanAnswers, extractJson, SYSTEM_PROMPT } from '@/lib/prompt';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
// Route generation can take a minute or two; the response streams progress meanwhile.
export const maxDuration = 300;

const MODEL = 'claude-opus-5-5';

type Event =
  | { type: 'progress'; chars: number }
  | { type: 'plan'; plan: unknown }
  | { type: 'error'; code: string };

function clientIp(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ type: 'error', code: 'server_not_configured' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ type: 'error', code: 'bad_request' }, { status: 400 });
  }

  const limit = rateLimit(clientIp(req));
  if (!limit.ok) {
    return Response.json({ type: 'error', code: 'rate_limited', retryAfterSec: limit.retryAfterSec }, { status: 429 });
  }

  const answers = cleanAnswers(body.answers);
  const extra = typeof body.extra === 'string' ? body.extra.trim().slice(0, 500) : '';
  const userPrompt = buildUserPrompt(answers, extra || undefined, extra ? body.currentPlan : undefined);

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: Event) => controller.enqueue(encoder.encode(JSON.stringify(e) + '\n'));
      try {
        const ms = client.beta.messages.stream(
          {
            model: MODEL,
            max_tokens: 32000,
            betas: ['server-side-fallback-2026-07-01'],
            fallbacks: 'default',
            output_config: { effort: 'medium' },
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: userPrompt }],
          },
          { signal: req.signal },
        );

        let chars = 0;
        let lastSent = 0;
        ms.on('text', (delta: string) => {
          chars += delta.length;
          if (chars - lastSent >= 400) {
            lastSent = chars;
            send({ type: 'progress', chars });
          }
        });

        const msg = await ms.finalMessage();
        if (msg.stop_reason === 'refusal') {
          send({ type: 'error', code: 'refused' });
        } else if (msg.stop_reason === 'max_tokens') {
          send({ type: 'error', code: 'too_long' });
        } else {
          const text = msg.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
          const plan = extractJson(text) as { legs?: unknown } | null;
          if (!plan || !Array.isArray(plan.legs)) send({ type: 'error', code: 'invalid_json' });
          else send({ type: 'plan', plan });
        }
      } catch (err) {
        if (req.signal.aborted) {
          // The visitor pressed «Остановить» or closed the page.
        } else if (err instanceof Anthropic.RateLimitError) {
          send({ type: 'error', code: 'upstream_busy' });
        } else if (err instanceof Anthropic.AuthenticationError) {
          console.error('Claude API key rejected');
          send({ type: 'error', code: 'server_not_configured' });
        } else if (err instanceof Anthropic.APIError) {
          console.error('Claude API error', err.status, err.message);
          send({ type: 'error', code: 'upstream_error' });
        } else {
          console.error('Plan generation failed', err);
          send({ type: 'error', code: 'upstream_error' });
        }
      } finally {
        try { controller.close(); } catch {}
      }
    },
  });

  return new Response(stream, {
    headers: { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-store' },
  });
}
