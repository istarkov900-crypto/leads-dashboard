'use client';

import { useEffect } from 'react';
// The trip planner UI is a ported vanilla-JS module; stage 2+ can move pieces into React components.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- untyped JS module
import { start } from '@/client/shturman';

export default function Home() {
  useEffect(() => {
    start();
  }, []);

  return (
    <>
      <div className="nav-band gut">
        <div className="wrap nav-in">
          <a className="logo" href="#start">
            <span className="mark" id="logomark" />
            <span className="word">Штурман</span>
          </a>
          <nav className="menu" aria-label="Разделы">
            <a href="#start" data-r="start" className="hide-sm">Главная</a>
            <a href="#my-trip" data-r="my-trip">Моя поездка</a>
            <a href="#plan-trip" data-r="plan-trip" className="cta">Спланировать</a>
          </nav>
        </div>
      </div>
      <main className="gut">
        <div id="app" />
      </main>
      <footer className="gut">
        <div className="wrap">
          Штурман собирает маршрут с помощью Claude. Бронирование — на сайтах партнёров по их правилам.
        </div>
      </footer>
      <datalist id="countries" />
    </>
  );
}
