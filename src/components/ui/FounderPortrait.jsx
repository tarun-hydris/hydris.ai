import { FOUNDER } from '../../lib/founder.js';

/* The founder portrait: one still photograph, the last of the session (glasses on, arms crossed). */

const FRAMES = FOUNDER.frames;
const f = FRAMES[FRAMES.length - 1];
const srcSet = f.widths.map((w) => `/founder/f${f.i}-${w}.webp ${w}w`).join(', ');
const SIZES = '(min-width: 901px) 42vw, 92vw';

export default function FounderPortrait({ alt, className = '' }) {
  const style = { '--fp-bg': FOUNDER.bg, '--fp-lq': `url("${FOUNDER.lqip}")` };
  return (
    <div className={`fp ${className}`} style={style}>
      <div className="fp__frame" role="img" aria-label={alt}>
        <img className="fp__img" style={{ opacity: 1 }} srcSet={srcSet} sizes={SIZES} src={`/founder/f${f.i}-1200.webp`} alt="" loading="lazy" decoding="async" width="1200" height="1500" aria-hidden="true" />
      </div>
    </div>
  );
}
