import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Frame, Photo } from '../ui/Photo.jsx';
import { Reveal } from '../ui/Primitives.jsx';
import { useMotionOff } from '../../lib/hooks.js';

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------------------------------------------------------
   Band. A wide photograph that opens out to the page edges as it scrolls into view, with a label
   and a caption underneath.
   --------------------------------------------------------------------------------------------- */
export function Band({ name, label, caption, ratio = '21 / 9', position, className = '' }) {
  const wrap = useRef(null);
  const off = useMotionOff();
  useEffect(() => {
    const el = wrap.current;
    if (off || !el) return undefined;
    const tween = gsap.fromTo(el, { clipPath: 'inset(0% 7% 0% 7%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 25%', scrub: true },
    });
    return () => { if (tween.scrollTrigger) tween.scrollTrigger.kill(); tween.kill(); };
  }, [off]);
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
