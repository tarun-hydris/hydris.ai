import { useEffect, useRef, useState } from 'react';
import { Mark, Wordmark } from '../ui/Brand.jsx';
import { Arrow } from '../ui/Icon.jsx';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { CTA, EMAIL, FOOTER, NAV, PHONE } from '../../lib/content.js';
import { setPaused, setReady, useMedia, useMotionOff, usePaused, useSystemReduced } from '../../lib/hooks.js';
import { initScroll, scrollToHashWhenReady } from '../../lib/scroll.js';

/* Stops every decorative system: video, loops, parallax, canvases and ambient animation.
   Stage buttons and content keep working. The choice is remembered across pages. */
export function PauseMotion({ className = '' }) {
  const paused = usePaused();
  const system = useSystemReduced();
  const off = paused || system;
  return (
    <button
      type="button"
      className={`pausebtn ${off ? 'is-off' : ''} ${className}`}
      aria-pressed={off}
      disabled={system}
      title={system ? 'Your system is set to reduce motion' : undefined}
      onClick={() => setPaused(!paused)}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        {off ? <path d="M5 3.4v9.2L12.4 8z" /> : <path d="M4.6 3.4h2.2v9.2H4.6zM9.2 3.4h2.2v9.2H9.2z" />}
      </svg>
      <span>Pause motion</span>
    </button>
  );
}

/* Fixed header. Its colours follow the scene beneath it (data-tone on each scene), it stays in view
   while anything inside it has keyboard focus, and the action is always one click away. */
export function Header({ page }) {
  const hdr = useRef(null);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [tone, setTone] = useState('light');
  const small = useMedia('(max-width: 640px)');

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const y = window.scrollY;
      setSolid(y > 24);
      const focused = hdr.current && hdr.current.contains(document.activeElement);
      if (focused) setHidden(false);
      else if (y > last + 6 && y > 160) setHidden(true);
      else if (y < last - 6 || y < 160) setHidden(false);
      last = y;
      // The scene directly under the header decides light or dark type
      const under = document.elementsFromPoint(window.innerWidth / 2, 34).find((el) => el.closest('[data-tone]'));
      const t = under ? under.closest('[data-tone]').dataset.tone : 'light';
      setTone((v) => (v === t ? v : t));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(measure); };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    window.addEventListener('load', on);
    // The page body is loaded lazily: measure again whenever the document changes size
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(on) : null;
    if (ro) ro.observe(document.body);
    return () => {
      window.removeEventListener('scroll', on); window.removeEventListener('resize', on); window.removeEventListener('load', on);
      if (ro) ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const items = NAV.filter((n) => n.key !== 'home');
  return (
    <header ref={hdr} className={`hdr hdr--${tone} ${hidden ? 'is-hidden' : ''} ${solid ? 'is-solid' : ''}`}>
      <a className="hdr__logo" href="/" aria-label="Hydris, home">
        <Mark className="hdr__mark" />
        <Wordmark className="hdr__word" />
      </a>
      <nav className="hdr__nav" aria-label="Primary">
        {items.map((n) => (
          <a key={n.key} href={n.href} aria-current={page === n.key ? 'page' : undefined}>{n.label}</a>
        ))}
        {!small && <a href="/contact/" aria-current={page === 'contact' ? 'page' : undefined}>Contact</a>}
      </nav>
      {!small && <PauseMotion className="hdr__pause" />}
      <a className="hdr__cta" href={CTA.href} aria-label={CTA.label}>
        {small ? CTA.short : CTA.label} <Arrow />
      </a>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="ftr" data-tone="dark">
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
        <PauseMotion className="ftr__pause" />
        <a href="#main" data-top="">Back to top <Arrow dir="up" /></a>
      </div>
    </footer>
  );
}

/* Hairline reading-progress bar along the top edge (hidden while motion is paused) */
export function ScrollBar() {
  const bar = useRef(null);
  const off = useMotionOff();
  useEffect(() => {
    if (off) return undefined;
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
  }, [off]);
  if (off) return null;
  return <div className="sbar" aria-hidden="true"><i ref={bar} /></div>;
}

export function Site({ page, children }) {
  useEffect(() => {
    setReady();
    const stop = initScroll();
    scrollToHashWhenReady();
    return stop;
  }, [page]);
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <ScrollBar />
      <Header page={page} />
      <main id="main">{children}</main>
      <Footer />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
