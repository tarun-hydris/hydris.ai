import { useMemo } from 'react';
import { SCENES } from '../viz/ig/scenes.jsx';
import { useInView } from '../../lib/hooks.js';

/* One Hydris infographic: a vector drawing on the white page (components/viz/ig) with its labels set
   as real text at exact points of the drawing. Labels stay a readable size on any screen; when the
   drawing is too narrow for them, they become numbered markers with a key underneath. */
export default function Infographic({ name, className = '', caption, bare = false }) {
  const S = SCENES[name];
  const scene = useMemo(() => S.make(), [S]);
  const [ref, inView] = useInView({ threshold: 0.25, once: true });
  const [W, H] = scene.vb;
  const labels = scene.labels;
  return (
    <figure ref={ref} className={`ig ig--${name} ${bare ? 'ig--bare' : ''} ${inView ? 'is-in' : ''} ${className}`}>
      <div className="ig__frame" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg className="ig__svg" viewBox={`0 0 ${W} ${H}`} role={S.alt ? 'img' : undefined} aria-label={S.alt || undefined} aria-hidden={S.alt ? undefined : 'true'} focusable="false">
          {scene.svg}
        </svg>
        {labels.length > 0 && (
          <ol className="ig__labels" aria-hidden="true">
            {labels.map((l, i) => (
              <li
                key={l.t + i}
                className={`ig__l ig__l--${l.k || 'tag'} ${l.align === 'left' ? 'is-left' : ''} ${l.on ? 'is-on' : ''}`}
                style={{ left: `${((l.x / W) * 100).toFixed(2)}%`, top: `${((l.y / H) * 100).toFixed(2)}%`, '--i': i, maxWidth: l.w ? `${((l.w / W) * 100).toFixed(2)}%` : undefined }}
              >
                <span className="ig__n">{i + 1}</span>
                <span className="ig__t">{l.t}{l.s && <small>{l.s}</small>}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
      {labels.length > 0 && (
        <figcaption className="ig__cap">
          <ol className="ig__key">{labels.map((l, i) => <li key={l.t + i}><span>{i + 1}</span>{l.t}{l.s ? `: ${l.s}` : ''}</li>)}</ol>
          {caption && <p className="ig__note">{caption}</p>}
        </figcaption>
      )}
    </figure>
  );
}
