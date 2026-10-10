import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduced } from '../../lib/hooks.js';

gsap.registerPlugin(ScrollTrigger);

/* A ring that follows the pointer, swells over anything clickable and dips when pressed.
   Fine pointers only; touch and reduced motion keep the normal cursor. */
export function CursorRing() {
  const ring = useRef(null);
  const dot = useRef(null);
  useEffect(() => {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const r = ring.current; const d = dot.current;
    document.documentElement.classList.add('has-ring');
    const rx = gsap.quickTo(r, 'x', { duration: 0.55, ease: 'power3.out' });
    const ry = gsap.quickTo(r, 'y', { duration: 0.55, ease: 'power3.out' });
    const dx = gsap.quickTo(d, 'x', { duration: 0.12, ease: 'power3.out' });
    const dy = gsap.quickTo(d, 'y', { duration: 0.12, ease: 'power3.out' });
    const move = (e) => {
      rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY);
      const hot = e.target.closest && e.target.closest('a, button, [role="button"], input, textarea, select, label, .shift, .acc__btn');
      r.classList.toggle('is-hot', !!hot);
      r.classList.add('is-on'); d.classList.add('is-on');
    };
    const down = () => r.classList.add('is-down');
    const up = () => r.classList.remove('is-down');
    const out = () => { r.classList.remove('is-on'); d.classList.remove('is-on'); };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.addEventListener('pointerleave', out);
    return () => {
      document.documentElement.classList.remove('has-ring');
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up); document.removeEventListener('pointerleave', out);
    };
  }, []);
  return (
    <>
      <span className="cring" ref={ring} aria-hidden="true" />
      <span className="cdot" ref={dot} aria-hidden="true" />
    </>
  );
}

/* Photographs lean a little with the speed of the scroll and settle when it stops */
export function ScrollLean() {
  useEffect(() => {
    if (reduced) return undefined;
    let skew = 0;
    const set = () => gsap.utils.toArray('.frame__clip, .band__wrap').forEach((el) => { el.style.transform = `skewY(${skew.toFixed(3)}deg)`; });
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const target = gsap.utils.clamp(-2.2, 2.2, self.getVelocity() / -900);
        if (Math.abs(target) > Math.abs(skew)) {
          skew = target;
          gsap.to({ v: skew }, { v: 0, duration: 0.9, ease: 'power3.out', overwrite: true, onUpdate() { skew = this.targets()[0].v; set(); } });
        }
      },
    });
    return () => { st.kill(); skew = 0; set(); };
  }, []);
  return null;
}
