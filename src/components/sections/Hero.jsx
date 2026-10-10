import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MetallicPaint from '../reactbits/MetallicPaint/MetallicPaint.jsx';
import Waves from '../reactbits/Waves/Waves.jsx';
import DecryptedText from '../reactbits/DecryptedText/DecryptedText.jsx';
import { Mark } from '../ui/Brand.jsx';
import { Arrow, Reveal, Visible, Words } from '../ui/Primitives.jsx';
import { HERO, SHIFTS } from '../../lib/content.js';
import { hasWebGL2, reduced, useReady } from '../../lib/hooks.js';

gsap.registerPlugin(ScrollTrigger);

/* Hairline water field that bends around the cursor (React Bits Waves) */
export function InkField({ color = 'rgba(0, 0, 0, 0.2)', xGap = 11, yGap = 34 }) {
  if (reduced) return null;
  return (
    <Waves lineColor={color} backgroundColor="transparent" waveSpeedX={0.008} waveSpeedY={0.004}
      waveAmpX={36} waveAmpY={18} xGap={xGap} yGap={yGap} friction={0.92} tension={0.006} maxCursorMove={110} />
  );
}

/* The Hydris mark rendered as liquid metal (React Bits MetallicPaint), monochrome.
   Uses a pre-computed shape field so it appears instantly. */
export function LiquidMark() {
  if (!hasWebGL2 || reduced) return <Mark className="liquid__fallback" />;
  return (
    <MetallicPaint imageSrc="/brand/mark-field.png" preprocessed grayscale seed={21} scale={3} refraction={0} blur={0.012}
      liquid={0.42} speed={0.2} brightness={1.12} contrast={1} angle={24} fresnel={0.8} lightColor="#8a8a8a"
      darkColor="#000000" tintColor="#ffffff" patternSharpness={1} waveAmplitude={0.8} noiseScale={0.5}
      chromaticSpread={0} mouseAnimation={false} distortion={0.6} contour={0.45} />
  );
}

/* ---------------------------------------------------------------------------------------------
   Splash. Water plays inside the Hydris mark itself (the mark is the mask). As the page scrolls
   the section holds still: the footage zooms out inside the mark, the mark settles smaller and
   higher, and the line about Hydris rises into place word by word.
   --------------------------------------------------------------------------------------------- */
const SPLASH_LINE = 'The intelligence layer for industrial water.';
const SPLASH_SUB = 'Hydris turns the water data your plant already collects into decisions your team can act on.';
const canAv1 = (() => { try { return document.createElement('video').canPlayType('video/mp4; codecs="av01.0.08M.08"') !== ''; } catch { return false; } })();

