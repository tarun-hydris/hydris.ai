import { ICON_PATHS } from '../../ui/Icon.jsx';

/* ------------------------------------------------------------------------------------------------
   Drawing kit for the Hydris infographics. Everything is vector, on the white page, in the
   water colour system (infographic tokens P1 to T6, translated for a light ground):
     focal / active   Clearwater #76AFBA, Steel cyan #5191A5, Glacial slate #3F697B
     outlines         Ice mint #AFCAC9, Pale reflection #C9D9D7, Waterlight #89B4B4
     glass faces      white to #EAF2F2, sides #D7E5E4 / #C6D8D7
     structure        Mist silver #ADB9BD, Muted sea glass #6D8889 (dashes, grids)
     type             Deep water #1D2B35, Lagoon #608C92
   Isometric projection: x runs down-right, y runs down-left, z is up.
   ------------------------------------------------------------------------------------------------ */
export const C = {
  clear: '#76AFBA', steel: '#5191A5', glacial: '#3F697B', ice: '#AFCAC9', pale: '#C9D9D7',
  waterlight: '#89B4B4', mist: '#ADB9BD', seaglass: '#6D8889', deep: '#1D2B35', lagoon: '#608C92',
  face: '#F6FAFA', side1: '#DCE8E7', side2: '#CADBDA', line: '#9DBDBD',
};

const K = 0.8660254;
export const iso = (ox, oy) => (x, y, z = 0) => [ox + (x - y) * K, oy + (x + y) * 0.5 - z];
export const pts = (arr) => arr.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');

/* Shared gradients and filters, one set per drawing (ids are prefixed so several drawings can share
   a page). */
