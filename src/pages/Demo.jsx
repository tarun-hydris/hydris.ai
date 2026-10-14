import { useEffect, useRef, useState } from 'react';
import Icon, { Arrow } from '../components/ui/Icon.jsx';
import { FilmButton } from '../components/ui/Film.jsx';
import { Reveal, Words } from '../components/ui/Primitives.jsx';
import { CTA, DEMO } from '../lib/content.js';

/* The product demos. Lite, Pulse and Field run as self-contained pages (public/demos/*.html) inside
   frames, so their own styles and scripts can never collide with the site. A demo loads the first time
   its tab is opened and keeps its state when you switch away. Each demo reports its height so the
   frame fits it without an inner scrollbar. The tabs follow the WAI-ARIA tabs pattern. */
const keyFromHash = () => {
  const h = window.location.hash.replace('#', '');
  const i = DEMO.items.findIndex((d) => d.key === h);
  return i < 0 ? 0 : i;
};

export default function Demo() {
  const [sel, setSel] = useState(keyFromHash);
  const [opened, setOpened] = useState(() => new Set([keyFromHash()]));
  const [heights, setHeights] = useState({});
  const tabs = useRef([]);

  const choose = (i, focus = false) => {
    setSel(i);
    setOpened((s) => (s.has(i) ? s : new Set([...s, i])));
    history.replaceState(null, '', `#${DEMO.items[i].key}`);
    if (focus && tabs.current[i]) tabs.current[i].focus();
  };

  useEffect(() => {
    const onHash = () => { const i = keyFromHash(); setSel(i); setOpened((s) => new Set([...s, i])); };
    const onMsg = (e) => {
      if (e.origin !== window.location.origin || !e.data || e.data.type !== 'hydris-demo-height') return;
      const h = Math.round(Number(e.data.height));
      if (!h || !DEMO.items.some((d) => d.key === e.data.demo)) return;
      setHeights((v) => (v[e.data.demo] === h ? v : { ...v, [e.data.demo]: Math.min(1600, Math.max(480, h)) }));
    };
    window.addEventListener('hashchange', onHash);
    window.addEventListener('message', onMsg);
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('message', onMsg); };
  }, []);

  const onKey = (e) => {
    const n = DEMO.items.length;
    if (e.key === 'ArrowRight') { e.preventDefault(); choose((sel + 1) % n, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); choose((sel - 1 + n) % n, true); }
    if (e.key === 'Home') { e.preventDefault(); choose(0, true); }
    if (e.key === 'End') { e.preventDefault(); choose(n - 1, true); }
  };

  return (
    <>
      <section className="dhero" data-tone="light" aria-labelledby="demo-title">
        <div className="dhero__grid grid">
          <Reveal as="p" className="s-label dhero__label">{DEMO.label}</Reveal>
          <Words as="h1" text={DEMO.title} className="t-l dhero__title" />
          <Reveal as="p" className="lead dhero__lead" delay={0.15}>{DEMO.lead}</Reveal>
        </div>
      </section>

      <section className="demo" aria-label="Product demos">
        <div className="demo__bar grid">
          <div className="demo__tabs" role="tablist" aria-label="Choose a product" onKeyDown={onKey}>
            {DEMO.items.map((d, i) => (
              <button
                key={d.key}
                ref={(el) => { tabs.current[i] = el; }}
                type="button"
                role="tab"
                id={`tab-${d.key}`}
                aria-selected={i === sel}
                aria-controls={`panel-${d.key}`}
                aria-label={`${d.name}: ${d.verb}`}
                tabIndex={i === sel ? 0 : -1}
                className={`demo__tab ${i === sel ? 'is-on' : ''}`}
                onClick={() => choose(i)}
              >
                <span className="demo__tn">{String(i + 1).padStart(2, '0')}</span>
                <span className="demo__tname">{d.name}</span>
                <span className="demo__tverb">{d.verb}</span>
              </button>
            ))}
          </div>
          <p className="demo__note">{DEMO.note}</p>
        </div>

        {DEMO.items.map((d, i) => (
          <div
            key={d.key}
            role="tabpanel"
            id={`panel-${d.key}`}
            aria-labelledby={`tab-${d.key}`}
            hidden={i !== sel}
            className={`demo__panel demo__panel--${d.key} grid`}
          >
            <aside className="demo__aside">
              <p className="s-label demo__verb">{d.verb}</p>
              <h2 className="t-s demo__name">{d.name}</h2>
              <p className="body demo__line">{d.line}</p>
              <p className="s-label demo__try">Try this</p>
              <ol className="demo__tries">
                {d.tries.map((t, k) => <li key={t}><span>{k + 1}</span>{t}</li>)}
              </ol>
              <a className="link-u demo__open" href={d.src} target="_blank" rel="noopener">{DEMO.open} <Arrow /></a>
            </aside>
            <div className="demo__stage">
              <div className="demo__chrome" aria-hidden="true">
                <i /><i /><i /><span>{d.name} &middot; sample plant</span>
              </div>
              {opened.has(i) ? (
                <iframe
                  className="demo__frame"
                  src={d.src}
                  title={`${d.name} interactive demo with sample data`}
                  style={{ height: `${heights[d.key] || d.height}px` }}
                  loading={i === sel ? 'eager' : 'lazy'}
                  allow="clipboard-write"
                />
              ) : (
                <div className="demo__wait" style={{ height: `${d.height}px` }} />
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="dafter sec" aria-label={DEMO.after.title}>
        <div className="dafter__grid grid">
          <Words as="h2" text={DEMO.after.title} className="t-m dafter__title" />
          <Reveal as="p" className="lead dafter__text" delay={0.1}>{DEMO.after.text}</Reveal>
          <Reveal className="dafter__cta" delay={0.2}>
            <a className="pill" href={CTA.href}>{CTA.label} <Arrow /></a>
            <FilmButton className="filmbtn">{CTA.film}</FilmButton>
            <a className="link-u" href="/platform/"><Icon name="layers" className="dafter__ico" />How the platform works</a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
