import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PHOTOS } from '../../lib/photos.js';
import { reduced, useInView, useReady } from '../../lib/hooks.js';

gsap.registerPlugin(ScrollTrigger);

export const photoSrc = (name, w) => `/photos/${name}-${w}.webp`;
export const srcSet = (name) => PHOTOS[name].w.map((w) => `${photoSrc(name, w)} ${w}w`).join(', ');

/* Responsive photograph. Lazy by default; fades in over the blurred placeholder its frame paints. */
export function Photo({ name, sizes = '100vw', priority = false, alt, className = '', position, style }) {
  const p = PHOTOS[name];
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth) setLoaded(true);
  }, []);
  const text = alt ?? p.alt;
  return (
    <img
      ref={ref}
      className={`photo ${loaded ? 'is-loaded' : ''} ${className}`}
      src={photoSrc(name, p.w[Math.min(1, p.w.length - 1)])}
      srcSet={srcSet(name)}
      sizes={sizes}
      width={p.W}
      height={p.H}
      alt={text}
      aria-hidden={text ? undefined : 'true'}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      draggable="false"
      onLoad={() => setLoaded(true)}
      style={{ objectPosition: position, ...style }}
    />
  );
}

/* A photograph in a frame. The frame wipes open from the bottom as it enters, the picture settles
   from a slight zoom, then drifts gently against the scroll. `inner` sits on top of the picture and
   moves with it (for overlays that must stay registered to the photo). */
export function Frame({
  name, ratio, sizes = '100vw', position, priority, alt, className = '', drift = 0.1, reveal = true, delay = 0,
  inner = null, children = null,
}) {
  const p = PHOTOS[name];
  const ready = useReady();
  const [ref, inView] = useInView({ rootMargin: '0px 0px -8% 0px', once: true });
  const move = useRef(null);
  const d = reduced ? 0 : Math.min(drift, 0.2);

  useEffect(() => {
    const el = move.current;
    if (!d || !el) return undefined;
    const tween = gsap.fromTo(el, { yPercent: -d * 50 }, {
      yPercent: d * 50, ease: 'none',
      scrollTrigger: { trigger: el.parentNode, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    return () => { if (tween.scrollTrigger) tween.scrollTrigger.kill(); tween.kill(); };
  }, [d]);

  return (
    <figure
      ref={ref}
      className={`frame ${reveal ? 'frame--reveal' : ''} ${inView && ready ? 'is-in' : ''} ${className}`}
      style={{ '--ratio': ratio || `${p.W} / ${p.H}`, '--lq': `url("${p.lqip}")`, '--bg': p.bg, '--drift': d, '--d': `${delay}s` }}
    >
      <div className="frame__clip">
        <div className="frame__move" ref={move}>
          <div className="frame__zoom">
            <Photo name={name} sizes={sizes} position={position} priority={priority} alt={alt} className="frame__img" />
            {inner}
          </div>
        </div>
      </div>
      {children}
    </figure>
  );
}
