let started = false;
export function start(){
if(started) return; started = true;

const PLANE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>';
document.getElementById('logomark').innerHTML = PLANE;
const COUNTRIES = ['Австралия','Австрия','Азербайджан','Албания','Алжир','Ангола','Андорра','Антигуа и Барбуда','Аргентина','Армения','Афганистан','Багамы','Бангладеш','Барбадос','Бахрейн','Беларусь','Белиз','Бельгия','Бенин','Болгария','Боливия','Босния и Герцеговина','Ботсвана','Бразилия','Бруней','Буркина-Фасо','Бурунди','Бутан','Вануату','Ватикан','Великобритания','Венгрия','Венесуэла','Восточный Тимор','Вьетнам','Габон','Гаити','Гайана','Гамбия','Гана','Гватемала','Гвинея','Гвинея-Бисау','Германия','Гондурас','Гонконг','Гренада','Греция','Грузия','Дания','Джибути','Доминика','Доминиканская Республика','Египет','Замбия','Зимбабве','Израиль','Индия','Индонезия','Иордания','Ирак','Иран','Ирландия','Исландия','Испания','Италия','Йемен','Кабо-Верде','Казахстан','Камбоджа','Камерун','Канада','Катар','Кения','Кипр','Киргизия','Кирибати','Китай','Колумбия','Коморы','Конго','ДР Конго','Корея (Южная)','КНДР','Косово','Коста-Рика','Кот-д’Ивуар','Куба','Кувейт','Лаос','Латвия','Лесото','Либерия','Ливан','Ливия','Литва','Лихтенштейн','Люксембург','Маврикий','Мавритания','Мадагаскар','Макао','Малави','Малайзия','Мали','Мальдивы','Мальта','Марокко','Маршалловы Острова','Мексика','Микронезия','Мозамбик','Молдова','Монако','Монголия','Мьянма','Намибия','Науру','Непал','Нигер','Нигерия','Нидерланды','Никарагуа','Новая Зеландия','Норвегия','ОАЭ','Оман','Пакистан','Палау','Палестина','Панама','Папуа — Новая Гвинея','Парагвай','Перу','Польша','Португалия','Пуэрто-Рико','Россия','Руанда','Румыния','Сальвадор','Самоа','Сан-Марино','Сан-Томе и Принсипи','Саудовская Аравия','Северная Македония','Сейшелы','Сенегал','Сент-Винсент и Гренадины','Сент-Китс и Невис','Сент-Люсия','Сербия','Сингапур','Сирия','Словакия','Словения','США','Соломоновы Острова','Сомали','Судан','Суринам','Сьерра-Леоне','Таджикистан','Тайвань','Таиланд','Танзания','Того','Тонга','Тринидад и Тобаго','Тувалу','Тунис','Туркменистан','Турция','Уганда','Узбекистан','Украина','Уругвай','Фиджи','Филиппины','Финляндия','Франция','Хорватия','ЦАР','Чад','Черногория','Чехия','Чили','Швейцария','Швеция','Шри-Ланка','Эквадор','Экваториальная Гвинея','Эритрея','Эсватини','Эстония','Эфиопия','ЮАР','Южный Судан','Ямайка','Япония'];

document.getElementById('countries').innerHTML = COUNTRIES.map(c => `<option value="${c}">`).join('');

const SOURCES = [
  {server:'Kiwi.com', tools:['search-flight'], what:'Реальные рейсы со стыковками разных авиакомпаний, багажом и ссылкой на покупку.'},
  {server:'Booking.com', tools:['accommodations_search','accommodations_details','attractions_search'], what:'Реальное жильё с фото, рейтингом и ценой, а ещё экскурсии и билеты.'}
];
const STEPS = ['Кто едет','Куда','Когда','Бюджет','Перелёт и жильё','Детали','Проверка'];
const TABS = [['my-trip','Обзор'],['trip-flights','Перелёты'],['trip-stays','Жильё'],['trip-places','Куда сходить'],['trip-days','По дням'],['trip-budget','Бюджет'],['trip-docs','Документы']];
const fmt = n => new Intl.NumberFormat('ru-RU').format(Math.round(Number(n)||0));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = u => /^https:\/\/[^\s"'<>]+$/i.test(String(u||'')) ? String(u) : '';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const store = {
  get(k){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; }catch(e){ return null; } },
  set(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
function plural(n, a, b, c){ n = Math.abs(n) % 100; const n1 = n % 10; if(n > 10 && n < 20) return c; if(n1 > 1 && n1 < 5) return b; if(n1 === 1) return a; return c; }
function monthOptions(){
  const out = [], d = new Date(); d.setDate(1);
  const names = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
  for(let i=1;i<=12;i++){
    const m = new Date(d.getFullYear(), d.getMonth()+i, 1);
    out.push({v:`${m.getFullYear()}-${String(m.getMonth()+1).padStart(2,'0')}`, t:`${names[m.getMonth()]} ${m.getFullYear()}`});
  }
  return out;
}
const MONTHS = monthOptions();
const isDate = d => /^\d{4}-\d{2}-\d{2}$/.test(String(d||''));
const isIata = c => /^[A-Za-z]{3}$/.test(String(c||''));
const MON = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
const dshort = d => isDate(String(d).slice(0,10)) ? `${+String(d).slice(8,10)} ${MON[+String(d).slice(5,7)-1]}` : esc(d || '');
const tshort = d => /T\d\d:\d\d/.test(String(d||'')) ? String(d).slice(11,16) : '';
const hrs = h => { const m = Math.round(h*60); return `${Math.floor(m/60)} ч${m%60 ? ' ' + (m%60) + ' мин' : ''}`; };

const DEFAULTS = {
  travelers:[{name:'Я',city:'Тель-Авив'},{name:'Друг',city:'Тель-Авив'}],
  citizenship:'Израиль',
  destMode:'Посоветуй', destCountries:[], destText:'',
  vibes:['Море и пляж','Гастрономия'], regions:['Без разницы'], combo:'Одна страна',
  month:MONTHS[3].v, nights:10, flex:'±3 дня', exactDate:'',
  currency:'₪', budget:6000, priority:'Баланс',
  stops:'До 1 пересадки', bags:'Один чемодан на всех',
  stay:'Апартаменты', room:'Один номер на всех', stayWants:['Близко к центру','Кухня'],
  pace:'Сбалансированно', notes:''
};
let S = Object.assign({}, DEFAULTS, store.get('trip.answers') || {});
if(!Array.isArray(S.destCountries)) S.destCountries = [];
if(!S.v2){ if(S.citizenship === 'Россия') S.citizenship = 'Израиль'; (S.travelers || []).forEach(t => { if(t.city === 'Москва') t.city = 'Тель-Авив'; }); S.v2 = 1; }
if(!S.v3){ S.currency = '₪'; S.budget = 6000; S.v3 = 1; }
store.set('trip.answers', S);
let step = 0;
let plan = store.get('trip.plan');
let view = 'home', tab = 'my-trip';
let checks = store.get('trip.checks') || {};
let busy = {};
let ctl = null;
// Stage 1: routes come from our own server (/api/plan). Real prices arrive in stage 2.
const LIVE = false;
const mcpP = Promise.resolve(null);
const permP = Promise.resolve(null);
const save = () => store.set('trip.answers', S);
const CUR = () => ({'₪':'ILS','₽':'RUB','$':'USD','€':'EUR'})[S.currency] || 'USD';
const UCC = {'Израиль':'il','Украина':'ua','Казахстан':'kz','Германия':'de','США':'us','Узбекистан':'uz','Армения':'am','Грузия':'ge','Франция':'fr','Великобритания':'gb','Канада':'ca','Польша':'pl','Италия':'it','Испания':'es','Турция':'tr','Кипр':'cy','Латвия':'lv','Литва':'lt','Эстония':'ee','Молдова':'md','Азербайджан':'az','Киргизия':'kg'};
const ucc = () => ['Россия','Беларусь','Иран','Куба','КНДР','Сирия'].includes(S.citizenship) ? null : (UCC[S.citizenship] || 'il');

/* ---------- connector status ---------- */
let srcStatus = null;
async function loadSources(){
  const mcp = await mcpP;
  srcStatus = {};
  if(!mcp){ SOURCES.forEach(s => srcStatus[s.server] = 'na'); paintSources(); return; }
  try{
    const r = await mcp.listTools();
    SOURCES.forEach(s => {
      const hit = (r.servers || []).find(x => x.server === s.server);
      srcStatus[s.server] = !hit || !hit.tools || !hit.tools.length ? 'off' : hit.authStatus === 'needs_reauth' ? 'reauth' : 'on';
    });
  }catch(e){ SOURCES.forEach(s => srcStatus[s.server] = 'unknown'); }
  paintSources();
}
const SRC_LABEL = {on:'подключён', off:'не подключён', reauth:'переподключить', unknown:'проверяю…', na:'скоро'};
function paintSources(){
  document.querySelectorAll('[data-src]').forEach(el => {
    const st = srcStatus ? srcStatus[el.dataset.src] : null;
    el.textContent = st ? SRC_LABEL[st] : 'проверяю…';
    el.className = 'pill ' + (st === 'on' ? 'on' : st && st !== 'unknown' ? 'off' : '');
  });
}

/* ---------- router ---------- */
function route(){
  const h = location.hash.slice(1);
  if(ctl && view === 'loading') return;
  if(h === 'plan-trip') view = 'quiz';
  else if(TABS.some(t => t[0] === h)){ view = 'plan'; tab = h; }
  else view = 'home';
  render();
  const anchor = (h === 'how' || h === 'sources') && document.getElementById(h);
  if(anchor) anchor.scrollIntoView(); else window.scrollTo(0, 0);
}
function go(name){ if(location.hash.slice(1) === name) route(); else location.hash = name; }
window.addEventListener('hashchange', route);

/* ---------- landing ---------- */
const BOARD = [
  ['TLV','ATH','Афины → Крит · море','прямой'],
  ['TLV','DXB','Дубай → Бали · океан','через хаб'],
  ['TLV','TYO','Токио · города и еда','1 пересадка'],
  ['TLV','BEG','Белград → Черногория','2 страны'],
  ['TLV','BKK','Бангкок → Пхукет · пляж','комбо'],
  ['TLV','LIS','Лиссабон · океан','лоукост']
];
function renderHome(app){
  app.innerHTML = `
  <div class="wrap">
    <section class="hero">
      <div>
        <span class="eyebrow">Планировщик поездок с Claude</span>
        <h1 style="margin-top:14px">Расскажите, как хотите отдохнуть. Поездку соберём за вас.</h1>
        <p class="lead">Семь простых вопросов. В ответ — готовая поездка по шагам: настоящие рейсы, жильё с фото, интересные места, план по дням и бюджет. Всё с реальными ценами и кнопкой «Забронировать».</p>
        <div class="acts">
          <a class="btn big" href="#plan-trip">Спланировать поездку</a>
          ${plan ? '<a class="btn ghost big" href="#my-trip">Моя поездка</a>' : '<a class="btn ghost big" href="#how">Как это работает</a>'}
        </div>
      </div>
      <div class="board" aria-label="Примеры маршрутов">
        <div class="bh"><span>Идеи маршрутов</span><span>Примеры</span></div>
        ${BOARD.map((r,i) => `<div class="brow flip" style="animation-delay:${i*90}ms"><span class="code">${r[0]}<i> → </i>${r[1]}</span><span class="what">${esc(r[2])}</span><span class="st">${esc(r[3])}</span></div>`).join('')}
      </div>
    </section>
  </div>
  <section class="band" id="how"><div class="wrap">
    <h2>Как это работает</h2>
    <p class="sub">От вопросов до брони — пара минут.</p>
    <div class="grid3">
      <article class="tile"><span class="n">01</span><h3>Отвечаете на вопросы</h3><p class="muted">Кто едет и откуда, паспорт, куда тянет, даты, бюджет, какие перелёты и жильё нравятся.</p></article>
      <article class="tile"><span class="n">02</span><h3>Claude строит маршрут</h3><p class="muted">Выбирает направление под сезон и визы, раскладывает поездку по городам и дням.</p></article>
      <article class="tile"><span class="n">03</span><h3>Подбираем реальные варианты</h3><p class="muted">Настоящие рейсы, жильё с фото и экскурсии с ценами. Лучший вариант выбран за вас, остальные рядом.</p></article>
    </div>
  </div></section>
  <section class="band" id="sources"><div class="wrap">
    <h2>Откуда реальные цены</h2>
    <p class="sub">Скоро цены и наличие будут приходить прямо от партнёров в момент поиска. Пока Claude даёт примерные цены и ссылки на поиск.</p>
    <div class="grid3">
      ${SOURCES.map(s => `<article class="tile"><div class="row" style="justify-content:space-between"><h3>${esc(s.server)}</h3><span class="pill" data-src="${esc(s.server)}">проверяю…</span></div><p class="muted" style="font-size:15px">${esc(s.what)}</p></article>`).join('')}
    </div>
  </div></section>`;
  paintSources();
  if(sessionNote){ const n = document.createElement('p'); n.className = 'note'; n.style.marginTop = '8px'; n.textContent = sessionNote; app.querySelector('.hero > div').appendChild(n); }
}

/* ---------- quiz builders ---------- */
function chips(key, options, multi, cls){
  const wrap = document.createElement('div');
  wrap.className = cls || 'chips';
  wrap.setAttribute('role', 'group');
  options.forEach(o => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = o;
    b.setAttribute('aria-pressed', multi ? S[key].includes(o) : S[key] === o);
    b.onclick = () => {
      if(multi){
        const set = new Set(S[key]);
        set.has(o) ? set.delete(o) : set.add(o);
        if(key === 'regions'){
          if(o === 'Без разницы' && set.has(o)){ set.clear(); set.add(o); }
          else set.delete('Без разницы');
        }
        S[key] = [...set];
      } else S[key] = o;
      save();
      [...wrap.children].forEach((c,i) => c.setAttribute('aria-pressed', multi ? S[key].includes(options[i]) : S[key] === options[i]));
      if(wrap._after) wrap._after();
    };
    wrap.appendChild(b);
  });
  return wrap;
}
function q(label, hint, ...nodes){
  const d = document.createElement('div'); d.className = 'q';
  const l = document.createElement('div'); l.className = 'ql'; l.textContent = label; d.appendChild(l);
  if(hint){ const h = document.createElement('div'); h.className = 'hint'; h.textContent = hint; d.appendChild(h); }
  nodes.forEach(n => n && d.appendChild(n));
  return d;
}
function input(key, ph, type){
  const i = document.createElement(type === 'textarea' ? 'textarea' : 'input');
  if(type !== 'textarea') i.type = type || 'text';
  i.id = 'f-' + key; i.placeholder = ph || ''; i.value = S[key] || '';
  i.oninput = () => { S[key] = i.value; save(); };
  return i;
}
function countryInput(id, value, onPick, ph){
  const i = document.createElement('input');
  i.type = 'search'; i.id = id; i.setAttribute('list', 'countries'); i.autocomplete = 'off';
  i.placeholder = ph || 'Начните вводить страну'; i.value = value || '';
  const commit = () => {
    const v = i.value.trim();
    const hit = COUNTRIES.find(c => c.toLowerCase() === v.toLowerCase());
    if(hit) onPick(hit, i);
  };
  i.addEventListener('change', commit);
  i.addEventListener('input', () => { if(COUNTRIES.includes(i.value)) commit(); });
  return i;
}

function renderPath(){
  const p = document.createElement('nav'); p.className = 'path'; p.setAttribute('aria-label','Шаги опроса');
  p.style.setProperty('--n', STEPS.length);
  p.innerHTML = '<div class="fill"></div>';
  STEPS.forEach((s,i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = i < step ? 'done' : i === step ? 'cur' : '';
    b.innerHTML = `<span class="dot">${i <= step ? PLANE : ''}</span><span class="lbl">${esc(s)}</span>`;
    b.setAttribute('aria-label', `Шаг ${i+1}: ${s}`);
    b.onclick = () => { step = i; render(); };
    p.appendChild(b);
  });
  p.querySelector('.fill').style.width = `calc((100% - 16px) * ${step / (STEPS.length - 1)})`;
  return p;
}

function stepTravelers(card){
  const list = document.createElement('div');
  list.style.cssText = 'display:flex;flex-direction:column;gap:8px';
  const draw = () => {
    list.innerHTML = '';
    S.travelers.forEach((t,i) => {
      const r = document.createElement('div'); r.className = 'trav';
      r.innerHTML = `<span class="n">${String(i+1).padStart(2,'0')}</span>`;
      const n = document.createElement('input'); n.type='text'; n.id='trav-name-'+i; n.placeholder='Имя'; n.value=t.name;
      n.oninput = () => { t.name = n.value; save(); };
      const c = document.createElement('input'); c.type='text'; c.id='trav-city-'+i; c.className='cityin'; c.placeholder='Город вылета (любой в мире)'; c.value=t.city;
      c.oninput = () => { t.city = c.value; save(); };
      const x = document.createElement('button'); x.type='button'; x.className='x'; x.textContent='✕'; x.setAttribute('aria-label','Убрать попутчика');
      x.disabled = S.travelers.length <= 1;
      x.onclick = () => { S.travelers.splice(i,1); save(); draw(); };
      r.append(n,c,x); list.appendChild(r);
    });
  };
  draw();
  const add = document.createElement('button'); add.type='button'; add.className='btn ghost small'; add.textContent='+ Добавить попутчика';
  add.style.alignSelf = 'flex-start';
  add.onclick = () => { if(S.travelers.length < 8){ S.travelers.push({name:'',city:S.travelers[0]?.city||''}); save(); draw(); } };
  card.append(q('Кто летит и откуда', 'Если вылетаете из разных городов, впишите каждому свой: маршрут сведёт вас в одной точке.', list, add));

  const quick = chips('citizenship', ['Израиль','Россия','Украина','Беларусь','Казахстан','Германия','США'], false);
  const ci = countryInput('f-citizenship', COUNTRIES.includes(S.citizenship) ? S.citizenship : '', (c) => { S.citizenship = c; save(); [...quick.children].forEach(b => b.setAttribute('aria-pressed', b.textContent === c)); }, 'Или найдите свою страну в списке');
  quick._after = () => { ci.value = S.citizenship; };
  card.append(q('Гражданство (паспорт)', 'Все страны мира. От паспорта зависят визы, транзит и способы оплаты.', quick, ci));
}
function stepWhere(card){
  const box = document.createElement('div'); box.style.cssText = 'display:flex;flex-direction:column;gap:10px';
  const picked = document.createElement('div'); picked.className = 'picked';
  const drawPicked = () => {
    picked.innerHTML = '';
    S.destCountries.forEach(c => {
      const s = document.createElement('span'); s.textContent = c;
      const x = document.createElement('button'); x.type='button'; x.textContent='✕'; x.setAttribute('aria-label','Убрать '+c);
      x.onclick = () => { S.destCountries = S.destCountries.filter(v => v !== c); save(); drawPicked(); };
      s.appendChild(x); picked.appendChild(s);
    });
  };
  const ci = countryInput('f-dest', '', (c, el) => { if(!S.destCountries.includes(c)){ S.destCountries.push(c); save(); drawPicked(); } el.value = ''; }, 'Добавьте страну: Япония, Мексика, Италия…');
  const txt = input('destText', 'Города или места, если уже знаете: Киото, Тулум, Амальфи');
  box.append(ci, picked, txt);
  drawPicked();
  const mode = chips('destMode', ['Посоветуй','Знаю куда','Выбери из моего списка'], false, 'seg');
  box.hidden = S.destMode === 'Посоветуй';
  mode._after = () => { box.hidden = S.destMode === 'Посоветуй'; };
  card.append(q('Направление', '«Выбери из моего списка» — Claude выберет лучшую страну из тех, что вы добавите.', mode, box));
  card.append(q('Какой отдых хотите', 'Можно выбрать несколько.', chips('vibes', ['Море и пляж','Большие города','Горы и природа','Гастрономия','Ночная жизнь','История и музеи','Шопинг','Экзотика','Активный спорт','Спокойный отдых','Фестивали и события','Сафари и дикая природа'], true)));
  card.append(q('Регион', null, chips('regions', ['Без разницы','Европа','Азия','Ближний Восток','Кавказ и Центральная Азия','Африка','Северная Америка','Латинская Америка','Карибы','Океания'], true)));
  card.append(q('Сколько стран', null, chips('combo', ['Одна страна','2–3 страны за поездку'], false, 'seg')));
}
function stepWhen(card){
  const sel = document.createElement('select'); sel.id='f-month';
  MONTHS.forEach(m => { const o = document.createElement('option'); o.value=m.v; o.textContent=m.t; sel.appendChild(o); });
  sel.value = S.month; sel.onchange = () => { S.month = sel.value; save(); };
  const g = document.createElement('div'); g.className='grid2';
  g.append(q('Месяц', null, sel), q('Точная дата вылета', 'Необязательно', input('exactDate', '', 'date')));
  card.append(g);
  const r = document.createElement('div'); r.className='range';
  const out = document.createElement('output');
  const rng = document.createElement('input'); rng.type='range'; rng.id='f-nights'; rng.min=3; rng.max=30; rng.value=S.nights;
  const upd = () => { out.textContent = `${S.nights} ${plural(S.nights,'ночь','ночи','ночей')}`; };
  rng.oninput = () => { S.nights = +rng.value; save(); upd(); }; upd();
  r.append(out, rng);
  card.append(q('Длительность', null, r));
  card.append(q('Гибкость по датам', 'Чем гибче, тем дешевле билеты.', chips('flex', ['Даты фиксированы','±3 дня','Любые дни месяца'], false, 'seg')));
}
const BUD = {'₪':{min:1000,max:30000,step:500,def:6000}, '₽':{min:30000,max:700000,step:10000,def:150000}, '$':{min:300,max:8000,step:100,def:1700}, '€':{min:300,max:8000,step:100,def:1600}};
function stepBudget(card){
  const r = document.createElement('div'); r.className='range';
  const out = document.createElement('output');
  const rng = document.createElement('input'); rng.type='range'; rng.id='f-budget';
  const upd = () => { out.textContent = `${fmt(S.budget)} ${S.currency}`; };
  const setup = () => {
    const b = BUD[S.currency];
    rng.min=b.min; rng.max=b.max; rng.step=b.step;
    if(S.budget < b.min || S.budget > b.max) S.budget = b.def;
    rng.value = S.budget; upd();
  };
  rng.oninput = () => { S.budget = +rng.value; save(); upd(); };
  const cur = chips('currency', ['₪','$','€','₽'], false, 'seg');
  cur._after = () => { S.budget = BUD[S.currency].def; save(); setup(); };
  setup();
  r.append(out, rng);
  card.append(q('Валюта', null, cur));
  card.append(q('Бюджет на одного человека за всю поездку', 'Перелёты, жильё, еда, транспорт и развлечения вместе.', r));
  card.append(q('Что важнее', null, chips('priority', ['Максимально дёшево','Баланс','Комфорт'], false, 'seg')));
}
function stepFlight(card){
  card.append(q('Пересадки', null, chips('stops', ['Только прямые','До 1 пересадки','Неважно, лишь бы дешевле'], false, 'seg')));
  card.append(q('Багаж', null, chips('bags', ['Только ручная кладь','Один чемодан на всех','Чемодан у каждого'], false, 'seg')));
  card.append(q('Жильё', null, chips('stay', ['Хостел','Отель 3*','Отель 4–5*','Апартаменты','Дом или вилла'], false)));
  card.append(q('Как селимся', null, chips('room', ['Один номер на всех','Раздельные комнаты'], false, 'seg')));
  card.append(q('Что важно в жилье', null, chips('stayWants', ['Близко к центру','У моря','Кухня','Бассейн','Тихий район','Хороший Wi‑Fi','Завтрак включён','Бесплатная отмена'], true)));
}
function stepDetails(card){
  card.append(q('Темп поездки', null, chips('pace', ['Расслабленно','Сбалансированно','Насыщенно'], false, 'seg')));
  card.append(q('Что ещё учесть', 'Аэропорты, которых избегать, здоровье, обязательные места, события, удалённая работа.', input('notes', 'Например: хотим попасть на концерт 15-го, один из нас не любит ночные рейсы', 'textarea')));
}
function destSummary(){
  if(S.destMode === 'Посоветуй') return 'подобрать';
  const c = S.destCountries.join(', ');
  return (S.destMode === 'Выбери из моего списка' ? 'выбрать из: ' : '') + ([c, S.destText].filter(Boolean).join('; ') || 'не указано');
}
function stepReview(card){
  const dl = document.createElement('dl'); dl.className='review';
  [
    ['Попутчики', S.travelers.map(t => `${t.name || 'без имени'} (${t.city || '?'})`).join(', ')],
    ['Гражданство', S.citizenship || '—'],
    ['Направление', destSummary()],
    ['Отдых', S.vibes.join(', ') || '—'],
    ['Регион', S.regions.join(', ') || '—'],
    ['Стран', S.combo],
    ['Когда', `${MONTHS.find(m => m.v === S.month)?.t || S.month}${S.exactDate ? ', вылет ' + S.exactDate : ''}, ${S.nights} ${plural(S.nights,'ночь','ночи','ночей')}, ${S.flex}`],
    ['Бюджет', `${fmt(S.budget)} ${S.currency} на человека · ${S.priority}`],
    ['Перелёт', `${S.stops} · ${S.bags}`],
    ['Жильё', `${S.stay} · ${S.room} · ${S.stayWants.join(', ')}`],
    ['Темп', S.pace],
    ['Пожелания', S.notes || '—']
  ].forEach(([k,v]) => { const dt=document.createElement('dt'); dt.textContent=k; const dd=document.createElement('dd'); dd.textContent=v; dl.append(dt,dd); });
  card.append(dl);
  const n = document.createElement('p'); n.className='note';
  n.textContent = 'Claude построит маршрут, а затем мы найдём реальные рейсы на Kiwi.com, жильё с фото и экскурсии на Booking.com. Это займёт около минуты.';
  card.append(n);
}
const STEP_FNS = [stepTravelers, stepWhere, stepWhen, stepBudget, stepFlight, stepDetails, stepReview];

function renderQuiz(app){
  const col = document.createElement('div'); col.className = 'col';
  col.appendChild(renderPath());
  const card = document.createElement('section'); card.className='card';
  const head = document.createElement('div'); head.style.cssText='display:flex;flex-direction:column;gap:4px';
  head.innerHTML = `<span class="eyebrow">Шаг ${step+1} из ${STEPS.length}</span><h2>${esc(STEPS[step])}</h2>`;
  card.append(head);
  STEP_FNS[step](card);
  const nav = document.createElement('div'); nav.className='navrow';
  const back = document.createElement('button'); back.type='button'; back.className='btn ghost'; back.textContent='Назад';
  back.disabled = step === 0; back.onclick = () => { step--; render(); };
  const next = document.createElement('button'); next.type='button'; next.className='btn';
  if(step < STEPS.length - 1){ next.textContent='Далее'; next.onclick = () => { step++; render(); }; }
  else { next.textContent='Собрать маршрут'; next.onclick = () => build(); }
  nav.append(back, next);
  card.append(nav);
  col.appendChild(card);
  app.appendChild(col);
}

/* ---------- route generation (server) ---------- */
const ERR = {
  rate_limited:'Сегодня вы уже собрали много поездок. Попробуйте через час.',
  upstream_busy:'Claude сейчас перегружен. Попробуйте через минуту.',
  upstream_error:'Не удалось связаться с Claude. Попробуйте ещё раз.',
  server_not_configured:'Сайт ещё не настроен: на сервере нет ключа Claude API.',
  too_long:'Маршрут получился слишком длинным. Сократите поездку или пожелания.',
  bad_request:'Не удалось отправить ответы. Обновите страницу.',
  not_granted:'Странице не разрешено обращаться к Claude. Разрешить можно в меню разрешений вверху.',
  sampling_disabled:'Claude недоступен для этого аккаунта.',
  rate_limited:'Слишком много запросов или исчерпан лимит. Попробуйте чуть позже.',
  session_expired:'Сессия истекла: войдите в claude.ai снова.',
  invalid_json:'Ответ пришёл в неверном формате. Попробуйте ещё раз.',
  refused:'Claude не стал отвечать на этот запрос. Измените пожелания и попробуйте снова.',
  empty_completion:'Пустой ответ. Попробуйте ещё раз.',
  prompt_too_large:'Слишком длинный запрос. Сократите пожелания.'
};

/* ---------- connectors: real flights, stays, tours ---------- */
const CONN_ERR = {
  server_not_connected:'сервис не подключён',
  needs_reauth:'нужно переподключить сервис',
  not_in_manifest:'нет разрешения для этой страницы',
  consent_required:'нет разрешения для этой страницы',
  approval_required:'нет разрешения для этой страницы',
  blocked_by_policy:'заблокирован политикой организации',
  selection_required:'нужно выбрать подключение в claude.ai'
};
function connErr(e){
  const c = e && e.code;
  if(CONN_ERR[c]) return CONN_ERR[c];
  if(/isn.t confirmed|consent/i.test(String(e && e.message || ''))) return 'нет разрешения для этой страницы';
  if(c === 'server_unavailable') return 'сервис временно не отвечает';
  return 'ошибка поиска';
}
async function askAccess(){
  const perms = await permP;
  if(!perms || !perms.request) return;
  try{ await perms.request(['sample', ...SOURCES.map(s => 'mcp:' + s.server)]); }catch(e){}
}
async function callConn(mcp, server, tool, input){
  for(let a = 0; a < 2; a++){
    try{
      const r = await mcp.callTool(server, tool, input, {cache:{staleTime:600000, gcTime:1800000}});
      let p = r && r.payload !== undefined ? r.payload : r;
      if(typeof p === 'string'){ try{ p = JSON.parse(p); }catch(e){} }
      return p;
    }catch(e){
      if(e && e.retryable && a === 0){ await sleep(Math.min(e.retryAfterMs || 1500, 6000) + Math.random() * 400); continue; }
      throw e;
    }
  }
}
const ddmmyyyy = d => `${d.slice(8,10)}/${d.slice(5,7)}/${d.slice(0,4)}`;

async function searchFlight(mcp, leg){
  const n = Math.min(9, (leg.travelers && leg.travelers.length) || S.travelers.length || 1);
  const input = {flyFrom: leg.from_iata.toUpperCase(), flyTo: leg.to_iata.toUpperCase(), departureDate: ddmmyyyy(leg.date), adults: n, currency: CUR(), locale: 'ru', sort: 'price',
    departureDateFlexDays: S.flex === 'Даты фиксированы' ? 0 : S.flex === '±3 дня' ? 2 : 3};
  if(S.stops === 'Только прямые') input.max_sector_stopovers = 0;
  else if(S.stops === 'До 1 пересадки') input.max_sector_stopovers = 1;
  if(S.bags === 'Чемодан у каждого') input.adults_hold_bags = Array(n).fill(1);
  else if(S.bags === 'Один чемодан на всех') input.adults_hold_bags = [1, ...Array(n - 1).fill(0)];
  let p = await callConn(mcp, 'Kiwi.com', 'search-flight', input);
  let relaxed = false;
  if(!(p && p.itineraries && p.itineraries.length) && input.max_sector_stopovers !== undefined){
    delete input.max_sector_stopovers; relaxed = true;
    p = await callConn(mcp, 'Kiwi.com', 'search-flight', input);
  }
  const cur = (p && p.currency) || CUR();
  const offers = ((p && p.itineraries) || []).map(it => {
    const o = it.outbound || {};
    const segs = (o.segments || []).map(s => ({from:s.from, to:s.to, fromCity:s.fromCity, toCity:s.toCity, dep:s.departureTime, arr:s.arrivalTime, carrier:s.carrierName, fn:s.flightNumber}));
    return {
      title: [...new Set(segs.map(s => s.carrier).filter(Boolean))].join(' + ') || 'Рейс',
      route: (o.route || []).join(' → '), depart: o.departureTime, arrive: o.arrivalTime,
      hours: (it.totalDurationSeconds || o.durationSeconds || 0) / 3600, stops: o.stops || 0,
      price: it.price, currency: cur, per_person: it.price / n, n,
      checked: (it.baggage && it.baggage.checkedBag) || 0, cabin: (it.baggage && it.baggage.cabinBag) || 0,
      url: it.bookingUrl, photo: it.imageId ? `https://images.kiwi.com/photos/600x600/${it.imageId}.jpg` : '', source: 'Kiwi.com', segs
    };
  }).filter(o => o.price > 0);
  return pickFlights(offers, relaxed);
}
function pickFlights(offers, relaxed){
  if(!offers.length) return {offers:[], best:0, why: 'По этим датам и условиям рейсов не нашлось.'};
  const minP = Math.min(...offers.map(o => o.per_person)), minH = Math.min(...offers.map(o => o.hours || 99));
  const w = {'Максимально дёшево':0.25, 'Баланс':0.6, 'Комфорт':1.1}[S.priority] ?? 0.6;
  const score = o => o.per_person / minP + w * ((o.hours || minH) / minH) + (o.stops >= 2 ? 0.12 : 0);
  const byScore = offers.slice().sort((a,b) => score(a) - score(b));
  const cheapest = offers.reduce((a,b) => b.per_person < a.per_person ? b : a);
  const fastest = offers.reduce((a,b) => (b.hours || 99) < (a.hours || 99) ? b : a);
  const list = [byScore[0]];
  [cheapest, fastest, ...byScore].forEach(o => { if(list.length < 5 && !list.includes(o)) list.push(o); });
  list.forEach(o => { o.badges = []; if(o === cheapest) o.badges.push('Самый дешёвый'); if(o === fastest) o.badges.push('Самый быстрый'); });
  const b = list[0];
  let why = b === cheapest && b === fastest ? 'Самый дешёвый и самый быстрый одновременно.'
    : b === cheapest ? `Самый дешёвый вариант, в пути ${hrs(b.hours)}.`
    : `Лучшее сочетание цены и времени: на ${hrs(Math.max(0, cheapest.hours - b.hours))} быстрее самого дешёвого, разница ${fmt(b.per_person - cheapest.per_person)} ${S.currency} на человека.`;
  if(relaxed) why += ' Рейсов с вашим числом пересадок не нашлось, поэтому показаны варианты с большим количеством.';
  return {offers: list, best: 0, why};
}

const STAY_TYPES = {'Хостел':['HOSTEL'], 'Апартаменты':['APARTMENT'], 'Дом или вилла':['VILLA','HOLIDAY_HOME'], 'Отель 3*':['HOTEL'], 'Отель 4–5*':['HOTEL','RESORT']};
const FEAT_KEEP = /бассейн|кухн|завтрак|пляж|фитнес|wi-?fi|кондиционер|балкон|терраса|трансфер|спа|парковка/i;
async function searchStay(mcp, st){
  const n = S.travelers.length || 1;
  const country = ucc();
  if(!country) return {offers:[], best:0, why:'Booking.com не обслуживает пользователей с этим паспортом.'};
  const base = {destination: st.city_en || `${st.city}${st.country ? ', ' + st.country : ''}`, checkin_date: st.checkin, checkout_date: st.checkout,
    number_of_adults: Math.min(20, n), number_of_rooms: S.room === 'Раздельные комнаты' ? Math.min(10, n) : 1, user_country_code: country, user_locale: 'ru', currency: CUR()};
  const input = Object.assign({}, base);
  if(STAY_TYPES[S.stay]) input.accommodation_types = STAY_TYPES[S.stay];
  if(S.stay === 'Отель 3*') input.star_rating = [3];
  if(S.stay === 'Отель 4–5*') input.star_rating = [4,5];
  if(S.stayWants.includes('Завтрак включён')) input.meal_plan = 'breakfast_included';
  if(S.stayWants.includes('Бесплатная отмена')) input.cancellation_type = 'free_cancellation';
  if(S.stayWants.includes('Бассейн')) input.facilities = ['SWIMMING_POOL'];
  let p = await callConn(mcp, 'Booking.com', 'accommodations_search', input);
  let relaxed = false;
  if(!(p && p.accommodations && p.accommodations.length)){ relaxed = true; p = await callConn(mcp, 'Booking.com', 'accommodations_search', base); }
  const offers = ((p && p.accommodations) || []).map(a => ({
    id: a.id, title: a.name, url: a.url, price: a.price && a.price.book, currency: a.price && a.price.currency,
    per_person: (a.price && a.price.book || 0) / n, rating: a.rating && a.rating.review_score, reviews: a.rating && a.rating.number_of_reviews,
    stars: a.rating && a.rating.stars, type: a.accommodationType, area: a.location && a.location.district_name,
    lat: a.location && a.location.coordinates && a.location.coordinates.latitude, lng: a.location && a.location.coordinates && a.location.coordinates.longitude,
    feats: [...new Set((a.facilities || []).filter(f => FEAT_KEEP.test(f)))].slice(0, 6), source: 'Booking.com', photos: []
  })).filter(o => o.price > 0);
  const res = pickStays(offers, relaxed);
  const ids = res.offers.map(o => o.id).filter(Boolean);
  if(ids.length){
    try{
      const d = await callConn(mcp, 'Booking.com', 'accommodations_details', {accommodation_ids: ids, user_country_code: country, user_locale: 'ru'});
      (d && d.accommodations || []).forEach(x => {
        const o = res.offers.find(y => y.id === x.id);
        if(o){ o.photos = (x.photo_urls || []).filter(safeUrl).slice(0, 5); o.desc = String(x.description || '').split('\n')[0].slice(0, 420); o.checkin = x.checkin_checkout_times && x.checkin_checkout_times.checkin_from; }
      });
    }catch(e){}
  }
  return res;
}
function pickStays(offers, relaxed){
  if(!offers.length) return {offers:[], best:0, why:'На эти даты подходящего жилья не нашлось.'};
  const prices = offers.map(o => o.per_person).sort((a,b) => a - b);
  const med = prices[Math.floor(prices.length / 2)] || 1, minP = prices[0] || 1;
  const r = o => (o.rating || 7.5) - 8;
  const sc = {
    'Максимально дёшево': o => o.per_person / minP - r(o) * 0.08,
    'Баланс': o => o.per_person / med - r(o) * 0.3,
    'Комфорт': o => 0.4 * o.per_person / med - r(o) * 0.5 - ((o.stars || 3) - 3) * 0.1
  }[S.priority] || (o => o.per_person / med - r(o) * 0.3);
  const pool = offers.filter(o => !o.rating || o.rating >= 7);
  const list = (pool.length ? pool : offers).slice().sort((a,b) => sc(a) - sc(b)).slice(0, 4);
  const cheapest = list.reduce((a,b) => b.per_person < a.per_person ? b : a);
  const topRated = list.reduce((a,b) => (b.rating || 0) > (a.rating || 0) ? b : a);
  list.forEach(o => { o.badges = []; if(o === cheapest) o.badges.push('Дешевле всех'); if(o === topRated) o.badges.push('Лучшие отзывы'); });
  const b = list[0];
  let why = `Оценка гостей ${b.rating || '—'}${b.reviews ? ` (${fmt(b.reviews)} отзывов)` : ''}${b.area ? `, район ${b.area}` : ''}. ` +
    (b === cheapest ? 'И это самый выгодный из хороших вариантов.' : `Лучше всего подходит под ваш приоритет «${S.priority}».`);
  if(relaxed) why += ' С вашими фильтрами вариантов не было, поэтому показаны все типы жилья.';
  return {offers: list, best: 0, why};
}
async function searchTours(mcp, city_en, start, end){
  const country = ucc();
  if(!country) return [];
  const input = {destination: city_en, user_country_code: country, user_locale: 'ru', currency: CUR()};
  const days = (Date.parse(start) - Date.now()) / 864e5;
  if(isDate(start) && isDate(end) && days >= 0 && days < 175){ input.start_date = start; input.end_date = end; }
  const p = await callConn(mcp, 'Booking.com', 'attractions_search', input);
  return ((p && p.attractions) || [])
    .filter(a => !/airport|аэропорт|fast[- ]?track|transfer|трансфер|sim ?card|esim/i.test(a.name || ''))
    .map(a => ({title: a.name, url: a.url, price: a.price && a.price.amount, currency: a.price && a.price.currency, rating: a.ratings && a.ratings.score, reviews: a.ratings && a.ratings.number_of_reviews}))
    .sort((a,b) => (b.rating || 0) * Math.log10((b.reviews || 1) + 1) - (a.rating || 0) * Math.log10((a.reviews || 1) + 1))
    .slice(0, 6);
}

function liveTargets(){
  const legs = (plan.legs || []).map((l,i) => ({kind:'leg', i, ok:(!l.mode || l.mode === 'flight') && isIata(l.from_iata) && isIata(l.to_iata) && isDate(l.date)})).filter(x => x.ok);
  const stays = (plan.stays || []).map((s,i) => ({kind:'stay', i, ok:isDate(s.checkin) && isDate(s.checkout)})).filter(x => x.ok);
  const cities = [];
  (plan.stays || []).forEach(s => { const k = s.city_en || s.city; if(k && !cities.some(c => c.key === k)) cities.push({kind:'tours', key:k, city:s.city, start:s.checkin, end:s.checkout}); });
  return [...legs, ...stays, ...cities];
}
async function fetchReal(targets, onStep){
  if(!LIVE) return {filled:0, total:0, fails:[]};
  const mcp = await mcpP;
  if(!mcp) return {err:'Реальные цены работают на claude.ai.'};
  let listed = null;
  try{ listed = await mcp.listTools(); }catch(e){}
  const has = s => !listed || (listed.servers || []).some(x => x.server === s && x.tools && x.tools.length);
  const fails = new Map();
  const note = (server, msg) => { if(!fails.has(server)) fails.set(server, msg); };
  if(!has('Kiwi.com')) note('Kiwi.com', 'сервис не подключён');
  if(!has('Booking.com')) note('Booking.com', 'сервис не подключён');
  plan.tours = plan.tours || {};
  let done = 0;
  const run = async t => {
    const server = t.kind === 'leg' ? 'Kiwi.com' : 'Booking.com';
    if(fails.get(server) === 'сервис не подключён' || fails.get(server) === 'нет разрешения для этой страницы'){ done++; onStep && onStep(t, done); return; }
    try{
      if(t.kind === 'leg'){ const r = await searchFlight(mcp, plan.legs[t.i]); plan.legs[t.i].live = Object.assign(r, {at:new Date().toISOString()}); }
      else if(t.kind === 'stay'){ const r = await searchStay(mcp, plan.stays[t.i]); plan.stays[t.i].live = Object.assign(r, {at:new Date().toISOString()}); }
      else plan.tours[t.key] = await searchTours(mcp, t.key, t.start, t.end);
    }catch(e){ note(server, connErr(e)); }
    done++; onStep && onStep(t, done);
  };
  const queue = targets.slice();
  await Promise.all([0,1,2].map(async () => { while(queue.length){ await run(queue.shift()); } }));
  recalcBudget();
  const filled = (plan.legs || []).filter(l => l.live && l.live.offers.length).length + (plan.stays || []).filter(s => s.live && s.live.offers.length).length;
  return {filled, total: targets.filter(t => t.kind !== 'tours').length, fails: [...fails].map(([s,m]) => `${s}: ${m}`)};
}
const mid = (a,b) => ((+a || 0) + (+b || +a || 0)) / ((+a || +b) ? 2 : 1);
const bestOf = x => x && x.live && x.live.offers && x.live.offers.length ? (x.live.offers[x.live.best] || x.live.offers[0]) : null;
function recalcBudget(){
  const legs = plan.legs || [], stays = plan.stays || [];
  if(!legs.concat(stays).some(bestOf)) return;
  const b = plan.budget = plan.budget || {};
  if(b.est_flights === undefined){ b.est_flights = b.flights; b.est_stays = b.stays; b.est_note = b.note; }
  const n = S.travelers.length || 1;
  const share = l => (l.travelers && l.travelers.length ? l.travelers.length : n) / n;
  b.flights = Math.round(legs.reduce((a,l) => a + (bestOf(l) ? bestOf(l).per_person : mid(l.price_min, l.price_max)) * share(l), 0));
  b.stays = Math.round(stays.reduce((a,s) => a + (bestOf(s) ? bestOf(s).per_person : mid(s.price_night_min, s.price_night_max) * (+s.nights || 0)), 0));
  b.total = ['flights','stays','food','local','activities'].reduce((a,k) => a + (+b[k] || 0), 0);
  b.fits = b.total <= S.budget;
  b.real = true;
  b.note = b.fits ? 'Перелёты и жильё посчитаны по реальным ценам выбранных вариантов, еда и развлечения — оценка.' : 'С реальными ценами бюджет превышен. Выберите вариант подешевле или попросите перестроить маршрут дешевле.';
}

/* ---------- build ---------- */
function setLoading(title, lines){
  const app = document.getElementById('app');
  app.innerHTML = `<div class="col"><section class="card"><div class="loading">
    <div class="runway"></div><h2 id="ld-t">${esc(title)}</h2>
    <div class="steps-live" id="ld-steps">${lines.map((l,i) => `<div data-i="${i}"><i></i><span>${esc(l)}</span></div>`).join('')}</div>
    <p class="muted" id="ld-s"></p>
    <button type="button" class="btn ghost small" id="stop">Остановить</button>
  </div></section></div>`;
  document.getElementById('stop').onclick = () => ctl && ctl.abort();
}
function markStep(i, state, text){
  const el = document.querySelector(`#ld-steps [data-i="${i}"]`);
  if(!el) return;
  el.className = state;
  el.querySelector('i').textContent = state === 'ok' ? '✓' : '';
  if(text) el.querySelector('span').textContent = text;
}
async function requestPlan(extra, onChars){
  const res = await fetch('/api/plan', {
    method:'POST', headers:{'content-type':'application/json'}, signal: ctl.signal,
    body: JSON.stringify({answers:S, extra: extra || '', currentPlan: extra ? slimPlan() : undefined})
  });
  if(!res.ok || !res.body){
    let code = 'upstream_error';
    try{ code = (await res.json()).code || code; }catch(e){}
    throw {code};
  }
  const reader = res.body.getReader(), dec = new TextDecoder();
  let buf = '', plan = null;
  for(;;){
    const {value, done} = await reader.read();
    if(done) break;
    buf += dec.decode(value, {stream:true});
    let nl;
    while((nl = buf.indexOf('\n')) >= 0){
      const line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1);
      if(!line) continue;
      const ev = JSON.parse(line);
      if(ev.type === 'progress') onChars(ev.chars);
      else if(ev.type === 'plan') plan = ev.plan;
      else if(ev.type === 'error') throw {code: ev.code};
    }
  }
  if(!plan) throw {code:'upstream_error'};
  return plan;
}
function slimPlan(){
  if(!plan) return null;
  const p = Object.assign({}, plan); delete p.liveInfo; delete p.tours;
  p.legs = (plan.legs || []).map(l => { const c = Object.assign({}, l); delete c.live; return c; });
  p.stays = (plan.stays || []).map(l => { const c = Object.assign({}, l); delete c.live; return c; });
  return p;
}
async function build(extra){
  view = 'loading'; paintMenu();
  ctl = new AbortController();
  setLoading(extra ? 'Перестраиваю поездку' : 'Собираю вашу поездку', LIVE ? ['Строю маршрут под ваши ответы', 'Ищу реальные рейсы', 'Подбираю жильё с фото', 'Нахожу экскурсии и билеты'] : ['Строю маршрут под ваши ответы']);
  markStep(0, 'on');
  const done = () => { ctl = null; };
  try{
    plan = await requestPlan(extra, chars => { const s = document.getElementById('ld-s'); if(s) s.textContent = `Claude пишет маршрут… ${fmt(chars)} знаков`; });
  }catch(e){
    done();
    if(e && (e.code === 'cancelled' || e.name === 'AbortError')){ route(); return; }
    showError(ERR[e && e.code] || 'Связь прервалась. Попробуйте ещё раз.'); return;
  }
  busy = {};
  if(!extra){ checks = {}; store.set('trip.checks', checks); }
  markStep(0, 'ok', `Маршрут готов: ${(plan.destinations || []).map(d => d.city).join(' → ')}`);
  if(LIVE){
    const targets = liveTargets();
    const r = await fetchReal(targets);
    plan.liveInfo = r;
  }
  done();
  store.set('trip.plan', plan);
  go('my-trip');
}
function showError(msg){
  view = 'error';
  document.getElementById('app').innerHTML = `<div class="col"><section class="card"><p class="err">${esc(msg)}</p><div class="navrow"><button type="button" class="btn ghost" id="eb">Вернуться</button></div></section></div>`;
  document.getElementById('eb').onclick = () => route();
}
async function refreshReal(kinds, i){
  const key = kinds + (i ?? '');
  busy[key] = true; render();
  await askAccess();
  let targets = liveTargets();
  if(kinds !== 'all') targets = targets.filter(t => t.kind === kinds && (i === undefined || t.i === i || t.key === i));
  const r = await fetchReal(targets);
  plan.liveInfo = r.err ? {filled:0, total:0, fails:[r.err]} : r;
  busy[key] = false;
  store.set('trip.plan', plan);
  const y = window.scrollY; render(); window.scrollTo(0, y);
}
async function openPerms(){
  const perms = await permP;
  try{ if(!perms) throw 0; await perms.manage(); }catch(e){ document.querySelectorAll('[data-permmsg]').forEach(n => n.hidden = false); }
}
/* ---------- trip pages ---------- */
const money = (a,b) => (a || b) ? `${fmt(a)}${b && b !== a ? '–' + fmt(b) : ''} ${esc(S.currency)}` : '';
const curOf = o => o && o.currency && o.currency !== CUR() ? o.currency : S.currency;
const imgBox = (url, alt) => safeUrl(url) ? `<div class="ph"><img src="${esc(url)}" alt="${esc(alt)}" loading="lazy" referrerpolicy="no-referrer" data-img></div>` : '';
const mapLink = q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const picsLink = q => `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`;
function legLinks(l){
  const n = Math.min(9, Math.max(1, (l.travelers && l.travelers.length) || S.travelers.length));
  if(l.mode && l.mode !== 'flight') return `<a href="https://www.google.com/search?q=${encodeURIComponent(`${l.from_city} ${l.to_city} ${l.mode === 'train' ? 'поезд' : l.mode === 'ferry' ? 'паром' : 'автобус'} билеты`)}" target="_blank" rel="noopener">Найти билеты</a>`;
  if(!isIata(l.from_iata) || !isIata(l.to_iata)) return '';
  const f = l.from_iata.toUpperCase(), t = l.to_iata.toUpperCase();
  return `<a href="https://www.kiwi.com/ru/search/results/${f.toLowerCase()}/${t.toLowerCase()}/${isDate(l.date) ? l.date : 'anytime'}/no-return" target="_blank" rel="noopener">Все рейсы на Kiwi.com</a>`
    + `<a href="https://www.google.com/travel/flights?q=${encodeURIComponent(`Flights from ${f} to ${t}${isDate(l.date) ? ' on ' + l.date : ''}`)}" target="_blank" rel="noopener">Google Flights</a>`;
}
function stayLinks(s){
  const n = S.travelers.length, dates = isDate(s.checkin) && isDate(s.checkout);
  return `<a href="https://www.booking.com/searchresults.html?ss=${encodeURIComponent(s.city_en || s.city)}${dates ? `&checkin=${s.checkin}&checkout=${s.checkout}` : ''}&group_adults=${n}" target="_blank" rel="noopener">Всё жильё на Booking</a>`
       + `<a href="https://www.airbnb.com/s/${encodeURIComponent(s.city_en || s.city)}/homes?adults=${n}${dates ? `&checkin=${s.checkin}&checkout=${s.checkout}` : ''}" target="_blank" rel="noopener">Airbnb</a>`;
}
function tabsBar(){
  return `<nav class="tabs" aria-label="Разделы поездки">${TABS.map((t,i) => `<a href="#${t[0]}"${t[0] === tab ? ' aria-current="page"' : ''}><b>${i+1}</b>${t[1]}</a>`).join('')}</nav>`;
}
function pager(){
  const i = TABS.findIndex(t => t[0] === tab);
  const prev = TABS[i-1], next = TABS[i+1];
  return `<div class="pager">${prev ? `<a href="#${prev[0]}"><span>← Назад</span><b>${prev[1]}</b></a>` : '<span></span>'}${next ? `<a class="next" href="#${next[0]}"><span>Дальше →</span><b>${next[1]}</b></a>` : '<a class="next" href="#plan-trip"><span>Новая поездка</span><b>Спланировать ещё</b></a>'}</div>`;
}
function head(eyebrow, title, lead){
  return `<header class="pagehead"><span class="eyebrow">${esc(eyebrow)}</span><h1 style="font-size:clamp(26px,4.4vw,38px)">${esc(title)}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}</header>`;
}
function realBtn(kind, i, label, has){
  if(!LIVE) return '';
  const key = kind + (i ?? '');
  if(busy[key] || busy.all) return `<span class="status"><span class="spin"></span>Ищу реальные варианты…</span>`;
  return `<button type="button" class="btn small ${has ? 'ghost' : ''}" data-real="${kind}" ${i !== undefined ? `data-i="${esc(i)}"` : ''}>${has ? 'Обновить цены' : label}</button>`;
}

