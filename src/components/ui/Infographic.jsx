import { IG } from '../../lib/infographics.js';

/* One illustration from the Hydris infographic set, with its labels set as real text over the blank
   plates (so they stay sharp, translatable and readable by screen readers). On narrow frames the
   overlay would be too small to read, so the labels move into a numbered key under the picture. */
export default function Infographic({ name, className = '', sizes = '(min-width: 901px) 60vw, 100vw', caption, priority = false, bare = false }) {
  const g = IG[name];
  const [W, H] = g.size;
  const labels = g.labels;
  return (
    <figure className={`ig ${bare ? 'ig--bare' : ''} ${className}`}>
      <div className="ig__frame">
        <img
          className="ig__img"
          src={`/ig/${name}-1600.webp`}
          srcSet={`/ig/${name}-900.webp 900w, /ig/${name}-1600.webp 1600w`}
          sizes={sizes}
          width={W}
          height={H}
          alt={g.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          draggable="false"
        />
        {labels.length > 0 && (
          <ol className="ig__labels" aria-hidden="true">
            {labels.map((l, i) => (
              <li
                key={l.t}
                className={`ig__l ${l.w ? 'ig__l--plate' : 'ig__l--tag'} ${l.strong ? 'is-strong' : ''} ${l.q ? 'is-q' : ''}`}
                style={{ left: `${l.x}%`, top: `${l.y}%`, '--w': l.w ? `${l.w}%` : undefined, '--i': i }}
              >
                <span className="ig__n">{i + 1}</span>{l.t}
              </li>
            ))}
          </ol>
        )}
      </div>
      {(labels.length > 0 || caption) && (
        <figcaption className="ig__cap">
          {labels.length > 0 && (
            <ol className="ig__key">{labels.map((l, i) => <li key={l.t}><span>{i + 1}</span>{l.t}</li>)}</ol>
          )}
          {caption && <p className="ig__note">{caption}</p>}
        </figcaption>
      )}
    </figure>
  );
}
