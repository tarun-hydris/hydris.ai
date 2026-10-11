import { Mark } from '../ui/Brand.jsx';
import { reduced, useInView, useMotionOff } from '../../lib/hooks.js';
import '../../styles/viz/loop.css';

/* Knowledge base: five layers fill in, ready on day one.
   Runs once on entry. Each bar first loads at its own pace to a different point, then all of them
   complete together, and only then does the footer settle in: the base is whole before it is used. */

const PARTIAL = [0.82, 0.62, 0.74, 0.56, 0.68]; // the first pass only; every bar ends full
const START = 0.25; // s, first bar
const STAGGER = 0.14; // s, between bars

export function KnowledgeBase({ layers }) {
  useMotionOff(); // re-render when Pause motion or the system setting changes
  const [ref, inView] = useInView({ threshold: 0.3, once: true });
  const on = inView || reduced;
  const end = Math.max(2.1, START + (layers.length - 1) * STAGGER + 1.2); // every bar reaches full here
  return (
    <div ref={ref} className={`vz-kb ${on ? 'is-in' : ''}`} style={{ '--kb-end': `${end.toFixed(2)}s` }}>
      <p className="vz-kb__head">
        <span className="vz-kb__brand"><Mark className="vz-kb__mark" />Hydris knowledge base</span>
        <span className="vz-kb__by">Built by our water engineers</span>
      </p>
      <ol className="vz-kb__rows">
        {layers.map((l, i) => {
          const d = START + i * STAGGER;
          return (
            <li className="vz-kb__row" key={l} style={{ '--d': `${d.toFixed(2)}s`, '--dur': `${(end - d).toFixed(2)}s`, '--to': PARTIAL[i % PARTIAL.length] }}>
              <span className="vz-kb__n">{String(i + 1).padStart(2, '0')}</span>
              <b className="vz-kb__name">{l}</b>
              <span className="vz-kb__bar" aria-hidden="true"><u className="vz-kb__fill" /><i className="vz-kb__end" /></span>
            </li>
          );
        })}
      </ol>
      <p className="vz-kb__foot">
        <span className="vz-kb__dot" aria-hidden="true" />
        <span>Useful on day one</span>
        <span className="vz-kb__count">{layers.length} layers</span>
      </p>
    </div>
  );
}
