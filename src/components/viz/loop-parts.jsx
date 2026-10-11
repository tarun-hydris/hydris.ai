import { useId, useLayoutEffect, useRef, useState } from 'react';

/* Small shared parts for the loop widgets (Learn, DataIntake). Styles live in styles/viz/loop.css. */

/* Odometer: the digits sit in one column and the column slides, so a changing figure rolls into place */
export function Roll({ value, from = 0, to = 9, className = '' }) {
  const digits = [];
  for (let d = from; d <= to; d++) digits.push(d);
  const i = Math.max(0, Math.min(digits.length - 1, value - from));
  return (
    <span className={`vz-lp-roll ${className}`}>
      <span className="vz-lp-roll__col" style={{ transform: `translateY(${(-100 * i) / digits.length}%)` }}>
        {digits.map((d) => <span key={d}>{d}</span>)}
      </span>
    </span>
  );
}

/* Layout width of an element, kept current with a ResizeObserver, so a chart can draw 1:1 in pixels */
export function useWidth(initial = 320) {
  const ref = useRef(null);
  const [w, setW] = useState(initial);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const set = (v) => { const r = Math.round(v); if (r > 0) setW(r); };
    set(el.clientWidth);
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([e]) => set(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

/* A per-instance id that is safe inside url(#...) */
export function useSvgId(prefix) {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, '');
}
