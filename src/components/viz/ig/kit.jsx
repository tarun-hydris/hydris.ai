import { ICON_PATHS } from '../../ui/Icon.jsx';

/* ------------------------------------------------------------------------------------------------
   Drawing kit for the Hydris infographics, on the white page.

   Design rule (60 / 30 / 10): most objects are light frosted glass, structure (dashes, grids,
   tracks) is a quiet mid grey, and dark ink is kept for the one focal object in each drawing, so the
   eye always knows where to land. Every dark tone is sampled from the opening water film:
   ink #07161B, #141D1B, #20333B, #2C4249, slate #315260, #47656B, with its silver #88A1A3, #D1D9D6.

   Motion is minimal and tied to meaning: objects rise in once, the focal object floats a few pixels,
   one dot travels each path, dashes flow. html.motion-off stops all of it.
   Isometric projection: x runs down-right, y runs down-left, z is up.
   ------------------------------------------------------------------------------------------------ */
export const C = {
  ink: '#07161B', ink2: '#20333B', slate: '#2C4249', steel: '#47656B', silver: '#88A1A3',
  pale: '#D1D9D6', edge: '#A7B5B6', line: '#9AAAAC', mist: '#C2CCCD', icon: '#20333B',
};

const K = 0.8660254;
export const iso = (ox, oy) => (x, y, z = 0) => [ox + (x - y) * K, oy + (x + y) * 0.5 - z];
export const pts = (arr) => arr.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');

/* Shared gradients and filters, one set per drawing (ids are prefixed) */
export function Defs({ id }) {
  return (
    <defs>
      {/* light frosted glass */}
      <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E7EDED" />
      </linearGradient>
      <linearGradient id={`${id}-sideL`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E1E8E8" /><stop offset="1" stopColor="#CDD7D7" />
      </linearGradient>
      <linearGradient id={`${id}-sideR`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#C9D3D3" /><stop offset="1" stopColor="#B4C1C2" />
      </linearGradient>
      {/* the focal object: ink glass */}
      <linearGradient id={`${id}-topOn`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#315260" /><stop offset="0.55" stopColor="#20333B" /><stop offset="1" stopColor="#07161B" />
      </linearGradient>
      <linearGradient id={`${id}-sideLOn`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1A2627" /><stop offset="1" stopColor="#0E1412" />
      </linearGradient>
      <linearGradient id={`${id}-sideROn`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0E1412" /><stop offset="1" stopColor="#07161B" />
      </linearGradient>
      <radialGradient id={`${id}-node`} cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#C6D0D1" />
      </radialGradient>
      <radialGradient id={`${id}-nodeOn`} cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#88A1A3" /><stop offset="0.5" stopColor="#2C4249" /><stop offset="1" stopColor="#07161B" />
      </radialGradient>
      <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#47656B" stopOpacity="0.22" /><stop offset="1" stopColor="#47656B" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-mist`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#EDF2F2" stopOpacity="1" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-token`} cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E3EAEA" />
      </radialGradient>
      <radialGradient id={`${id}-tokenOn`} cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#47656B" /><stop offset="0.6" stopColor="#20333B" /><stop offset="1" stopColor="#07161B" />
      </radialGradient>
      <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="180%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
    </defs>
  );
}

/* A soft pool of light behind the drawing */
export const Mist = ({ id, cx, cy, rx, ry }) => <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id}-mist)`} />;

/* A glass slab: footprint x, y, w by d, at height z, thickness h. `on` makes it the focal ink object. */
export function Slab({ P, id, x, y, w, d, z = 0, h = 10, on = false, shadow = true, alpha = 1 }) {
  const t = (a, b) => P(a, b, z + h);
  const bt = (a, c) => P(a, c, z);
  const A = t(x, y); const B = t(x + w, y); const Cc = t(x + w, y + d); const D = t(x, y + d);
  const Bb = bt(x + w, y); const Cb = bt(x + w, y + d); const Db = bt(x, y + d);
  const g = P(x, y, 0); const g2 = P(x + w, y + d, 0); const g3 = P(x + w, y, 0); const g4 = P(x, y + d, 0);
  const sfx = on ? 'On' : '';
  return (
    <g>
      {shadow && (
        <polygon points={pts([[g[0], g[1] + 6], [g3[0] + 8, g3[1] + 6], [g2[0], g2[1] + 14], [g4[0] - 8, g4[1] + 6]])}
          fill={C.ink} opacity={on ? 0.22 : 0.1} filter={`url(#${id}-shadow)`} />
      )}
      <polygon points={pts([D, Cc, Cb, Db])} fill={`url(#${id}-sideL${sfx})`} fillOpacity={alpha} stroke={on ? C.ink : C.edge} strokeWidth="1" strokeLinejoin="round" />
      <polygon points={pts([Cc, B, Bb, Cb])} fill={`url(#${id}-sideR${sfx})`} fillOpacity={alpha} stroke={on ? C.ink : C.edge} strokeWidth="1" strokeLinejoin="round" />
      <polygon points={pts([A, B, Cc, D])} fill={`url(#${id}-top${sfx})`} fillOpacity={alpha} stroke={on ? C.ink : C.edge} strokeWidth="1.1" strokeLinejoin="round" />
      <polyline points={pts([D, Cc, B])} fill="none" stroke={on ? C.silver : '#FFFFFF'} strokeWidth="1.2" opacity={on ? 0.7 : 0.95} />
    </g>
  );
}

