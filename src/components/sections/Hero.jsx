import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MetallicPaint from '../reactbits/MetallicPaint/MetallicPaint.jsx';
import Waves from '../reactbits/Waves/Waves.jsx';
import DecryptedText from '../reactbits/DecryptedText/DecryptedText.jsx';
import { Mark, Wordmark } from '../ui/Brand.jsx';
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
  const src = `/video/ocean-${small ? 720 : 1280}${canAv1 ? '.av1' : ''}.mp4`;

  /* Scroll story: zoom out, settle, then the words */
  useEffect(() => {
    if (reduced || !root.current) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      });
      tl.fromTo('.splash__film', { scale: 2.4 }, { scale: 1, duration: 0.5 }, 0)
        .fromTo('.splash__mask', { scale: 1.18, yPercent: 0 }, { scale: 0.62, yPercent: -34, duration: 0.5, ease: 'power1.inOut' }, 0)
        .to('.splash__word', { opacity: 0, y: -16, duration: 0.18 }, 0.04)
        .to('.splash__foot', { opacity: 0, y: -24, duration: 0.15 }, 0)
        .to('.splash__frame', { opacity: 0.25, duration: 0.3 }, 0.1)
        .fromTo('.splash__w', { yPercent: 115, rotate: 4, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: 0.22, stagger: 0.035, ease: 'power3.out' }, 0.36)
        .fromTo('.splash__sub', { opacity: 0, y: 24, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.16 }, 0.62)
        .fromTo('.splash__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.22, ease: 'power2.inOut' }, 0.58)
        .to({}, { duration: 0.12 });
    }, root);
    return () => ctx.revert();
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
        <div className="splash__field"><Visible rootMargin="0px"><InkField /></Visible></div>
        <div className="splash__veil" aria-hidden="true" />
        <div className="splash__frame" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="splash__rings" aria-hidden="true">
          {rings.map((r) => (
            <span key={r.id} className="splash__drop" style={{ left: r.x, top: r.y }}><i /><i /><i /></span>
          ))}
        </div>

        <div className="splash__center">
          <div className="splash__mask">
            <div className="splash__tilt" ref={tilt}>
              <div className="splash__logo">
                <video ref={video} className="splash__film" src={src} poster="/video/ocean.webp" muted loop playsInline autoPlay={!reduced}
                  preload="auto" disablePictureInPicture aria-hidden="true" />
                <span className="splash__sheen" aria-hidden="true" />
              </div>
            </div>
          </div>
          <p className="splash__word"><Wordmark /></p>
        </div>

        <div className="splash__say">
          <h1 className="splash__line">
            {words.map((w, i) => (
              <span key={i}><span className="splash__wm"><span className="splash__w">{w}</span></span>{i < words.length - 1 && ' '}</span>
            ))}
          </h1>
          <span className="splash__rule" aria-hidden="true" />
          <p className="splash__sub">{SPLASH_SUB}</p>
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
