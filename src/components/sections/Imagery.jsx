import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Frame, Photo } from '../ui/Photo.jsx';
import { Heading, Reveal } from '../ui/Primitives.jsx';
import { PHOTOS } from '../../lib/photos.js';
import { reduced, useInView, useMedia } from '../../lib/hooks.js';

gsap.registerPlugin(ScrollTrigger);

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ---------------------------------------------------------------------------------------------
   Aperture. A full-bleed photograph that opens from one of its own circles: the clarifier in the
   picture is the first thing you see, then the view widens to the whole plant as you scroll.
   --------------------------------------------------------------------------------------------- */
export function Aperture({ name, circle, kicker, title, tag, end, endSmall }) {
  const p = PHOTOS[name];
  const track = useRef(null);
  const stage = useRef(null);
  const clip = useRef(null);
  const img = useRef(null);
  const ring = useRef(null);
  const tagEl = useRef(null);
  const intro = useRef(null);
  const outro = useRef(null);

  useEffect(() => {
    if (reduced || !track.current) return undefined;
    let g = null;
    let last = 0;

    const measure = () => {
      const w = stage.current.clientWidth;
      const h = stage.current.clientHeight;
      const s = Math.max(w / p.W, h / p.H);
      const iw = p.W * s;
      const ih = p.H * s;
      const dx = (w - iw) / 2;
      const dy = (h - ih) / 2;
      const cx = dx + circle.x * iw;
      const cy = dy + circle.y * ih;
      const rImg = circle.r * iw;
      const r0 = Math.min(rImg, 0.23 * Math.min(w, h) + 0.04 * Math.max(w, h));
      const far = Math.max(Math.hypot(cx, cy), Math.hypot(w - cx, cy), Math.hypot(cx, h - cy), Math.hypot(w - cx, h - cy));
      g = { w, h, dx, dy, iw, ih, cx, cy, rImg, r0, k0: r0 / rImg, far };
      ring.current.setAttribute('viewBox', `0 0 ${w} ${h}`);
      img.current.style.transformOrigin = `${cx}px ${cy}px`;
    };

    const render = (prog) => {
      last = prog;
      if (!g) return;
      const { w, h, dx, dy, iw, ih, cx, cy, r0, k0, far } = g;
      const t = ease(clamp((prog - 0.08) / 0.74));
      const k = lerp(k0, 1, clamp(t * 1.35));
      let r = lerp(r0, far + 2, Math.pow(t, 1.35));
      if (k < 1) {
        // Never open past the edge of the (still scaled down) picture
        const L = cx - (cx - dx) * k; const R = cx + (dx + iw - cx) * k;
        const T = cy - (cy - dy) * k; const B = cy + (dy + ih - cy) * k;
        let cap = Infinity;
        if (L > 0) cap = Math.min(cap, cx - L);
        if (R < w) cap = Math.min(cap, R - cx);
        if (T > 0) cap = Math.min(cap, cy - T);
        if (B < h) cap = Math.min(cap, B - cy);
        r = Math.min(r, cap);
      }
      clip.current.style.clipPath = `circle(${r.toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px)`;
      img.current.style.transform = `scale(${k.toFixed(4)})`;

      const ringOn = 1 - clamp(t * 2.4);
      const circles = ring.current.querySelectorAll('circle');
      circles.forEach((c, i) => {
        c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r + 10 + i * 16);
      });
      ring.current.style.opacity = ringOn;
      const a = -Math.PI / 4;
      tagEl.current.style.transform = `translate(${(cx + Math.cos(a) * (r + 30)).toFixed(1)}px, ${(cy + Math.sin(a) * (r + 30)).toFixed(1)}px)`;
      tagEl.current.style.opacity = ringOn;

      const io = clamp((prog - 0.06) / 0.22);
      intro.current.style.opacity = 1 - io;
      intro.current.style.transform = `translateY(${(-io * 40).toFixed(1)}px)`;
      intro.current.style.filter = io > 0.01 ? `blur(${(io * 8).toFixed(1)}px)` : 'none';
      const oo = clamp((prog - 0.74) / 0.16);
      outro.current.style.opacity = oo;
      outro.current.style.transform = `translateY(${((1 - oo) * 30).toFixed(1)}px)`;
    };

    measure();
    render(0);
    const st = ScrollTrigger.create({
      trigger: track.current, start: 'top top', end: 'bottom bottom',
      onRefresh: (self) => { measure(); render(self.progress); },
      onUpdate: (self) => render(self.progress),
    });
    const ro = new ResizeObserver(() => { measure(); render(last); });
    ro.observe(stage.current);
    return () => { st.kill(); ro.disconnect(); };
  }, [circle.r, circle.x, circle.y, p.H, p.W]);

  if (reduced) {
    return (
      <section className="aperture aperture--static" aria-label={kicker}>
        <Frame name={name} sizes="100vw" drift={0} ratio="16 / 9" />
        <div className="aperture__static grid">
          <p className="s-label">{kicker}</p>
          <p className="t-s">{title}</p>
          <p className="lead mute">{end} {endSmall}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="aperture" ref={track} aria-label={kicker}>
      <div className="aperture__stage" ref={stage} style={{ '--bg': p.bg }}>
        <div className="aperture__clip" ref={clip}>
          <div className="aperture__img" ref={img} style={{ backgroundImage: `url("${p.lqip}")` }}>
            <Photo name={name} sizes="100vw" />
          </div>
          <div className="aperture__veil" aria-hidden="true" />
        </div>
        <svg className="aperture__ring" ref={ring} aria-hidden="true" preserveAspectRatio="none">
          <circle /><circle /><circle className="aperture__dash" />
        </svg>
        <span className="aperture__tag s-label" ref={tagEl} aria-hidden="true"><i />{tag}</span>

        <div className="aperture__intro grid" ref={intro}>
          <p className="s-label aperture__kicker">({kicker})</p>
          <p className="t-m aperture__title">{title}</p>
        </div>
        <div className="aperture__outro grid" ref={outro}>
          <p className="t-m aperture__end">{end}</p>
          <p className="lead aperture__small">{endSmall}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------------------------
   Stages. A pinned, horizontal walk through the plant. Each photograph slides past with a little
   parallax inside its frame; on small screens it becomes a native swipe row.
   --------------------------------------------------------------------------------------------- */
export function Stages({ eyebrow, index, title, lead, items }) {
  const desktop = useMedia('(min-width: 901px)');
  const pinned = desktop && !reduced;
  const track = useRef(null);
  const view = useRef(null);
  const row = useRef(null);
  const bar = useRef(null);
  const [cur, setCur] = useState(0);
  const n = items.length;

  useEffect(() => {
    if (!pinned || !track.current) return undefined;
    let max = 0;
    const measure = () => { max = Math.max(0, row.current.scrollWidth - view.current.clientWidth); };
    const render = (prog) => {
      row.current.style.transform = `translate3d(${(-prog * max).toFixed(1)}px, 0, 0)`;
      row.current.style.setProperty('--p', prog.toFixed(4));
      bar.current.style.transform = `scaleX(${prog.toFixed(4)})`;
      const c = Math.min(n - 1, Math.round(prog * (n - 1)));
      setCur((v) => (v === c ? v : c));
    };
    measure();
    const st = ScrollTrigger.create({
      trigger: track.current, start: 'top top', end: 'bottom bottom',
      onRefresh: (self) => { measure(); render(self.progress); },
      onUpdate: (self) => render(self.progress),
    });
    return () => { st.kill(); if (row.current) row.current.style.transform = ''; };
  }, [pinned, n]);

  const cards = items.map((s, i) => (
    <li className={`stg ${pinned && i === cur ? 'is-cur' : ''}`} key={s.name} style={{ '--i': i }}>
      <Frame name={s.name} ratio="4 / 5" sizes="(min-width: 901px) 34vw, 78vw" drift={0} className="stg__frame" />
      <div className="stg__cap">
        <span className="stg__n">{String(i + 1).padStart(2, '0')}</span>
        <h3 className="t-row">{s.title}</h3>
        <p className="body mute">{s.reads}</p>
      </div>
    </li>
  ));

  return (
    <section className={`stages ${pinned ? 'stages--pinned' : ''}`} ref={track} style={{ '--n': n }} aria-label={title}>
      <div className="stages__sticky">
        <header className="stages__head grid">
          <Reveal as="p" className="s-label stages__label">({index}) {eyebrow}</Reveal>
          <div className="stages__main">
            <Heading text={title} className="t-m" />
            <Reveal as="p" className="lead mute stages__lead" delay={0.12}>{lead}</Reveal>
          </div>
        </header>
        <div className="stages__view" ref={view}>
          <ol className="stages__row" ref={row} style={{ '--n': n }}>{cards}</ol>
        </div>
        {pinned && (
          <div className="stages__foot grid" aria-hidden="true">
            <span className="stages__count">{String(cur + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
            <span className="stages__bar"><i ref={bar} /></span>
            <span className="stages__hint">Scroll</span>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------------------------
   Sweep. A clarifier from above with its rake read as a live dial: an arm and a trailing sector
   turn slowly over the real tank, ticks mark the rim.
   --------------------------------------------------------------------------------------------- */
const TICKS = Array.from({ length: 72 }, (_, i) => i);
export function Sweep({ name, circle, caption, sizes = '(min-width: 901px) 40vw, 100vw' }) {
  const [ref, inView] = useInView({ threshold: 0.05 });
  return (
    <div ref={ref} className={`sweep ${inView ? 'is-on' : ''}`}>
      <Frame name={name} sizes={sizes} drift={0}
        inner={(
          <div className="sweep__dial" aria-hidden="true"
            style={{ left: `${circle.x * 100}%`, top: `${circle.y * 100}%`, width: `${circle.r * 200}%` }}>
            <span className="sweep__sector" />
            <span className="sweep__arm" />
            <svg className="sweep__ticks" viewBox="-100 -100 200 200">
              {TICKS.map((i) => (
                <line key={i} x1="0" y1={i % 6 === 0 ? -92 : -95} x2="0" y2="-99" transform={`rotate(${i * 5})`} />
              ))}
            </svg>
            <span className="sweep__hub" />
          </div>
        )}>
        {caption && <figcaption className="s-label frame__cap">{caption}</figcaption>}
      </Frame>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------
   Hotspots. An aerial of real tanks with the readings pinned where they would come from. Points
   light up one after another; the drifting one keeps pulsing.
   --------------------------------------------------------------------------------------------- */
export function Hotspots({ name, items, caption }) {
  const [ref, inView] = useInView({ threshold: 0.3, once: true });
  return (
    <div ref={ref} className={`hspots ${inView ? 'is-in' : ''}`}>
      <Frame name={name} sizes="(min-width: 1400px) 1400px, 100vw" drift={0}
        inner={(
          <div className="hspots__layer" aria-hidden="true">
            {items.map((s, i) => (
              <span className={`spot spot--${s.side} ${s.alert ? 'spot--alert' : ''}`} key={s.p}
                style={{ left: `${s.x * 100}%`, top: `${s.y * 100}%`, '--i': i }}>
                <i className="spot__dot" />
                <span className="spot__lead" />
                <span className="spot__tag"><b>{s.p}</b><span>{s.v}</span><small>{s.s}</small></span>
              </span>
            ))}
          </div>
        )}>
        {caption && <figcaption className="s-label frame__cap">{caption}</figcaption>}
      </Frame>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------
   Band. A wide photograph that opens out to the page edges as it scrolls into view, with a label
   and a caption underneath.
   --------------------------------------------------------------------------------------------- */
export function Band({ name, label, caption, ratio = '21 / 9', position, className = '' }) {
  const wrap = useRef(null);
  useEffect(() => {
    const el = wrap.current;
    if (reduced || !el) return undefined;
    const tween = gsap.fromTo(el, { clipPath: 'inset(0% 7% 0% 7%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 25%', scrub: true },
    });
    return () => { if (tween.scrollTrigger) tween.scrollTrigger.kill(); tween.kill(); };
  }, []);
  return (
    <section className={`band ${className}`} aria-label={caption}>
      <div className="band__wrap" ref={wrap}>
        <Frame name={name} ratio={ratio} position={position} sizes="100vw" drift={0.16} reveal={false} className="band__frame" />
      </div>
      {(label || caption) && (
        <div className="band__cap grid">
          {label && <Reveal as="p" className="s-label band__label">({label})</Reveal>}
          {caption && <Reveal as="p" className="lead band__text" delay={0.1}>{caption}</Reveal>}
        </div>
      )}
    </section>
  );
}

/* Three photographs at different sizes and speeds */
export function Mosaic({ items }) {
  const drifts = [0.08, 0.18, 0.12];
  return (
    <div className="mosaic grid">
      {items.map((m, i) => (
        <div className={`mosaic__cell mosaic__cell--${i + 1}`} key={m.name}>
          <Frame name={m.name} ratio={i === 1 ? '4 / 5' : '4 / 3'} sizes="(min-width: 901px) 34vw, 100vw" drift={drifts[i % 3]} delay={i * 0.12}>
            <figcaption className="s-label frame__cap"><span>{String(i + 1).padStart(2, '0')}</span>{m.caption}</figcaption>
          </Frame>
        </div>
      ))}
    </div>
  );
}

/* A water surface laid under a dark section, breathing slowly */
export function Texture({ name, className = '' }) {
  return (
    <div className={`tex ${className}`} aria-hidden="true">
      <Photo name={name} sizes="100vw" alt="" className="tex__img" />
    </div>
  );
}