function pageOverview(){
  const P = plan, b = P.budget || {}, LI = P.liveInfo;
  const firstDate = (P.legs || []).find(l => isDate(l.date))?.date;
  const nights = (P.destinations || []).reduce((a,d) => a + (+d.nights || 0), 0) || S.nights;
  const flightsBest = (P.legs || []).map(bestOf).filter(Boolean);
  const staysBest = (P.stays || []).map(bestOf).filter(Boolean);
  const placesN = (P.places || []).length + Object.values(P.tours || {}).reduce((a,x) => a + x.length, 0);
  const summ = {
    'trip-flights': flightsBest.length ? `${flightsBest.length} из ${(P.legs || []).length} перелётов с реальной ценой · ${fmt(flightsBest.reduce((a,o) => a + o.per_person, 0))} ${S.currency} на человека` : `${(P.legs || []).length} перелётов, цены — оценка`,
    'trip-stays': staysBest.length ? staysBest.map(o => o.title).slice(0,2).join(', ') : `${(P.stays || []).length} городов, цены — оценка`,
    'trip-places': placesN ? `${placesN} мест и экскурсий` : 'Пересоберите поездку, чтобы получить места',
    'trip-days': `${(P.days || []).length} ${plural((P.days || []).length,'день','дня','дней')} по порядку`,
    'trip-budget': b.total ? `${fmt(b.total)} ${S.currency} на человека · ${b.fits === false ? 'не укладывается' : 'укладывается'}` : '',
    'trip-docs': `Визы, риски и чек-лист из ${(P.checklist || []).length} пунктов`
  };
  const fails = (LI && LI.fails) || [];
  return `
  <section class="card">
    <div class="toolbar" style="justify-content:space-between"><span class="eyebrow">Ваша поездка</span><div class="toolbar"><a class="btn ghost small" href="#plan-trip">Изменить ответы</a><button type="button" class="btn ghost small" id="again">Собрать заново</button></div></div>
    <h1 style="font-size:clamp(28px,4.6vw,42px)">${esc(P.title || 'Поездка')}</h1>
    <p class="lead" style="color:var(--ink)">${esc(P.summary || '')}</p>
    <div class="dests">${(P.destinations || []).map(d => `<span class="dest"><b>${esc(d.city)}</b>, ${esc(d.country)} · ${esc(d.nights)} ${plural(+d.nights || 0,'ночь','ночи','ночей')}</span>`).join('')}</div>
    <div class="stats">
      <div class="stat"><div class="k">Вылет</div><div class="v">${firstDate ? dshort(firstDate) : '—'}</div></div>
      <div class="stat"><div class="k">Ночей</div><div class="v">${nights}</div></div>
      <div class="stat"><div class="k">На человека</div><div class="v">${b.total ? fmt(b.total) + ' ' + esc(S.currency) : '—'}</div></div>
    </div>
    ${(P.destinations || []).some(d => d.why) ? `<ul class="clean">${P.destinations.map(d => d.why ? `<li><b>${esc(d.city)}.</b> ${esc(d.why)}</li>` : '').join('')}</ul>` : ''}
  </section>
  ${LI ? `<section class="card status-card${fails.length || !LI.filled ? ' warn' : ''}" style="gap:12px">
    <h3>${LI.filled ? `Нашли реальные варианты: ${LI.filled} из ${LI.total}` : 'Реальные цены пока не подтянулись'}</h3>
    <p class="muted">${LI.filled ? 'Лучший вариант по каждому перелёту и жилью уже выбран под ваши ответы. Бюджет пересчитан по реальным ценам.' : 'Ниже — оценки Claude. Реальные варианты появятся, когда Kiwi.com и Booking.com ответят.'}</p>
    ${fails.length ? `<p class="hint">Не ответили: ${esc(fails.join('; '))}</p>` : ''}
    <p class="hint" data-permmsg hidden>Откройте меню разрешений вверху страницы и включите Claude, Kiwi.com и Booking.com.</p>
    <div class="toolbar">${realBtn('all', undefined, 'Найти реальные цены', LI.filled)}${fails.some(f => /разрешени|подключ/.test(f)) ? '<button type="button" class="btn ghost small" id="permbtn">Открыть разрешения</button>' : ''}</div>
  </section>` : ''}
  <section class="card">
    <h2>Поездка по шагам</h2>
    <div class="toc">${TABS.slice(1).map((t,i) => `<a href="#${t[0]}"><span class="num">${i+2}</span><span><div class="t">${t[1]}</div><div class="d">${esc(summ[t[0]] || '')}</div></span><span class="arr">→</span></a>`).join('')}</div>
  </section>
  <section class="card">
    <h2>Хотите что-то поменять?</h2>
    <div class="sugg" id="sugg">${['Сделай дешевле','Добавь ещё одну страну','Меньше пересадок','Жильё ближе к морю','Больше ночной жизни','Короче на 3 дня'].map(s => `<button type="button" class="chip">${s}</button>`).join('')}</div>
    <form class="refine" id="refine"><input type="text" id="f-refine" placeholder="Например: хочу 2 дня в Стамбуле на обратном пути" required><button class="btn" type="submit">Перестроить</button></form>
  </section>`;
}

