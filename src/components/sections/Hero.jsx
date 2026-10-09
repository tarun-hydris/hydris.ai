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
    <section ref={root} className={`hero ${ready ? 'is-in' : ''}`} aria-label="Hydris">
      <div className="hero__field"><Visible rootMargin="0px"><InkField /></Visible></div>
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__frame" aria-hidden="true"><i /><i /><i /><i /></div>

      <div className="hero__markwrap" ref={mark} aria-hidden="true">
        <div className="hero__tilt" ref={tilt}>
          <div className="hero__logo"><Visible rootMargin="0px"><LiquidMark /></Visible></div>
        </div>
      </div>

      <div className="hero__copy grid" ref={copy}>
        <p className="s-label hero__eyebrow">
          {ready && !reduced
            ? <DecryptedText text={HERO.eyebrow} animateOn="view" sequential speed={22} revealDirection="start" encryptedClassName="dec-enc" />
            : <span className="dec-wait">{HERO.eyebrow}</span>}
        </p>
        <Words as="h1" text={HERO.title} className="hero__title" delay={0.15} />
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