/* A glass cube with inner layers */
export function Block({ P, id, x, y, w, d, z = 0, h, on = false, layers = 0 }) {
  return (
    <g>
      <Slab P={P} id={id} x={x} y={y} w={w} d={d} z={z} h={h} on={on} />
      {Array.from({ length: layers }, (_, i) => {
        const zz = z + (h * (i + 1)) / (layers + 1);
        const a = P(x + 2, y + 2, zz); const b = P(x + w - 2, y + 2, zz); const c = P(x + w - 2, y + d - 2, zz); const dd = P(x + 2, y + d - 2, zz);
        return <polygon key={i} points={pts([a, b, c, dd])} fill={on ? '#88A1A3' : '#FFFFFF'} fillOpacity={0.05 + (i / layers) * 0.16} stroke={on ? (i > layers - 3 ? C.pale : C.steel) : C.edge} strokeWidth="0.8" />;
      })}
    </g>
  );
}

/* A line icon on a small glass token. Light token with an ink icon; `on` gives an ink token with a
   silver icon. `token={false}` draws the icon alone. */
export function Glyph({ id, name, x, y, size = 30, on = false, token = true, width = 1.5 }) {
  const cx = x; const cy = y - size / 2;
  const r = size * 0.82;
  const color = on ? C.pale : C.icon;
  return (
    <g>
      {token && (
        <g>
          <ellipse cx={cx} cy={cy + r + 5} rx={r * 0.75} ry={r * 0.2} fill={C.ink} opacity="0.1" />
          <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-token${on ? 'On' : ''})`} stroke={on ? C.ink : C.edge} strokeWidth="1.1" />
        </g>
      )}
      <g transform={`translate(${(cx - size / 2).toFixed(1)} ${(cy - size / 2).toFixed(1)}) scale(${(size / 24).toFixed(3)})`}
        fill="none" stroke={color} strokeWidth={(width * 24) / size} strokeLinecap="round" strokeLinejoin="round">
        {ICON_PATHS[name]}
      </g>
    </g>
  );
}

/* A node: light by default, ink when it is the focal point (with a slow breathing ring) */
export function Node({ id, x, y, r = 7, on = false }) {
  return (
    <g>
      {on && <circle cx={x} cy={y} r={r * 3} fill={`url(#${id}-glow)`} />}
      <circle cx={x} cy={y} r={r} fill={`url(#${id}-${on ? 'nodeOn' : 'node'})`} stroke={on ? C.ink : C.silver} strokeWidth="1.1" />
      {on && <circle className="igv-pulse" cx={x} cy={y} r={r + 6} fill="none" stroke={C.steel} strokeWidth="1" />}
    </g>
  );
}

/* A dashed connector; `flow` animates the dashes along the path */
export const Dash = ({ d, flow = false, color = C.line, width = 1.2, dash = '3 6', opacity = 1 }) => (
  <path d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" opacity={opacity} className={flow ? 'igv-flow' : undefined} />
);

/* A solid signal line in ink with a quiet halo */
export const Signal = ({ d, width = 1.8 }) => (
  <g>
    <path d={d} fill="none" stroke={C.silver} strokeWidth={width * 4} strokeLinecap="round" opacity="0.18" />
    <path d={d} fill="none" stroke={C.slate} strokeWidth={width} strokeLinecap="round" />
  </g>
);

/* One small ink dot that travels a path, slowly and forever (CSS offset-path, off when paused) */
export const Traveller = ({ d, dur = 7, delay = 0, r = 4.5 }) => (
  <circle className="igv-travel" r={r} fill={C.ink} stroke="#FFFFFF" strokeWidth="1.5"
    style={{ offsetPath: `path('${d}')`, animationDuration: `${dur}s`, animationDelay: `${delay}s` }} />
);

/* An isometric circle (ellipse) on a horizontal plane */
export const IsoRing = ({ cx, cy, r, ...rest }) => <ellipse cx={cx} cy={cy} rx={r * 1.2247} ry={r * 0.7071} {...rest} />;

/* Group helpers for the two motions: rise in once (with a stagger), and float (focal object) */
export const Rise = ({ i = 0, children }) => <g className="igv-rise" style={{ '--d': `${0.15 + i * 0.12}s` }}>{children}</g>;
export const Float = ({ children }) => <g className="igv-float">{children}</g>;

/* A deterministic pseudo-random sequence, so drawings never change between renders */
export function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