function flightOfferDetail(o, l){
  const segs = o.segs || [];
  let tl = '';
  segs.forEach((s,i) => {
    tl += `<div class="seg-i"><span class="tm">${tshort(s.dep)}</span> ${esc(s.fromCity || s.from)} (${esc(s.from)}) → <span class="tm">${tshort(s.arr)}</span> ${esc(s.toCity || s.to)} (${esc(s.to)})<br><span class="hint">${esc(s.carrier || '')} ${esc(s.fn || '')} · ${dshort(s.dep)}</span></div>`;
    const nx = segs[i+1];
    if(nx){ const lay = (Date.parse(nx.dep) - Date.parse(s.arr)) / 36e5; if(lay > 0) tl += `<div class="seg-i lay">Пересадка в ${esc(s.toCity || s.to)}: ${hrs(lay)}${s.to !== nx.from ? ' · смена аэропорта!' : ''}${lay >= 8 ? ' · можно выйти в город' : ''}</div>`; }
  });
  const bag = o.checked ? `багаж включён (${o.checked})` : 'без сдаваемого багажа';
  return `<div class="pick">
    <div class="pick-top">
      <div style="display:flex;flex-direction:column;gap:6px"><span class="tag good">Подобрано для вас</span><h3>${esc(o.title)}</h3><span class="muted" style="font-size:14.5px">${esc(o.route)} · ${hrs(o.hours)} в пути · ${o.stops ? `${o.stops} ${plural(o.stops,'пересадка','пересадки','пересадок')}` : 'прямой'} · ${bag}</span></div>
      <div class="price">${fmt(o.per_person)} ${esc(curOf(o))}<small>на человека · всего ${fmt(o.price)} за ${o.n}</small></div>
    </div>
    ${l.live.why ? `<p class="why">${esc(l.live.why)}</p>` : ''}
    <div class="segs">${tl}</div>
    <div class="toolbar">${safeUrl(o.url) ? `<a class="btn" href="${esc(o.url)}" target="_blank" rel="noopener">Забронировать на Kiwi.com</a>` : ''}</div>
  </div>`;
}
function pageFlights(){
  const legs = plan.legs || [];
  return head('Шаг 2 · Перелёты', 'Как вы долетите', 'По каждому перелёту мы выбрали лучший реальный рейс под ваши ответы: пересадки, багаж и бюджет. Ниже — запасные варианты.') +
  legs.map((l,i) => {
    const o = bestOf(l), isFlight = !l.mode || l.mode === 'flight';
    const alts = l.live && l.live.offers ? l.live.offers.filter((x,j) => j !== l.live.best) : [];
    return `<section class="card">
      <div class="leg-head">
        <div><div class="iata">${esc((l.from_iata || '···').toUpperCase())}</div><div class="cityname">${esc(l.from_city)}</div></div>
        <div class="wire">${PLANE}</div>
        <div style="text-align:right"><div class="iata">${esc((l.to_iata || '···').toUpperCase())}</div><div class="cityname">${esc(l.to_city)}</div></div>
      </div>
      <div class="meta"><span><b>${dshort(l.date)}</b></span>${l.travelers && l.travelers.length ? `<span>Летят: <b>${esc(l.travelers.join(', '))}</b></span>` : ''}${!isFlight ? `<span><b>${esc({train:'Поезд',bus:'Автобус',ferry:'Паром'}[l.mode] || l.mode)}</b></span>` : ''}</div>
      ${o ? flightOfferDetail(o, l) : `<div class="verdict"><b>Оценка Claude: ${money(l.price_min, l.price_max)}</b> на человека${l.carriers && l.carriers.length ? ` · обычно летают ${esc(l.carriers.join(', '))}` : ''}${l.via && l.via.length ? ` · через ${esc(l.via.join(', '))}` : ''}.${l.live && !l.live.offers.length ? ` ${esc(l.live.why)}` : ''}</div>`}
      ${l.tip ? `<p class="note">${esc(l.tip)}</p>` : ''}
      ${alts.length ? `<div style="display:flex;flex-direction:column;gap:10px"><h3>Другие варианты</h3><div class="alts">${alts.map(a => `<div class="alt nothumb"><div><div class="t">${(a.badges || []).map(b => `<span class="tag warm">${esc(b)}</span> `).join('')}${esc(a.title)}</div><div class="s">${esc(a.route)} · ${dshort(a.depart)} ${tshort(a.depart)} → ${tshort(a.arrive)} · ${hrs(a.hours)} · ${a.stops ? `${a.stops} пер.` : 'прямой'}${a.checked ? ' · с багажом' : ''}</div></div><div class="p">${fmt(a.per_person)} ${esc(curOf(a))}${safeUrl(a.url) ? `<a href="${esc(a.url)}" target="_blank" rel="noopener">Забронировать →</a>` : ''}</div></div>`).join('')}</div></div>` : ''}
      <div class="toolbar">${isFlight && isIata(l.from_iata) && isIata(l.to_iata) && isDate(l.date) ? realBtn('leg', i, 'Найти реальные рейсы', !!l.live) : ''}<div class="links">${legLinks(l)}</div></div>
    </section>`;
  }).join('') + pager();
}

