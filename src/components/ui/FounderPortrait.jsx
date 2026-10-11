import { useEffect, useRef, useState } from 'react';
import { FOUNDER } from '../../lib/founder.js';
import { useMedia, useMotionOff } from '../../lib/hooks.js';

/* The founder portrait. Nine photographs from one session, registered so the head holds still: without
   glasses, the hand to the pocket, the glasses taken out, lifted, put on, arms crossed.

   On a pointer device the sequence follows how close the cursor is: far away it rests on the first
   photograph; as the cursor nears the picture it plays forward, like a short film, and settles on the
   last; moving away plays it back. On touch it plays once when the portrait is in view and a tap plays
   it back and forth. With motion paused it shows the final photograph, still. */

const FRAMES = FOUNDER.frames;
const N = FRAMES.length;
const LAST = N - 1;
const SPEED = 8.5;            // frames per second at full tilt
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);
const srcSet = (f) => f.widths.map((w) => `/founder/f${f.i}-${w}.webp ${w}w`).join(', ');
const SIZES = '(min-width: 901px) 42vw, 92vw';

export default function FounderPortrait({ alt, className = '' }) {
  const off = useMotionOff();
  const hover = useMedia('(hover: hover) and (pointer: fine)');
  const root = useRef(null);
  const stack = useRef(null);
  const rail = useRef(null);
  const imgs = useRef([]);
  const loaded = useRef(0);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);

  // Start fetching the frames shortly before the portrait scrolls into view
  useEffect(() => {
    if (off || !root.current || typeof IntersectionObserver === 'undefined') { setNear(true); return undefined; }
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: '900px 0px' });
    io.observe(root.current);
    return () => io.disconnect();
  }, [off]);

  const onLoad = () => { loaded.current += 1; if (loaded.current >= N) setReady(true); };

  useEffect(() => {
    if (off || !ready || !root.current) return undefined;
    const el = root.current;
    let pos = 0;
    let target = 0;
    let raf = 0;
    let last = 0;
    let px = -9999;
    let py = -9999;

    const paint = () => {
      const lo = Math.min(LAST, Math.floor(pos));
      const frac = pos - lo;
      const a = lo >= LAST ? 0 : smooth(clamp((frac - 0.25) / 0.5));
      for (let i = 0; i < N; i += 1) {
        const im = imgs.current[i];
        if (im) im.style.opacity = i === lo ? '1' : i === lo + 1 ? a.toFixed(3) : '0';
      }
      const p = pos / LAST;
      if (stack.current) stack.current.style.transform = `scale(${(1 + 0.035 * smooth(p)).toFixed(4)})`;
      if (rail.current) rail.current.style.transform = `scaleX(${p.toFixed(4)})`;
    };

    const step = (now) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      const diff = target - pos;
      if (Math.abs(diff) < 0.004) { pos = target; paint(); return; }
      pos += clamp(diff * 5, -SPEED, SPEED) * dt;
      paint();
      raf = requestAnimationFrame(step);
    };
    const wake = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); } };

    // Pointer devices: how near the cursor is to the picture sets how far the film has played
    const aim = () => {
      const r = el.getBoundingClientRect();
      const dx = Math.max(r.left - px, 0, px - r.right);
      const dy = Math.max(r.top - py, 0, py - r.bottom);
      const range = Math.max(260, r.height * 0.6);
      target = smooth(1 - clamp(Math.hypot(dx, dy) / range)) * LAST;
      wake();
    };
    const onMove = (e) => { px = e.clientX; py = e.clientY; aim(); };
    const onLeave = () => { px = -9999; py = -9999; target = 0; wake(); };

    // Touch: play once when the portrait is in view, tap to play it back and forth
    let io = null;
    let timer = 0;
    let onTap = null;
    if (hover) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('mouseleave', onLeave);
      window.addEventListener('scroll', aim, { passive: true });
    } else {
      io = new IntersectionObserver((entries) => {
        const e = entries[0];
        window.clearTimeout(timer);
        if (e.intersectionRatio >= 0.6) timer = window.setTimeout(() => { target = LAST; wake(); }, 350);
        else if (e.intersectionRatio < 0.15) { target = 0; wake(); }
      }, { threshold: [0, 0.15, 0.6] });
      io.observe(el);
      onTap = () => { target = target > LAST / 2 ? 0 : LAST; wake(); };
      el.addEventListener('click', onTap);
    }
    paint();
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', aim);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      if (io) io.disconnect();
      if (onTap) el.removeEventListener('click', onTap);
    };
  }, [off, ready, hover]);

  const style = { '--fp-bg': FOUNDER.bg, '--fp-lq': `url("${FOUNDER.lqip}")` };

  // Paused or reduced motion: the final photograph, still
  if (off) {
    const f = FRAMES[LAST];
    return (
      <div ref={root} className={`fp ${className}`} style={style}>
        <div className="fp__frame" role="img" aria-label={alt}>
          <img className="fp__img" style={{ opacity: 1 }} srcSet={srcSet(f)} sizes={SIZES} src={`/founder/f${f.i}-1200.webp`} alt="" loading="lazy" decoding="async" width="1200" height="1500" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <div ref={root} className={`fp ${hover ? '' : 'fp--tap'} ${className}`} style={style}>
      <div className="fp__frame" role="img" aria-label={alt}>
        <div className="fp__stack" ref={stack} aria-hidden="true">
          {FRAMES.map((f, i) => (i === 0 || near) && (
            <img
              key={f.i}
              ref={(n) => { imgs.current[i] = n; }}
              className="fp__img"
              style={i === 0 ? { opacity: 1 } : undefined}
              srcSet={srcSet(f)}
              sizes={SIZES}
              src={`/founder/f${f.i}-1200.webp`}
              alt=""
              loading={i === 0 ? 'lazy' : 'eager'}
              decoding="async"
              width="1200"
              height="1500"
              onLoad={onLoad}
              onError={onLoad}
            />
          ))}
        </div>
        <div className="fp__railwrap" aria-hidden="true"><i ref={rail} /></div>
      </div>
    </div>
  );
}
