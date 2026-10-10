import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduced } from '../../lib/hooks.js';

gsap.registerPlugin(ScrollTrigger);

/* Photographs lean a little with the speed of the scroll and settle when it stops */
export function ScrollLean() {
  useEffect(() => {
    if (reduced) return undefined;
    let skew = 0;
    const set = () => gsap.utils.toArray('.frame__clip, .band__wrap').filter((el) => !el.closest('.stages')).forEach((el) => { el.style.transform = `skewY(${skew.toFixed(3)}deg)`; });
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

/* Section headings arrive like a slow camera move: a little depth and travel, tied to the scroll */
export function Glide() {
  useEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.sechead, .phero__inner, .band__cap').forEach((el) => {
        gsap.fromTo(el, { y: 70, opacity: 0.25, scale: 0.985 }, {
          y: 0, opacity: 1, scale: 1, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 55%', scrub: 1.2 },
        });
      });
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { clearTimeout(t); ctx.revert(); };
  }, []);
  return null;
}

/* A fine moving film grain across the whole site */
export function Grain() {
  if (reduced) return null;
  return <div className="grain" aria-hidden="true" />;
}

/* Cards lean towards the pointer with a soft light moving across them; buttons are drawn to it */
export function Alive() {
  useEffect(() => {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const cards = '.card-spotlight, .defn, .kb, .ro__card, .form, .lbar';
    const onMove = (e) => {
      const c = e.target.closest && e.target.closest(cards);
      if (c) {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5;
        const big = r.width > 700 ? 0.35 : 1;
        c.style.transform = `perspective(1100px) rotateX(${(-y * 5 * big).toFixed(2)}deg) rotateY(${(x * 6 * big).toFixed(2)}deg)`;
        c.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
        c.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
        c.classList.add('is-lit');
      }
      const b = e.target.closest && e.target.closest('.pill, .round');
      if (b) {
        const r = b.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2); const dy = e.clientY - (r.top + r.height / 2);
        b.style.transform = `translate(${(dx * 0.18).toFixed(1)}px, ${(dy * 0.28).toFixed(1)}px)`;
      }
    };
    const onOut = (e) => {
      const c = e.target.closest && e.target.closest(cards);
      if (c && !c.contains(e.relatedTarget)) { c.style.transform = ''; c.classList.remove('is-lit'); }
      const b = e.target.closest && e.target.closest('.pill, .round');
      if (b && !b.contains(e.relatedTarget)) b.style.transform = '';
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerout', onOut);
    return () => { document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerout', onOut); };
  }, []);
  return null;
}