function photosBlock(o, big){
  const ph = (o.photos || []).filter(safeUrl);
  if(!ph.length) return safeUrl(o.url) ? `<div class="photo-links"><a href="${esc(o.url)}" target="_blank" rel="noopener">Смотреть фото на Booking →</a></div>` : '';
  return `${big ? `<div class="gallery" data-gal>${ph.map((u,i) => imgBox(u, `${o.title}, фото ${i+1}`)).join('')}</div>` : ''}
    <div class="photo-links" data-photolinks ${big ? 'hidden' : ''}>${ph.map((u,i) => `<a href="${esc(u)}" target="_blank" rel="noopener">Фото ${i+1}</a>`).join('')}</div>`;
}
function pageStays(){
  const stays = plan.stays || [];
  return head('Шаг 3 · Жильё', 'Где вы будете жить', 'Под каждый город подобрано реальное жильё с Booking.com: фото, оценка гостей, район и цена за весь срок. Лучший вариант — сверху.') +
  stays.map((s,i) => {
    const o = bestOf(s);
    const alts = s.live && s.live.offers ? s.live.offers.filter((x,j) => j !== s.live.best) : [];
    return `<section class="card">
      <div style="display:flex;flex-direction:column;gap:4px"><span class="eyebrow">${dshort(s.checkin)} → ${dshort(s.checkout)} · ${esc(s.nights)} ${plural(+s.nights || 0,'ночь','ночи','ночей')}</span><h2>${esc(s.city)}${s.area ? `, район ${esc(s.area)}` : ''}</h2>${s.why ? `<p class="muted">${esc(s.why)}</p>` : ''}</div>
      ${o ? `<div class="pick">
        ${photosBlock(o, true)}
        <div class="pick-top">
          <div style="display:flex;flex-direction:column;gap:6px"><span class="tag good">Подобрано для вас</span><h3>${esc(o.title)}</h3>
            <span class="muted" style="font-size:14.5px">${[o.type, o.area, o.stars ? `${o.stars}★` : '', o.rating ? `оценка ${o.rating}${o.reviews ? ` · ${fmt(o.reviews)} отзывов` : ''}` : ''].filter(Boolean).map(esc).join(' · ')}</span></div>
          <div class="price">${fmt(o.per_person)} ${esc(curOf(o))}<small>на человека за ${esc(s.nights)} ${plural(+s.nights || 0,'ночь','ночи','ночей')} · всего ${fmt(o.price)}</small></div>
        </div>
        ${o.desc ? `<p class="desc">${esc(o.desc)}</p>` : ''}
        ${o.feats && o.feats.length ? `<div class="feats">${o.feats.map(f => `<span>${esc(f)}</span>`).join('')}</div>` : ''}
        ${s.live.why ? `<p class="why">${esc(s.live.why)}</p>` : ''}
        <div class="toolbar">${safeUrl(o.url) ? `<a class="btn" href="${esc(o.url)}" target="_blank" rel="noopener">Забронировать на Booking</a>` : ''}${o.lat ? `<a class="btn ghost small" href="${mapLink(o.lat + ',' + o.lng)}" target="_blank" rel="noopener">На карте</a>` : ''}</div>
      </div>` : `<div class="verdict"><b>Оценка Claude: ${money(s.price_night_min, s.price_night_max)}</b> за ночь на человека · ${esc(s.type || S.stay)}.${s.live && !s.live.offers.length ? ` ${esc(s.live.why)}` : ''}</div>`}
      ${alts.length ? `<div style="display:flex;flex-direction:column;gap:10px"><h3>Ещё варианты</h3><div class="alts">${alts.map(a => `<div class="alt"><div class="thumb">${(a.photos || [])[0] ? `<img src="${esc(a.photos[0])}" alt="" loading="lazy" referrerpolicy="no-referrer" data-img>` : 'нет фото'}</div><div><div class="t">${(a.badges || []).map(b => `<span class="tag warm">${esc(b)}</span> `).join('')}${esc(a.title)}</div><div class="s">${[a.area, a.rating ? `оценка ${a.rating}` : '', a.type].filter(Boolean).map(esc).join(' · ')}</div>${(a.photos || []).length ? `<div class="s">${a.photos.map((u,k) => `<a href="${esc(u)}" target="_blank" rel="noopener">фото ${k+1}</a>`).join(' · ')}</div>` : ''}</div><div class="p">${fmt(a.per_person)} ${esc(curOf(a))}<span class="hint" style="display:block;font-family:var(--f-body);font-weight:400;font-size:12.5px">на чел. за всё</span>${safeUrl(a.url) ? `<a href="${esc(a.url)}" target="_blank" rel="noopener">Открыть →</a>` : ''}</div></div>`).join('')}</div></div>` : ''}
      <div class="toolbar">${isDate(s.checkin) && isDate(s.checkout) ? realBtn('stay', i, 'Найти реальное жильё', !!s.live) : ''}<div class="links">${stayLinks(s)}</div></div>
    </section>`;
  }).join('') + pager();
}

