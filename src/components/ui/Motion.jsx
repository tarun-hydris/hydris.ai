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
