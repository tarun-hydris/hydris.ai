import { useEffect, useMemo, useRef, useState } from 'react';
import { Mark, Wordmark } from '../ui/Brand.jsx';
import { Arrow } from '../ui/Icon.jsx';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { EMAIL, FOOTER, NAV, PHONE } from '../../lib/content.js';
import { reduced, setReady, useMedia } from '../../lib/hooks.js';
import { initScroll, lockScroll, scrollToHashWhenReady } from '../../lib/scroll.js';

const session = {
  get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

/* Fixed header. mix-blend-mode: difference keeps it legible on white, black and the animated hero. */
export function Header({ page }) {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const small = useMedia('(max-width: 640px)');
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setSolid(y > 24);
        if (y > last + 6 && y > 160) setHidden(true);
        else if (y < last - 6 || y < 160) setHidden(false);
        last = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  // On a phone the logo is the way home and Contact takes the place of the call to action
  const items = small
    ? [...NAV.filter((n) => n.key !== 'home'), { key: 'contact', label: 'Contact', href: '/contact/' }]
    : NAV;
  return (
    <header className={`hdr ${hidden ? 'is-hidden' : ''} ${solid ? 'is-solid' : ''}`}>
      <a className="hdr__logo" href="/" aria-label="Hydris, home">
        <Mark className="hdr__mark" />
        <Wordmark className="hdr__word" />
      </a>
      <nav className="hdr__nav" aria-label="Primary">
        {items.map((n, i) => (
          <span key={n.key}>
            <a href={n.href} aria-current={page === n.key ? 'page' : undefined}>{n.label}</a>
            {i < items.length - 1 && <span aria-hidden="true">,&nbsp;</span>}
          </span>
        ))}
      </nav>
      <a className="hdr__cta" href="/contact/" aria-current={page === 'contact' ? 'page' : undefined}>Talk to us <Arrow /></a>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="ftr">
      <div className="ftr__top grid">
        <div className="ftr__brand">
          <Mark className="ftr__icon" />
          <p className="ftr__lead">{FOOTER.tag}</p>
        </div>
        {FOOTER.cols.map((c) => (
          <div className="ftr__col" key={c.h}>
            <p className="ftr__h">{c.h}</p>
            {c.links.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
          </div>
        ))}
        <div className="ftr__col">
          <p className="ftr__h">Write to us</p>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a href={`tel:${PHONE.replace(/[^+\d]/g, '')}`}>{PHONE}</a>
          <span>Portland, Oregon</span>
        </div>
      </div>
      <div className="ftr__mark" aria-hidden="true"><Wordmark /></div>
      <div className="ftr__bottom">
        <span>{FOOTER.line} &copy; 2026</span>
        <span>{FOOTER.right}</span>
        <a href="#main" data-top="">Back to top <Arrow dir="up" /></a>
      </div>
    </footer>
  );
}

/* Hairline reading-progress bar along the top edge */
export function ScrollBar() {
  const bar = useRef(null);
  useEffect(() => {
    if (reduced) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <div className="sbar" aria-hidden="true"><i ref={bar} /></div>;
}

/* Counter preloader, shown once per session on the home page */
export function Preloader() {
  const skip = useMemo(() => reduced || session.get('hydris:intro') === '1', []);
  const [p, setP] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(skip);

  useEffect(() => {
    if (skip) { setReady(); scrollToHashWhenReady(); return undefined; }
    lockScroll(true);
    let fontsOk = false;
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { fontsOk = true; });
    const t0 = performance.now();
    const dur = 1100;
    let raf;
    const finish = () => {
      setTimeout(() => {
        setDone(true);
        session.set('hydris:intro', '1');
        setTimeout(() => { lockScroll(false); setReady(); scrollToHashWhenReady(); }, 380);
        setTimeout(() => setGone(true), 1300);
      }, 120);
    };
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      let v = 1 - Math.pow(1 - t, 3);
      if (!fontsOk && now - t0 < 4000) v = Math.min(v, 0.92);
      setP(Math.round(v * 100));
      if (v < 1) raf = requestAnimationFrame(tick); else finish();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [skip]);

  if (gone) return null;
  return (
    <div className={`loader ${done ? 'is-done' : ''}`} aria-hidden="true">
      <div className="loader__top">
        <span className="loader__brand"><Mark className="loader__mark" /> Hydris</span>
        <span>Operational water intelligence</span>
      </div>
      <div className="loader__bottom">
        <span className="loader__count">{p}</span>
        <span className="loader__note">Calibrating</span>
      </div>
      <div className="loader__line"><i style={{ transform: `scaleX(${p / 100})` }} /></div>
    </div>
  );
}

export function Site({ page, children }) {
  useEffect(() => {
    initScroll();
    if (page !== 'home') { setReady(); scrollToHashWhenReady(); }
  }, [page]);
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      {page === 'home' && <Preloader />}
      <ScrollBar />
      <Header page={page} />
      <main id="main">{children}</main>
      <Footer />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