function pagePlaces(){
  const cities = [];
  (plan.destinations || []).forEach(d => { if(!cities.some(c => c.city === d.city)) cities.push({city:d.city, key:d.city_en || d.city}); });
  (plan.places || []).forEach(p => { if(p.city && !cities.some(c => c.city === p.city)) cities.push({city:p.city, key:p.city}); });
  const stayKey = c => ((plan.stays || []).find(s => s.city === c.city) || {}).city_en || c.key;
  return head('Шаг 4 · Куда сходить', 'Что посмотреть и чем заняться', 'Рекомендации Claude под ваш тип отдыха и реальные экскурсии с ценами от Booking.com. У каждого места есть фото и карта.') +
  (cities.length ? cities.map(c => {
    const places = (plan.places || []).filter(p => p.city === c.city);
    const tours = (plan.tours || {})[stayKey(c)] || [];
    return `<section class="card">
      <h2>${esc(c.city)}</h2>
      ${places.length ? `<div class="places">${places.map(p => `<article class="place">
        <span class="tag sky" style="align-self:flex-start">${esc(p.category || 'место')}</span>
        <h3>${esc(p.name)}</h3>
        <p class="muted" style="font-size:15px">${esc(p.why || '')}</p>
        <span class="cost">${[p.time && `⏱ ${p.time}`, p.cost].filter(Boolean).map(esc).join(' · ')}</span>
        ${p.tip ? `<p class="note">${esc(p.tip)}</p>` : ''}
        <div class="links"><a href="${picsLink(p.name + ' ' + c.city)}" target="_blank" rel="noopener">Фото</a><a href="${mapLink(p.name + ', ' + c.city)}" target="_blank" rel="noopener">На карте</a></div>
      </article>`).join('')}</div>` : '<p class="muted">Пересоберите поездку, чтобы Claude добавил места для прогулок.</p>'}
      ${tours.length ? `<div style="display:flex;flex-direction:column;gap:10px"><h3>Экскурсии и билеты с ценами</h3><div class="alts">${tours.map(t => `<div class="alt nothumb"><div><div class="t">${esc(t.title)}</div><div class="s">${t.rating ? `оценка ${(+t.rating).toFixed(1)} из 5` : ''}${t.reviews ? ` · ${fmt(t.reviews)} отзывов` : ''} · Booking.com</div></div><div class="p">${t.price ? `${fmt(t.price)} ${esc(t.currency === CUR() ? S.currency : t.currency || '')}` : ''}${safeUrl(t.url) ? `<a href="${esc(t.url)}" target="_blank" rel="noopener">Фото и бронь →</a>` : ''}</div></div>`).join('')}</div></div>` : `<div class="toolbar">${realBtn('tours', stayKey(c), 'Найти экскурсии с ценами', false)}</div>`}
    </section>`;
  }).join('') : '<section class="card"><p class="muted">Мест пока нет.</p></section>') + pager();
}

