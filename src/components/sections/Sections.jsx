import { useInView } from '../../lib/hooks.js';

/* The intelligence stack. Layers rise from the systems at the base; a pulse climbs through them. */
export function LayerStack({ items }) {
  const [ref, inView] = useInView({ threshold: 0.25, once: true });
  const n = items.length;
  return (
    <div ref={ref} className={`lstack ${inView ? 'is-in' : ''}`}>
      {items.map((l, i) => (
        <div className={`lbar lbar--${l.kind}`} style={{ '--k': n - 1 - i }} key={l.name}>
          <span className="lbar__n">{String(n - i).padStart(2, '0')}</span>
          <span className="lbar__name">{l.name}</span>
          <span className="lbar__role">{l.role}</span>
        </div>
      ))}
    </div>
  );
}
