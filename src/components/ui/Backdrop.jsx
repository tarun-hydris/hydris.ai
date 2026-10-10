import { useEffect, useRef } from 'react';
import FlutedGlass from './FlutedGlass.jsx';
import { Visible } from './Primitives.jsx';
import { hasWebGL2, reduced } from '../../lib/hooks.js';

/* One fluted-glass surface behind the whole site, the liquid in the blues of the water inside the
   mark. A white veil sits over it: clear in the opening hero, then it eases in so the glass becomes
   a quiet texture behind reading. Sections are see-through, so the page never changes ground
   abruptly; dark sections fade in and out of it (see flow rules in hybrid.css). */
const GLASS = {
  backgroundColor: '#FFFFFF', angle: 28, flutes: 9, refraction: 4, aberration: 0.61, softness: 0.5, wave: 0.06, waveFrequency: 1.5,
  highlight: 0.1, highlightSoftness: 0.32, lightAngle: -90, radius: 7, momentum: 13, swirl: 0.15, intensity: 1, trail: 1,
  texture: 0.55, grain: 0.035, speed: 0.8,
};

export default function Backdrop() {
  const veil = useRef(null);
  useEffect(() => {
    const el = veil.current;
    if (!el) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const splash = document.querySelector('.splash');
      const start = splash ? splash.offsetHeight - vh * 1.2 : vh * 0.15;
      const k = Math.min(1, Math.max(0, (window.scrollY - start) / (vh * 0.9)));
      el.style.opacity = (0.8 * k * k * (3 - 2 * k)).toFixed(3);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="backdrop" aria-hidden="true">
      {hasWebGL2 && !reduced ? <Visible rootMargin="0px"><FlutedGlass {...GLASS} /></Visible> : <span className="backdrop__still" />}
      <span className="backdrop__veil" ref={veil} />
    </div>
  );
}