function pageDays(){
  return head('Шаг 5 · По дням', 'Ваша поездка день за днём', 'Что делать каждый день, чтобы не тратить время на планирование на месте.') +
  `<section class="card"><div class="days">${(plan.days || []).map(d => `<div class="day"><div class="d">День ${esc(d.day)} · ${dshort(d.date)} · ${esc(d.city || '')}</div><p>${esc(d.plan)}</p></div>`).join('') || '<p class="muted">План по дням не получен.</p>'}</div></section>` + pager();
}
function pageBudget(){
  const b = plan.budget || {};
  const cats = [['flights','Перелёты','var(--accent)'],['stays','Жильё','var(--sky)'],['food','Еда','var(--warm)'],['local','Транспорт на месте','var(--good)'],['activities','Развлечения','var(--muted)']];
  const sum = cats.reduce((a,[k]) => a + (+b[k] || 0), 0);
  return head('Шаг 6 · Бюджет', 'Сколько это стоит', 'Расходы на одного человека за всю поездку.') +
  `<section class="card">
    <div class="price" style="font-size:36px">${fmt(b.total || sum)} ${esc(S.currency)}<small>на человека · ваш бюджет ${fmt(S.budget)} ${esc(S.currency)}</small></div>
    <div class="bar">${cats.map(([k,,c]) => +b[k] ? `<i style="width:${(+b[k]/(sum||1)*100).toFixed(1)}%;background:${c}"></i>` : '').join('')}</div>
    <div class="legend">${cats.map(([k,t,c]) => `<div><s style="background:${c}"></s>${t}${b.real && (k === 'flights' || k === 'stays') ? ' <span class="tag good" style="font-size:11px;padding:2px 7px">реально</span>' : ''}<span class="v">${fmt(b[k])}</span></div>`).join('')}</div>
    <div class="verdict" style="border-left:4px solid ${b.fits === false ? 'var(--bad)' : 'var(--good)'}"><b>${b.fits === false ? 'Не укладывается в бюджет.' : 'Укладывается в бюджет.'}</b> ${esc(b.note || '')}</div>
    ${b.real && b.est_flights !== undefined ? `<p class="hint">Оценка Claude до поиска: перелёты ${fmt(b.est_flights)}, жильё ${fmt(b.est_stays)} ${esc(S.currency)}.</p>` : ''}
  </section>
  ${(plan.tips || []).length ? `<section class="card"><h2>Как сэкономить</h2><ul class="clean">${plan.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul></section>` : ''}` + pager();
}
function pageDocs(){
  const P = plan;
  return head('Шаг 7 · Документы', 'Перед вылетом', 'Визы, что может пойти не так и список дел, чтобы ничего не забыть.') +
  ((P.visas || []).length ? `<section class="card"><h2>Визы и въезд</h2><ul class="clean">${P.visas.map(v => `<li><b>${esc(v.country)}.</b> ${esc(v.rule)}</li>`).join('')}</ul></section>` : '') +
  ((P.risks || []).length ? `<section class="card"><h2>Риски и план Б</h2><div style="display:flex;flex-direction:column;gap:12px">${P.risks.map(r => `<div class="risk"><div><span class="eyebrow" style="color:var(--warn)">Риск</span><p>${esc(r.risk)}</p></div><div><span class="eyebrow">План Б</span><p>${esc(r.plan_b)}</p></div></div>`).join('')}</div></section>` : '') +
  ((P.checklist || []).length ? `<section class="card"><h2>Чек-лист</h2><ul class="clean check">${P.checklist.map((c,i) => `<li><label><input type="checkbox" id="chk-${i}" data-i="${i}" ${checks[i] ? 'checked' : ''}><span>${esc(c)}</span></label></li>`).join('')}</ul></section>` : '') + pager();
}

function renderPlan(app){
  if(!plan){
    app.innerHTML = `<div class="col"><section class="card empty"><span class="eyebrow">Моя поездка</span><h2>Поездки пока нет</h2><p class="muted">Ответьте на 7 вопросов, и здесь появятся рейсы, жильё, места и план по дням.</p><a class="btn" href="#plan-trip">Спланировать поездку</a></section></div>`;
    return;
  }
  const page = {'my-trip':pageOverview, 'trip-flights':pageFlights, 'trip-stays':pageStays, 'trip-places':pagePlaces, 'trip-days':pageDays, 'trip-budget':pageBudget, 'trip-docs':pageDocs}[tab] || pageOverview;
  app.innerHTML = `<div class="col">${tabsBar()}${page()}</div>`;
  const cur = app.querySelector('.tabs [aria-current]'); if(cur) cur.scrollIntoView({block:'nearest', inline:'center'});
  app.querySelectorAll('img[data-img]').forEach(img => {
    const fail = () => {
      const gal = img.closest('[data-gal]');
      if(gal){ gal.hidden = true; const pl = gal.parentElement.querySelector('[data-photolinks]'); if(pl) pl.hidden = false; }
      else { const t = img.parentElement; if(t) t.textContent = 'фото по ссылке'; }
    };
    if(img.complete && !img.naturalWidth) fail(); else img.addEventListener('error', fail);
  });
  const ag = document.getElementById('again'); if(ag) ag.onclick = () => build();
  const pb = document.getElementById('permbtn'); if(pb) pb.onclick = openPerms;
  app.querySelectorAll('[data-real]').forEach(b => b.onclick = () => { const k = b.dataset.real, i = b.dataset.i; refreshReal(k, i === undefined ? undefined : (k === 'tours' ? i : +i)); });
  app.querySelectorAll('.check input').forEach(c => c.onchange = () => { checks[c.dataset.i] = c.checked; store.set('trip.checks', checks); });
  const inp = document.getElementById('f-refine');
  if(inp){
    app.querySelectorAll('#sugg .chip').forEach(c => c.onclick = () => { inp.value = c.textContent; inp.focus(); });
    document.getElementById('refine').onsubmit = e => { e.preventDefault(); const v = inp.value.trim(); if(v) build(v); };
  }
}

let agreed = !!store.get('trip.agreed');
function renderConsent(app){
  app.innerHTML = `<div class="col" style="max-width:620px">
  <section class="card consent">
    <div class="logo" style="font-size:22px"><span class="mark" style="width:44px;height:44px;border-radius:14px">${PLANE}</span>Штурман</div>
    <div style="display:flex;flex-direction:column;gap:10px"><h1 style="font-size:clamp(26px,5vw,34px)">Добро пожаловать!</h1>
    <p class="lead" style="color:var(--ink)">Штурман собирает поездку под вас: маршрут, настоящие рейсы, жильё с фото и экскурсии с ценами.</p></div>
    <div class="perm-list">
      <div><span class="num">1</span><div><b>Claude</b><p class="hint">строит маршрут по вашим ответам.</p></div></div>
      <div><span class="num">2</span><div><b>Kiwi.com</b><p class="hint">ищет реальные рейсы и цены.</p></div></div>
      <div><span class="num">3</span><div><b>Booking.com</b><p class="hint">ищет жильё, фото и экскурсии.</p></div></div>
    </div>
    <details class="terms"><summary>Условия использования</summary>
      <ul class="clean" style="font-size:14.5px;gap:8px;margin-top:10px">
        <li>Маршрут и советы составляет ИИ. Визовые правила и расписания проверяйте перед поездкой.</li>
        <li>Цены и наличие приходят от Kiwi.com и Booking.com в момент поиска и могут измениться.</li>
        <li>Бронирование и оплата происходят на сайтах партнёров, по их правилам.</li>
        <li>Ваши ответы и маршрут хранятся только в этом браузере.</li>
      </ul>
    </details>
    <label class="agree"><input type="checkbox" id="agree-box"><span>Я принимаю условия использования</span></label>
    <button type="button" class="btn big" id="agree-btn" disabled>Продолжить</button>
    <p class="hint" id="agree-msg" hidden></p>
  </section></div>`;
  const box = document.getElementById('agree-box'), btn = document.getElementById('agree-btn');
  box.onchange = () => { btn.disabled = !box.checked; };
  btn.onclick = async () => {
    btn.disabled = true; btn.textContent = 'Подключаю…';
    let st = {};
    agreed = true; store.set('trip.agreed', {at:new Date().toISOString()});
    loadSources();
    const denied = Object.keys(st || {}).filter(k => st[k] === 'denied').map(k => k === 'sample' ? 'Claude' : k.slice(4));
    if(denied.length) sessionNote = `Без разрешения для ${denied.join(', ')} часть функций не будет работать. Включить можно в меню разрешений вверху страницы.`;
    route();
  };
}
let sessionNote = '';
function paintMenu(){
  const r = view === 'quiz' ? 'plan-trip' : view === 'plan' ? 'my-trip' : view === 'home' ? 'start' : '';
  document.querySelectorAll('.menu a').forEach(a => a.dataset.r === r ? a.setAttribute('aria-current','page') : a.removeAttribute('aria-current'));
}
function render(){
  paintMenu();
  const app = document.getElementById('app');
  app.innerHTML = '';
  document.querySelector('.menu').hidden = !agreed;
  if(!agreed){ renderConsent(app); return; }
  if(view === 'quiz') renderQuiz(app);
  else if(view === 'plan') renderPlan(app);
  else renderHome(app);
}
route();
loadSources();

}