export function Splash() {
  const ready = useReady();
  const root = useRef(null);
  const tilt = useRef(null);
  const video = useRef(null);
  const [rings, setRings] = useState([]);
  const small = typeof window !== 'undefined' && window.innerWidth < 760;
  const src = small ? '/video/cine-1080.mp4' : `/video/cine-1920${canAv1 ? '.av1' : ''}.mp4`;

  /* Scroll story, in two movements.
     1. The camera dives into the mark: the logo grows about a point deep inside its lower bar until
        that solid part covers the whole screen, so the water simply fills the view with no edges.
     2. The full-screen water glides back into a frame on the right while the footage settles, and the
        line about Hydris arrives bottom-left. */
  useEffect(() => {
    if (reduced || !root.current) return undefined;
    const stage = root.current.querySelector('.splash__stage');
    const win = root.current.querySelector('.splash__win');
    const AX = 0.502; const AY = 0.898;               // deepest point of the mark's lower bar
    const RATIO = 552 / 541;
    const geo = () => {
      const w = stage.clientWidth; const h = stage.clientHeight; const wide = w > 900;
      const pad = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pad')) || 24;
      const s0 = wide ? Math.max(220, Math.min(w * 0.25, 380)) : w * 0.58;
      const end = wide ? { l: w * 0.47, t: 76, r: pad, b: 36 } : { l: pad, t: 76, r: pad, b: h * 0.46 };
      // how big the mark must get for its lower bar (radius 0.18 of its width) to cover every corner
      const far = Math.hypot(Math.max(w / 2, w / 2), Math.max(h / 2, h / 2)) * 1.25;
      const zmax = Math.max(8, far / (0.18 * s0));
      return { w, h, s0, end, zmax };
    };
    let g = geo();
    const st = { z: 0, f: 0 };
    const smooth = (t) => t * t * (3 - 2 * t);
    const render = () => {
      const { w, h, s0, end, zmax } = g;
      /* 1. Dive: exponential growth reads as an even zoom; the anchor drifts to the centre */
      if (st.z < 1) {
        win.style.webkitMaskImage = ''; win.style.maskImage = '';
        const size = s0 * Math.pow(zmax, st.z * st.z);
        const startX = w / 2 - s0 / 2 + AX * s0;
        const startY = h / 2 - (s0 * RATIO) / 2 + AY * s0 * RATIO;
        const k = smooth(Math.min(1, st.z * 1.4));
        const px = startX + (w / 2 - startX) * k;
        const py = startY + (h / 2 - startY) * k;
        const pos = `${(px - AX * size).toFixed(1)}px ${(py - AY * size * RATIO).toFixed(1)}px`;
        const sz = `${size.toFixed(1)}px ${(size * RATIO).toFixed(1)}px`;
        win.style.webkitMaskSize = sz; win.style.maskSize = sz;
        win.style.webkitMaskPosition = pos; win.style.maskPosition = pos;
      } else {
        const fadeEdge = 'linear-gradient(180deg, #000 0, #000 86%, transparent 100%)';
        win.style.webkitMaskImage = fadeEdge; win.style.maskImage = fadeEdge;
        win.style.webkitMaskSize = '100% 100%'; win.style.maskSize = '100% 100%';
        win.style.webkitMaskPosition = '0 0'; win.style.maskPosition = '0 0';
      }
      /* 2. Settle into the frame */
      const f = smooth(st.f);
      win.style.left = `${(end.l * f).toFixed(1)}px`;
      win.style.top = `${(end.t * f).toFixed(1)}px`;
      win.style.right = `${(end.r * f).toFixed(1)}px`;
      win.style.bottom = `${(end.b * f).toFixed(1)}px`;
      win.style.borderRadius = `${(6 * f).toFixed(1)}px`;
    };
    render();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.8,
          onRefresh: () => { g = geo(); render(); },
        },
      });
      tl.to(st, { z: 1, duration: 0.42, ease: 'power1.in', onUpdate: render }, 0)
        .fromTo('.splash__film', { scale: 1.9 }, { scale: 1.15, duration: 0.42, ease: 'power1.inOut' }, 0)
        .to('.splash__foot', { opacity: 0, y: -24, duration: 0.12 }, 0)
        .to('.splash__frame', { opacity: 0, duration: 0.2 }, 0.05)
        .to('.splash__film', { scale: 1, duration: 0.4, ease: 'power2.out' }, 0.42)
        .fromTo('.splash__shade', { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.5)
        .fromTo('.splash__label', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.1 }, 0.56)
        .fromTo('.splash__w', { yPercent: 115, rotate: 3, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: 0.2, stagger: 0.03, ease: 'power3.out' }, 0.58)
        .fromTo('.splash__sub', { opacity: 0, y: 20, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.12 }, 0.76)
        .fromTo('.splash__cta', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.1 }, 0.82)
        .to({}, { duration: 0.08 });
    }, root);
    const onResize = () => { g = geo(); render(); };
    window.addEventListener('resize', onResize);
    return () => { ctx.revert(); window.removeEventListener('resize', onResize); };
  }, []);

  /* The mark leans towards the pointer */
  useEffect(() => {
    if (reduced || !tilt.current || !root.current) return undefined;
    const el = root.current;
    const rx = gsap.quickTo(tilt.current, 'rotationY', { duration: 1.2, ease: 'power3.out' });
    const ry = gsap.quickTo(tilt.current, 'rotationX', { duration: 1.2, ease: 'power3.out' });
    const move = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      rx(nx * 16); ry(-ny * 16);
    };
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  }, []);

  /* The footage plays only while the splash is on screen */
  useEffect(() => {
    const v = video.current;
    if (!v || reduced) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
    io.observe(root.current);
    const vis = () => { if (document.visibilityState === 'visible') v.play().catch(() => {}); };
    document.addEventListener('visibilitychange', vis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, []);

  /* A drop on the water: rings spread from where you click */
  const drop = (e) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    const id = performance.now();
    setRings((v) => [...v.slice(-4), { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRings((v) => v.filter((x) => x.id !== id)), 2400);
  };

  const words = SPLASH_LINE.split(' ');
  return (
    <section ref={root} className={`splash ${ready ? 'is-in' : ''} ${reduced ? 'splash--still' : ''}`} aria-label="Hydris">
      <div className="splash__stage" onPointerDown={drop}>
        <div className="splash__frame" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="splash__rings" aria-hidden="true">
          {rings.map((r) => (
            <span key={r.id} className="splash__drop" style={{ left: r.x, top: r.y }}><i /><i /><i /></span>
          ))}
        </div>

        <div className="splash__win">
          <div className="splash__tilt" ref={tilt}>
            <video ref={video} className="splash__film" src={src} poster="/video/cine.webp" muted loop playsInline autoPlay={!reduced}
              preload="auto" disablePictureInPicture aria-hidden="true" />
          </div>
          <span className="splash__sheen" aria-hidden="true" />
          <span className="splash__shade" aria-hidden="true" />
        </div>

        <div className="splash__say">
          <p className="splash__label">Operational Water Intelligence</p>
          <h1 className="splash__line">
            {words.map((w, i) => (
              <span key={i}><span className="splash__wm"><span className="splash__w">{w}</span></span>{i < words.length - 1 && ' '}</span>
            ))}
          </h1>
          <p className="splash__sub">{SPLASH_SUB}</p>
          <div className="splash__cta">
            <a className="pill pill--light" href="#how">How it works <Arrow dir="down" /></a>
            <a className="link-u" href="/contact/">Talk to us <Arrow /></a>
          </div>
        </div>

        <div className="splash__foot">
          <p className="splash__cap">
            {ready && !reduced
              ? <DecryptedText text="The intelligence layer for modern water operations" animateOn="inViewHover" sequential speed={26} revealDirection="start" encryptedClassName="dec-enc" />
              : <span className="dec-wait">The intelligence layer for modern water operations</span>}
          </p>
          <p className="splash__index">(01) Index</p>
          <a className="splash__scroll" href="#intro">Scroll <Arrow dir="down" /></a>
        </div>
      </div>
    </section>
  );
}

export default function Hero() {
  const ready = useReady();
  const root = useRef(null);
  const mark = useRef(null);
  const tilt = useRef(null);
  const copy = useRef(null);
  const [on, setOn] = useState(0);

  /* Scroll-linked exit: the mark drifts up and recedes, the copy lifts away */
  useEffect(() => {
    if (reduced || !root.current) return undefined;
    const ctx = gsap.context(() => {
      const trigger = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(mark.current, { yPercent: -16, scale: 0.84, opacity: 0.1, ease: 'none', scrollTrigger: trigger });
      gsap.to(copy.current, { yPercent: -7, opacity: 0.15, ease: 'none', scrollTrigger: trigger });
    }, root);
    return () => ctx.revert();
  }, []);

  /* Pointer parallax on the liquid mark */
  useEffect(() => {
    if (reduced || !tilt.current || !root.current) return undefined;
    const el = root.current;
    const rx = gsap.quickTo(tilt.current, 'rotationY', { duration: 1.1, ease: 'power3.out' });
    const ry = gsap.quickTo(tilt.current, 'rotationX', { duration: 1.1, ease: 'power3.out' });
    const mx = gsap.quickTo(tilt.current, 'x', { duration: 1.1, ease: 'power3.out' });
    const my = gsap.quickTo(tilt.current, 'y', { duration: 1.1, ease: 'power3.out' });
    const move = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      rx(nx * 14); ry(-ny * 14); mx(nx * 22); my(ny * 22);
    };
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  }, []);

  /* The three shifts take turns being the one in focus */
  useEffect(() => {
    if (!ready || reduced) return undefined;
    const id = setInterval(() => setOn((v) => (v + 1) % SHIFTS.length), 3200);
    return () => clearInterval(id);
  }, [ready]);

  return (
    <section ref={root} id="intro" className={`hero hero--intro ${ready ? 'is-in' : ''}`} aria-label="What Hydris does">
      <div className="hero__markwrap" ref={mark} aria-hidden="true" hidden><div ref={tilt} /></div>

      <div className="hero__copy grid" ref={copy}>
        <p className="s-label hero__eyebrow">
          {ready && !reduced
            ? <DecryptedText text={HERO.eyebrow} animateOn="view" sequential speed={22} revealDirection="start" encryptedClassName="dec-enc" />
            : <span className="dec-wait">{HERO.eyebrow}</span>}
        </p>
        <Words as="h2" text={HERO.title} className="hero__title" delay={0.15} />
        <Reveal as="p" className="lead hero__sub" delay={0.7}>{HERO.sub}</Reveal>
        <Reveal className="hero__cta" delay={0.85}>
          <a className="pill" href="#how">How it works <Arrow dir="down" /></a>
          <a className="link-u hero__talk" href="/contact/">Talk to us <Arrow /></a>
        </Reveal>
      </div>

      <div className="hero__shifts grid">
        <Reveal as="p" className="s-label hero__shifthead" delay={0.9}>What Hydris changes</Reveal>
        {SHIFTS.map((s, i) => (
          <Reveal className={`shift ${i === on ? 'is-on' : ''}`} key={s.from} delay={1 + i * 0.12}
            onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} tabIndex={0}>
            <span className="shift__from">{s.from}</span>
            <span className="shift__line" aria-hidden="true"><i /></span>
            <span className="shift__to">{s.to}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