export function Defs({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E8F1F1" />
      </linearGradient>
      <linearGradient id={`${id}-topOn`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#CFE6E9" />
      </linearGradient>
      <linearGradient id={`${id}-sideL`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E3EEEE" /><stop offset="1" stopColor="#D2E2E1" />
      </linearGradient>
      <linearGradient id={`${id}-sideR`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#D4E4E3" /><stop offset="1" stopColor="#BFD3D2" />
      </linearGradient>
      <radialGradient id={`${id}-node`} cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#FFFFFF" /><stop offset="0.55" stopColor="#CFE5E8" /><stop offset="1" stopColor={C.clear} />
      </radialGradient>
      <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={C.clear} stopOpacity="0.38" /><stop offset="1" stopColor={C.clear} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-mist`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#E3EFEF" stopOpacity="0.9" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="180%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
      <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
    </defs>
  );
}

/* A soft pool of light behind the drawing, so it sits on the white page instead of floating */
export const Mist = ({ id, cx, cy, rx, ry }) => <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id}-mist)`} />;

/* A glass slab: x, y footprint, w by d, at height z, thickness h. `on` makes it the focal object. */
export function Slab({ P, id, x, y, w, d, z = 0, h = 10, on = false, shadow = true, opacity = 1, alpha = 1 }) {
  const t = (a, b) => P(a, b, z + h);
  const b = (a, c) => P(a, c, z);
  const A = t(x, y); const B = t(x + w, y); const Cc = t(x + w, y + d); const D = t(x, y + d);
  const Bb = b(x + w, y); const Cb = b(x + w, y + d); const Db = b(x, y + d);
  const g = P(x, y, 0); const g2 = P(x + w, y + d, 0); const g3 = P(x + w, y, 0); const g4 = P(x, y + d, 0);
  return (
    <g opacity={opacity}>
      {shadow && (
        <polygon points={pts([[g[0], g[1] + 6], [g3[0] + 8, g3[1] + 6], [g2[0], g2[1] + 14], [g4[0] - 8, g4[1] + 6]])}
          fill={C.deep} opacity={z > 0 ? 0.06 : 0.1} filter={`url(#${id}-shadow)`} />
      )}
      {on && <ellipse cx={(A[0] + Cc[0]) / 2} cy={(A[1] + Cc[1]) / 2} rx={w * 1.05} ry={d * 0.6} fill={`url(#${id}-glow)`} />}
      <polygon points={pts([D, Cc, Cb, Db])} fillOpacity={alpha < 1 ? 0.85 : 1} fill={`url(#${id}-sideL)`} stroke={C.pale} strokeWidth="1" strokeLinejoin="round" />
      <polygon points={pts([Cc, B, Bb, Cb])} fill={`url(#${id}-sideR)`} stroke={C.pale} strokeWidth="1" strokeLinejoin="round" />
      <polygon points={pts([A, B, Cc, D])} fill={`url(#${id}-${on ? 'topOn' : 'top'})`} fillOpacity={alpha} stroke={on ? C.clear : C.ice} strokeWidth={on ? 1.6 : 1.2} strokeLinejoin="round" />
      <polyline points={pts([D, Cc, B])} fill="none" stroke="#FFFFFF" strokeWidth="1.4" opacity="0.9" />
    </g>
  );
}

/* A glass cube (or tall block) with optional inner layers */
export function Block({ P, id, x, y, w, d, z = 0, h, on = false, layers = 0 }) {
  return (
    <g>
      <Slab P={P} id={id} x={x} y={y} w={w} d={d} z={z} h={h} on={on} />
      {Array.from({ length: layers }, (_, i) => {
        const zz = z + (h * (i + 1)) / (layers + 1);
        const a = P(x + 2, y + 2, zz); const b = P(x + w - 2, y + 2, zz); const c = P(x + w - 2, y + d - 2, zz); const dd = P(x + 2, y + d - 2, zz);
        return <polygon key={i} points={pts([a, b, c, dd])} fill="#FFFFFF" fillOpacity={0.25 + (i / layers) * 0.35} stroke={i > layers - 3 ? C.clear : C.pale} strokeWidth="0.8" />;
      })}
    </g>
  );
}

/* A line icon from the site set, standing upright on a point (like the glass objects in the set) */
export function Glyph({ name, x, y, size = 34, color = C.glacial, width = 1.5, float = 0 }) {
  return (
    <g transform={`translate(${(x - size / 2).toFixed(1)} ${(y - size - float).toFixed(1)}) scale(${(size / 24).toFixed(3)})`}
      fill="none" stroke={color} strokeWidth={(width * 24) / size} strokeLinecap="round" strokeLinejoin="round">
      {ICON_PATHS[name]}
    </g>
  );
}

/* A glowing node: the active point on a path */
export function Node({ id, x, y, r = 7, on = false }) {
  return (
    <g>
      {on && <circle cx={x} cy={y} r={r * 3.2} fill={`url(#${id}-glow)`} />}
      <circle cx={x} cy={y} r={r} fill={`url(#${id}-node)`} stroke={on ? C.steel : C.ice} strokeWidth="1.2" />
      {on && <circle className="igv-pulse" cx={x} cy={y} r={r + 6} fill="none" stroke={C.clear} strokeWidth="1" />}
    </g>
  );
}

/* A dashed connector; `flow` animates the dashes along the path */
export const Dash = ({ d, flow = false, color = C.line, width = 1.3, dash = '4 6', opacity = 1 }) => (
  <path d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" opacity={opacity} className={flow ? 'igv-flow' : undefined} />
);

/* A solid signal line with a soft glow underneath */
export const Signal = ({ d, width = 2 }) => (
  <g>
    <path d={d} fill="none" stroke={C.clear} strokeWidth={width * 4} strokeLinecap="round" opacity="0.14" />
    <path d={d} fill="none" stroke={C.steel} strokeWidth={width} strokeLinecap="round" />
  </g>
);

/* An isometric circle (ellipse) on a horizontal plane */
export const IsoRing = ({ cx, cy, r, ...rest }) => <ellipse cx={cx} cy={cy} rx={r * 1.2247} ry={r * 0.7071} {...rest} />;

/* A deterministic pseudo-random sequence, so drawings never change between renders */
export function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
