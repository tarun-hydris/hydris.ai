import { Block, C, Dash, Defs, Glyph, IsoRing, Mist, Node, Signal, Slab, iso, pts, rng } from './kit.jsx';
import { WORLD_DOTS } from '../../../lib/worlddots.js';

/* ------------------------------------------------------------------------------------------------
   The Hydris infographics, drawn natively on the white page. Each scene returns its viewBox, the
   drawing, and its labels in drawing coordinates; Infographic.jsx sets the labels as real text.
   Label kinds: tag (a quiet pill), plain (text on its own), strong (focal word), q (a question).
   Every scene is an illustration of a workflow, not plant data.
   ------------------------------------------------------------------------------------------------ */

const K = 0.8660254;
/* A tile whose top face is centred on screen point (X, Y) */
function tileAt(P, ox, oy, X, Y, w, d = w) {
  const u = (X - ox) / K; const v = 2 * (Y - oy);
  return { x: (u + v) / 2 - w / 2, y: (v - u) / 2 - d / 2, w, d };
}
const Tile = ({ P, id, ox, oy, X, Y, w, d, h = 14, on, z = 0 }) => <Slab P={P} id={id} {...tileAt(P, ox, oy, X, Y + h + z, w, d)} z={z} h={h} on={on} />;

/* ---------------------------------------------------------------- Venn: data, science, people */
function venn() {
  const id = 'vn';
  const c = [[500, 300], [372, 522], [628, 522]];
  const R = 232;
  return {
    vb: [1000, 860],
    svg: (
      <>
        <Defs id={id} />
        <defs>
          <radialGradient id="vn-fill" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stopColor="#2C4249" stopOpacity="0.92" /><stop offset="1" stopColor="#07161B" stopOpacity="0.96" /></radialGradient>
          <clipPath id="vn-a"><circle cx={c[0][0]} cy={c[0][1]} r={R} /></clipPath>
          <clipPath id="vn-b"><circle cx={c[1][0]} cy={c[1][1]} r={R} /></clipPath>
        </defs>
        <Mist id={id} cx={500} cy={450} rx={470} ry={400} />
        {c.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={R} fill="url(#vn-fill)" fillOpacity="0.62" stroke="#88A1A3" strokeWidth="1.4" />)}
        {c.map(([x, y], i) => <circle key={`d${i}`} cx={x} cy={y} r={R + 10} fill="none" stroke={C.mist} strokeWidth="1" strokeDasharray="3 7" />)}
        <g clipPath="url(#vn-a)"><g clipPath="url(#vn-b)">
          <circle cx={c[2][0]} cy={c[2][1]} r={R} fill="#56797F" fillOpacity="0.55" stroke="#D1D9D6" strokeWidth="1.6" />
        </g></g>
        <circle cx={500} cy={448} r={70} fill="url(#vn-glow)" />
        {[[500, 68], [268, 372], [732, 372], [500, 754], [140, 522], [860, 522]].map(([x, y], i) => <Node key={i} id={id} x={x} y={y} r={6} />)}
      </>
    ),
    labels: [
      { t: 'Plant data', x: 500, y: 200, k: 'plain', on: true },
      { t: 'Water science', x: 300, y: 600, k: 'plain', on: true },
      { t: 'Team experience', x: 700, y: 600, k: 'plain', on: true },
      { t: 'Hydris', x: 500, y: 462, k: 'strong', on: true },
    ],
  };
}

/* ---------------------------------------------------------------- Lite: readings to a few scores */
function liteSee() {
  const id = 'lt'; const P = iso(430, 440); const W = 300; const gap = 128; const h = 6;
  const r = rng(7);
  const raw = Array.from({ length: 170 }, () => [10 + r() * (W - 20), 10 + r() * (W - 20)]);
  const centres = [[70, 80], [200, 70], [150, 170], [80, 230], [230, 220]];
  const clusters = centres.flatMap(([cx, cy]) => Array.from({ length: 16 }, () => [cx + (r() - 0.5) * 46, cy + (r() - 0.5) * 46]));
  const z = (i) => i * gap;
  const top = (i) => z(i) + h;
  const corner = (i, a, b) => P(a, b, top(i));
  return {
    vb: [1200, 800],
    svg: (
      <>
        <Defs id={id} />
        <Mist id={id} cx={450} cy={420} rx={430} ry={360} />
        {[[0, 0], [W, 0], [0, W], [W, W]].map(([a, b], i) => {
          const p0 = P(a, b, top(0)); const p3 = P(a, b, top(3));
          return <Dash key={i} d={`M${p0[0]} ${p0[1]} L${p3[0]} ${p3[1]}`} color={C.mist} dash="3 6" />;
        })}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <Slab P={P} id={id} x={0} y={0} w={W} d={W} z={z(i)} h={h} on={i === 3} shadow={i === 0} alpha={i === 3 ? 0.92 : 0.55} />
            {i === 0 && raw.map(([a, b], k) => { const [X, Y] = P(a, b, top(0)); return <circle key={k} cx={X} cy={Y} r="2.3" fill="#A9B7B8" opacity="0.75" />; })}
            {i === 1 && clusters.map(([a, b], k) => { const [X, Y] = P(a, b, top(1)); return <circle key={k} cx={X} cy={Y} r="3" fill={k < 16 ? '#E7ECEC' : '#88A1A3'} opacity="0.9" />; })}
            {i === 2 && centres.slice(0, 4).map(([a, b], k) => { const [X, Y] = P(a, b, top(2)); return (
              <g key={k}><IsoRing cx={X} cy={Y} r={k === 1 ? 44 : 34} fill={`url(#${id}-glow)`} />
                <IsoRing cx={X} cy={Y} r={k === 1 ? 22 : 14} fill="none" stroke={k === 1 ? '#E7ECEC' : '#88A1A3'} strokeWidth={k === 1 ? 2 : 1.2} /></g>); })}
            {i === 3 && (() => {
              const [X, Y] = P(110, 120, top(3));
              return (
                <g>
                  <IsoRing cx={X} cy={Y} r={62} fill="none" stroke="#2C4249" strokeWidth="12" />
                  <IsoRing cx={X} cy={Y} r={62} fill="none" stroke="#D1D9D6" strokeWidth="12" pathLength="100" strokeDasharray="76 24" strokeLinecap="round" className="igv-grow" />
                  {[[220, 70], [235, 150], [215, 230]].map(([a, b], k) => { const [x2, y2] = P(a, b, top(3)); return (
                    <g key={k}><IsoRing cx={x2} cy={y2} r={20} fill="none" stroke="#2C4249" strokeWidth="5" />
                      <IsoRing cx={x2} cy={y2} r={20} fill="none" stroke="#A9B7B8" strokeWidth="5" pathLength="100" strokeDasharray={`${[88, 64, 92][k]} 100`} /></g>); })}
                </g>
              );
            })()}
            {(() => { const a = corner(i, W, 0); return <path d={`M${a[0] + 6} ${a[1]} H 860`} stroke={C.mist} strokeWidth="1" strokeDasharray="2 5" fill="none" />; })()}
            {(() => { const a = corner(i, W, 0); return <circle cx={a[0]} cy={a[1]} r="3.5" fill="#0E2229" stroke={C.steel} strokeWidth="1.4" />; })()}
          </g>
        ))}
      </>
    ),
    labels: [3, 2, 1, 0].map((i) => {
      const a = P(W, 0, top(i));
      return { t: ['Every reading the plant collects', 'Readings in context', 'What needs attention', 'A few clear scores'][i], x: 872, y: a[1], k: 'tag', align: 'left' };
    }),
  };
}

/* ---------------------------------------------------------------- Pulse: question to ranked causes */
function pulseUnderstand() {
  const id = 'pu';
  const ys = [140, 300, 460]; const L = [400, 330, 260];
  const icons = [['trend', 'doc'], ['book', 'doc'], ['trend', 'book']];
  return {
    vb: [1200, 620],
    svg: (
      <>
        <Defs id={id} />
        <defs>
          <linearGradient id="pu-bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#141D1B" /><stop offset="1" stopColor="#2C4249" /></linearGradient>
          <linearGradient id="pu-barOn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#07161B" /><stop offset="1" stopColor="#47656B" /></linearGradient>
        </defs>
        <Mist id={id} cx={600} cy={310} rx={600} ry={300} />
        <rect x="56" y="216" width="292" height="172" rx="22" fill="url(#pu-top)" stroke={C.ice} strokeWidth="1.4" />
        <path d="M110 386 L96 430 L150 388" fill="url(#pu-top)" stroke={C.ice} strokeWidth="1.4" strokeLinejoin="round" />
        <rect x="58" y="226" width="290" height="172" rx="22" fill={C.deep} opacity="0.05" filter={`url(#${id}-shadow)`} />
        <Signal d="M348 302 H418" />
        <Node id={id} x={430} y={302} r={9} on />
        {ys.map((y, i) => (
          <g key={y}>
            <Dash d={`M440 302 C 490 302, 470 ${y}, 528 ${y}`} flow={i === 0} color={i === 0 ? C.steel : C.line} />
            <rect x="548" y={y - 24} width={L[i]} height="48" rx="14" fill={`url(#pu-${i === 0 ? 'barOn' : 'bar'})`} stroke={i === 0 ? C.clear : C.ice} strokeWidth={i === 0 ? 1.8 : 1.3} />
            {i === 0 && <rect x="548" y={y - 24} width={L[i]} height="48" rx="14" fill="none" stroke={C.clear} strokeWidth="10" opacity="0.12" />}
            <path d={`M536 ${y - 15} L551 ${y} L536 ${y + 15} L521 ${y} Z`} fill="#0E2229" stroke={i === 0 ? C.steel : C.ice} strokeWidth="1.4" />
            <text x="536" y={y + 4} textAnchor="middle" fontSize="12" fill="#E7ECEC" fontFamily="var(--sans)">{i + 1}</text>
            {icons[i].map((g, k) => (
              <g key={g + k}>
                <rect x={590 + k * 58} y={y - 88} width="46" height="46" rx="10" fill="url(#pu-top)" stroke={C.pale} strokeWidth="1.2" />
                <Glyph name={g} x={613 + k * 58} y={y - 53} size={24} width={1.6} token={false} />
              </g>
            ))}
            <Dash d={`M${548 + L[i]} ${y} C ${960} ${y}, ${930} 302, ${990} 302`} color={C.line} opacity={i === 0 ? 1 : 0.7} />
          </g>
        ))}
        <Node id={id} x={995} y={302} r={6} />
        <circle cx="1080" cy="302" r="62" fill={`url(#${id}-glow)`} />
        <circle cx="1080" cy="302" r="40" fill="url(#pu-top)" stroke={C.steel} strokeWidth="1.8" />
        <path d="M1062 303 L1075 316 L1100 289" fill="none" stroke="#E7ECEC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1001 302 H1040" stroke={C.steel} strokeWidth="1.6" />
      </>
    ),
    labels: [
      { t: 'Why is TSS drifting in the effluent?', x: 84, y: 302, k: 'q', w: 240, on: true },
      { t: 'Most likely cause', x: 578, y: 140, k: 'plain', align: 'left', on: true },
      { t: 'Possible cause', x: 578, y: 300, k: 'plain', align: 'left', on: true },
      { t: 'Less likely', x: 578, y: 460, k: 'plain', align: 'left', on: true },
      { t: 'Evidence', x: 590, y: 36, k: 'small', align: 'left' },
      { t: 'Operator decides', x: 1080, y: 392, k: 'tag' },
    ],
  };
}

/* ---------------------------------------------------------------- Field: a guided round */
function fieldAct() {
  const id = 'fa'; const ox = 600; const oy = 120; const P = iso(ox, oy);
  const T = [[180, 560], [420, 470], [670, 380], [920, 290]];
  const grid = [];
  for (let i = -6; i <= 14; i++) {
    const a = P(i * 70, -200); const b = P(i * 70, 900); grid.push(`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`);
    const c = P(-200, i * 70); const d = P(900, i * 70); grid.push(`M${c[0]} ${c[1]}L${d[0]} ${d[1]}`);
  }
  return {
    vb: [1200, 700],
    svg: (
      <>
        <Defs id={id} />
        <defs>
          <radialGradient id="fa-fade" cx="0.5" cy="0.62" r="0.62"><stop offset="0.35" stopColor="#fff" stopOpacity="1" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
          <mask id="fa-mask"><rect width="1200" height="700" fill="url(#fa-fade)" /></mask>
        </defs>
        <g mask="url(#fa-mask)"><path d={grid.join('')} stroke={C.pale} strokeWidth="1" opacity="0.7" /></g>
        <Dash d={`M${T[0][0]} ${T[0][1]} L${T[1][0]} ${T[1][1]} L${T[2][0]} ${T[2][1]} L${T[3][0]} ${T[3][1]} L1080 210`} flow color={C.clear} width={1.8} dash="6 8" />
        {T.map(([X, Y], i) => (
          <g key={i}>
            <Tile P={P} id={id} ox={ox} oy={oy} X={X} Y={Y} w={118} on={i === 2} />
            <Node id={id} x={X} y={Y + 44} r={5} on={i === 2} />
          </g>
        ))}
        <Glyph name="pin" x={180} y={546} size={52} />
        <Glyph name="engineer" x={420} y={456} size={52} />
        <Glyph name="doc" x={920} y={276} size={52} />
        {/* the gauge, standing */}
        <g transform="translate(670 300)">
          <line x1="0" y1="66" x2="0" y2="40" stroke={C.glacial} strokeWidth="3" />
          <circle r="42" fill="url(#fa-top)" stroke={C.steel} strokeWidth="2.4" />
          <circle r="34" fill="none" stroke={C.pale} strokeWidth="1.2" />
          {Array.from({ length: 9 }, (_, k) => { const a = (-210 + k * 30) * (Math.PI / 180); return <line key={k} x1={Math.cos(a) * 27} y1={Math.sin(a) * 27} x2={Math.cos(a) * 33} y2={Math.sin(a) * 33} stroke="#A9B7B8" strokeWidth="1.4" />; })}
          <line x1="0" y1="0" x2="18" y2="-20" stroke="#E7ECEC" strokeWidth="2.6" strokeLinecap="round" />
          <circle r="4" fill="#E7ECEC" />
        </g>
        {/* the readout panel beside it */}
        <Dash d="M630 292 L610 262" color={C.steel} dash="3 5" />
        <rect x="440" y="200" width="168" height="62" rx="14" fill="url(#fa-topOn)" stroke={C.clear} strokeWidth="1.6" />
        <circle cx="580" cy="231" r="13" fill="#0E2229" stroke={C.steel} strokeWidth="1.6" />
        <path d="M573 231 L578 236 L587 226" fill="none" stroke="#E7ECEC" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* smart glasses above */}
        <g transform="translate(670 92)" fill="url(#fa-top)" stroke={C.glacial} strokeWidth="2" strokeLinejoin="round">
          <path d="M-96 -10 H-14 Q-10 22 -40 26 H-70 Q-96 24 -96 -10 Z" />
          <path d="M96 -10 H14 Q10 22 40 26 H70 Q96 24 96 -10 Z" />
          <path d="M-14 -4 Q0 -12 14 -4" fill="none" />
          <path d="M-96 -10 L-116 -18 M96 -10 L116 -18" fill="none" />
        </g>
        <Dash d="M670 124 V250" color={C.steel} dash="3 6" />
        {/* the shift record */}
        <Tile P={P} id={id} ox={ox} oy={oy} X={1080} Y={210} w={78} h={10} />
        <Glyph name="book" x={1080} y={200} size={42} />
      </>
    ),
    labels: [
      { t: 'Go to Pump P-2', x: 180, y: 640, k: 'tag', n: 1 },
      { t: 'Check coupling', x: 420, y: 550, k: 'tag', n: 2 },
      { t: 'Read the gauge', x: 670, y: 460, k: 'tag', n: 3 },
      { t: 'Complete the checklist', x: 920, y: 370, k: 'tag', n: 4 },
      { t: '4.2 bar', x: 508, y: 231, k: 'value', on: true },
      { t: 'Shift record', x: 1080, y: 272, k: 'tag' },
    ],
  };
}

/* ---------------------------------------------------------------- Memory: what the plant keeps */
function shiftMemory() {
  const id = 'sm'; const P = iso(250, 330);
  const discs = [[560, 430], [700, 404], [840, 374], [980, 340], [1120, 300]];
  const r = rng(3);
  const drops = Array.from({ length: 6 }, (_, i) => [196 + i * 22 + r() * 8, 40 + r() * 40]);
  return {
    vb: [1240, 500],
    svg: (
      <>
        <Defs id={id} />
        <Mist id={id} cx={620} cy={330} rx={620} ry={240} />
        <circle cx="735" cy="250" r="128" fill="none" stroke={C.mist} strokeWidth="1" strokeDasharray="3 7" />
        <circle cx="1060" cy="220" r="128" fill="none" stroke={C.mist} strokeWidth="1" strokeDasharray="3 7" />
        <g stroke={C.lagoon} strokeWidth="1.6" fill="none" strokeLinecap="round">
          <circle cx="735" cy="186" r="14" />
          {Array.from({ length: 8 }, (_, k) => { const a = (k * Math.PI) / 4; return <line key={k} x1={735 + Math.cos(a) * 21} y1={186 + Math.sin(a) * 21} x2={735 + Math.cos(a) * 28} y2={186 + Math.sin(a) * 28} />; })}
          <path d="M1068 168 A 20 20 0 1 0 1078 198 A 15 15 0 1 1 1068 168 Z" />
        </g>
        {drops.map(([x, y], i) => (
          <g key={i}><Dash d={`M${x} ${y + 8} V${y + 70}`} color={C.mist} dash="2 5" /><circle cx={x} cy={y} r="5" fill={`url(#${id}-node)`} stroke={C.ice} /></g>
        ))}
        <Block P={P} id={id} x={-70} y={-70} w={140} d={140} z={0} h={150} on layers={8} />
        <Dash d={`M380 340 C 440 380, 480 430, ${discs[0][0] - 36} ${discs[0][1]}`} color={C.steel} dash="4 6" flow />
        <path d={`M${discs.map((d) => d.join(' ')).join(' L')}`} fill="none" stroke={C.ice} strokeWidth="1.4" />
        {discs.map(([x, y], i) => (
          <g key={i}>
            <IsoRing cx={x} cy={y + 8} r={30} fill={C.deep} opacity="0.08" filter={`url(#${id}-shadow)`} />
            <IsoRing cx={x} cy={y + 6} r={28} fill="url(#sm-sideR)" stroke={C.pale} />
            <IsoRing cx={x} cy={y} r={28} fill={`url(#sm-${i === 4 ? 'topOn' : 'top'})`} stroke={i === 4 ? C.clear : C.ice} strokeWidth="1.4" />
            <circle cx={x} cy={y} r="4" fill={i === 4 ? C.steel : C.clear} />
            {i < 4 && (() => { const mx = (x + discs[i + 1][0]) / 2; const my = (y + discs[i + 1][1]) / 2 - 18; return <rect x={mx - 13} y={my - 8} width="26" height="16" rx="4" fill="url(#sm-top)" stroke={C.ice} />; })()}
          </g>
        ))}
      </>
    ),
    labels: [
      { t: 'What the plant knows', x: 250, y: 470, k: 'tag' },
      { t: 'Day shift', x: 735, y: 106, k: 'plain' },
      { t: 'Night shift', x: 1060, y: 76, k: 'plain' },
      { t: 'Next shift', x: 1120, y: 360, k: 'tag' },
    ],
  };
}

/* Small factory outline and status ring used by Stewardship */
const Factory = ({ x, y }) => (
  <g transform={`translate(${x - 26} ${y - 46})`} fill="url(#st-top)" stroke="#D1D9D6" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M0 46 V20 L14 28 V20 L28 28 V20 L40 28 V4 H50 V46 Z" />
    <path d="M8 36 H14 M22 36 H28 M34 36 H40" fill="none" />
  </g>
);
const Ring = ({ x, y, v, alert }) => (
  <g>
    <circle cx={x} cy={y} r="16" fill="none" stroke={C.pale} strokeWidth="4" />
    <circle cx={x} cy={y} r="16" fill="none" stroke={alert ? C.glacial : C.clear} strokeWidth="4" pathLength="100" strokeDasharray={`${v} 100`} transform={`rotate(-90 ${x} ${y})`} strokeLinecap="round" />
  </g>
);

/* ---------------------------------------------------------------- Stewardship: brand to suppliers */
function stewardship() {
  const id = 'st'; const ox = 650; const oy = 40; const P = iso(ox, oy);
  const F = [170, 410, 650, 890, 1130];
  const v = [90, 72, 86, 38, 78];
  const W = 1300;
  const dots = [];
  for (let i = 0; i < WORLD_DOTS.length; i += 4) {
    const x = WORLD_DOTS[i] / 1000; const y = WORLD_DOTS[i + 1] / 1000;
    dots.push(<circle key={i} cx={60 + x * 1180} cy={130 + y * 400} r="2.4" fill={C.waterlight} opacity="0.16" />);
  }
  return {
    vb: [W, 640],
    svg: (
      <>
        <Defs id={id} />
        {dots}
        {F.map((x, i) => <Dash key={i} d={`M650 214 C 650 300, ${x} 300, ${x} 392`} color={i === 3 ? C.glacial : C.line} flow={i === 2} />)}
        <Tile P={P} id={id} ox={ox} oy={oy} X={650} Y={160} w={150} h={20} on />
        {/* a shopping bag: the brand */}
        <g transform="translate(626 104)" fill="url(#st-top)" stroke="#D1D9D6" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
          <path d="M4 18 H44 L41 52 H7 Z" /><path d="M15 18 V12 A9 9 0 0 1 33 12 V18" fill="none" />
        </g>
        {F.map((x, i) => (
          <g key={x}>
            <Tile P={P} id={id} ox={ox} oy={oy} X={x} Y={520} w={118} />
            <Factory x={x - 8} y={512} />
            <Ring x={x + 62} y={474} v={v[i]} alert={i === 3} />
            {i === 2
              ? <g transform={`translate(${x} 420)`} fill="none" stroke={C.steel} strokeWidth="2" strokeLinecap="round"><path d="M-14 -4 A14 14 0 0 1 12 -8 M14 4 A14 14 0 0 1 -12 8" /><path d="M8 -14 L12 -8 L5 -5 M-8 14 L-12 8 L-5 5" /></g>
              : <Glyph name="drop" x={x} y={438} size={30} />}
          </g>
        ))}
      </>
    ),
    labels: [
      { t: 'Brand', x: 650, y: 248, k: 'tag' },
      ...['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D', 'Supplier E'].map((t, i) => ({ t, x: F[i], y: 604, k: 'tag' })),
      { t: 'Water reuse', x: 650, y: 380, k: 'small' },
      { t: 'Needs attention', x: 952, y: 418, k: 'small' },
    ],
  };
}

/* ---------------------------------------------------------------- Portfolio: many sites, one view */
function portfolio() {
  const id = 'pf'; const W = 1300; const H = 660;
  const cx = 560; const cy = 360;
  const edge = (a) => 1 + 0.16 * Math.sin(3 * a + 0.6) + 0.09 * Math.sin(5 * a + 1.7) + 0.05 * Math.sin(9 * a);
  const inside = (x, y) => { const dx = (x - cx) / 470; const dy = (y - cy) / 250; const a = Math.atan2(dy, dx); return Math.hypot(dx, dy) < edge(a) * 0.92; };
  const dots = [];
  for (let y = 70; y < H - 30; y += 13) for (let x = 40; x < 1080; x += 13) if (inside(x, y)) dots.push([x + ((y / 13) % 2) * 6.5, y]);
  const r = rng(11);
  const sites = [];
  while (sites.length < 22) { const x = 120 + r() * 880; const y = 120 + r() * 460; if (inside(x, y) && Math.hypot(x - cx, y - cy) > 60) sites.push([x, y]); }
  const flag = [3, 9, 14];
  return {
    vb: [W, H],
    svg: (
      <>
        <Defs id={id} />
        <Mist id={id} cx={cx} cy={cy} rx={560} ry={330} />
        {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.6" fill={C.waterlight} opacity="0.28" />)}
        {sites.map(([x, y], i) => <path key={`a${i}`} d={`M${cx} ${cy} Q ${(cx + x) / 2} ${Math.min(cy, y) - 70} ${x} ${y}`} fill="none" stroke={flag.includes(i) ? C.steel : C.line} strokeWidth="1" strokeDasharray="3 6" opacity={flag.includes(i) ? 0.9 : 0.55} />)}
        {sites.map(([x, y], i) => (flag.includes(i)
          ? <g key={i}><IsoRing cx={x} cy={y} r={18} fill="none" stroke={C.steel} strokeWidth="1.4" /><line x1={x} y1={y} x2={x} y2={y - 52} stroke={C.steel} strokeWidth="2" /><Node id={id} x={x} y={y - 56} r={7} on /></g>
          : <Node key={i} id={id} x={x} y={y} r={5} />))}
        <Node id={id} x={cx} y={cy} r={11} on />
        {/* the decision card */}
        <rect x="1010" y="70" width="250" height="200" rx="18" fill="url(#pf-top)" stroke={C.ice} strokeWidth="1.4" />
        <path d="M1040 240 H1236 M1040 240 V96" stroke={C.mist} strokeWidth="1.2" fill="none" />
        <rect x="1140" y="100" width="90" height="70" rx="8" fill={C.clear} fillOpacity="0.18" stroke={C.steel} strokeDasharray="3 4" />
        {[[1060, 210], [1090, 190], [1112, 222], [1070, 150], [1160, 140], [1188, 120], [1205, 152], [1120, 120]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i > 3 && i < 7 ? 6 : 4} fill={i > 3 && i < 7 ? C.steel : C.mist} />)}
      </>
    ),
    labels: [
      ...flag.map((s, i) => ({ t: `Site ${s}`, x: sites[s][0], y: sites[s][1] - 86, k: 'tag', n: i })),
      { t: 'Invest first', x: 1185, y: 186, k: 'small', on: true },
      { t: 'Value of acting', x: 1022, y: 168, k: 'axis', on: true },
      { t: 'Operational risk', x: 1138, y: 256, k: 'small', on: true },
    ],
  };
}

/* ---------------------------------------------------------------- Closing: plant to watershed */
function everyDrop() {
  const id = 'ed'; const W = 1600; const H = 760;
  const lines = [];
  for (let k = 0; k < 18; k++) {
    const y0 = 300 + k * 26; let d = `M600 ${y0}`;
    for (let x = 600; x <= W; x += 40) d += ` L${x} ${(y0 + Math.sin(x / 140 + k * 0.7) * (6 + k * 0.6)).toFixed(1)}`;
    lines.push(<path key={k} d={d} fill="none" stroke={C.waterlight} strokeWidth="1" strokeDasharray="1 7" strokeLinecap="round" opacity={0.25 + k * 0.03} />);
  }
  const river = 'M760 760 C 820 640, 980 640, 1000 560 S 1150 470, 1260 440 S 1450 360, 1600 300';
  const towns = [[1180, 410], [1220, 470], [1330, 380], [1370, 430], [1440, 330], [1500, 380], [1560, 300], [1290, 500], [1110, 520]];
  const P = iso(1000, 380);
  return {
    vb: [W, H],
    svg: (
      <>
        <Defs id={id} />
        <defs>
          <linearGradient id="ed-river" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor={C.waterlight} /><stop offset="1" stopColor={C.steel} /></linearGradient>
          <radialGradient id="ed-dawn2" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#E6ECEC" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" /></radialGradient>
          <linearGradient id="ed-fadeG" x1="0" y1="0" x2="1" y2="0"><stop offset="0.36" stopColor="#fff" stopOpacity="0" /><stop offset="0.62" stopColor="#fff" stopOpacity="1" /></linearGradient>
          <mask id="ed-fade"><rect width={W} height={H} fill="url(#ed-fadeG)" /></mask>
        </defs>
        <ellipse cx="1240" cy="200" rx="520" ry="260" fill="url(#ed-dawn2)" />
        <g mask="url(#ed-fade)">{lines}</g>
        <path d={river} fill="none" stroke={C.clear} strokeWidth="26" strokeLinecap="round" opacity="0.18" />
        <path d={river} fill="none" stroke="url(#ed-river)" strokeWidth="9" strokeLinecap="round" />
        <path d={river} fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="10 14" className="igv-flow" opacity="0.9" />
        {/* the plant on the bank */}
        <Slab P={P} id={id} x={-20} y={60} w={150} d={110} h={6} />
        {[[10, 90], [70, 90], [40, 140]].map(([a, b], i) => { const [X, Y] = P(a, b, 6); return (
          <g key={i}><IsoRing cx={X} cy={Y - 6} r={18} fill="url(#ed-sideR)" stroke={C.pale} /><IsoRing cx={X} cy={Y - 12} r={18} fill="url(#ed-top)" stroke={C.steel} strokeWidth="1.3" /></g>); })}
        {towns.map(([x, y], i) => <Node key={i} id={id} x={x} y={y} r={i % 3 === 0 ? 6 : 4} on={i === 4} />)}
        {/* the drop, catching the light */}
        <g transform="translate(1270 150)">
          <circle r="90" fill="none" stroke={C.mist} strokeDasharray="3 7" />
          <circle r="64" fill="none" stroke={C.ice} strokeDasharray="2 6" />
          <path d="M0 -44 C 18 -18, 30 0, 30 16 A30 30 0 0 1 -30 16 C -30 0, -18 -18, 0 -44 Z" fill={`url(#${id}-node)`} stroke={C.steel} strokeWidth="1.6" />
          <path d="M-12 14 A14 14 0 0 0 0 28" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </g>
        <Dash d="M1270 242 V330" color={C.steel} dash="3 6" />
      </>
    ),
    labels: [
      { t: 'Plant', x: 1040, y: 540, k: 'small' },
      { t: 'Communities', x: 1440, y: 280, k: 'small' },
    ],
  };
}

/* ---------------------------------------------------------------- Platform: the five-step loop */
function fiveStepLoop() {
  const id = 'fl'; const cx = 650; const cy = 300; const rx = 470; const ry = 210;
  const ox = 650; const oy = 0; const P = iso(ox, oy);
  const angles = [-90, -18, 54, 126, 198];
  const names = ['stack', 'search', 'reason', 'hand', 'refresh'];
  const pos = angles.map((a) => [cx + rx * Math.cos((a * Math.PI) / 180), cy + ry * Math.sin((a * Math.PI) / 180)]);
  const labels = ['Data', 'Understand', 'Reason', 'Act', 'Learn'];
  return {
    vb: [1300, 600],
    svg: (
      <>
        <Defs id={id} />
        <Mist id={id} cx={cx} cy={cy} rx={620} ry={300} />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={C.ice} strokeWidth="1.2" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={C.steel} strokeWidth="1.8" strokeDasharray="6 10" className="igv-flow" />
        <path d={`M${pos[0][0] - 70} ${pos[0][1] + 3} l 16 -8 l -4 14 z`} fill={C.steel} />
        {pos.map(([X, Y], i) => (
          <g key={i}>
            <Tile P={P} id={id} ox={ox} oy={oy} X={X} Y={Y - 14} w={120} h={16} on={i === 0} />
            <Glyph name={names[i]} x={X} y={Y - 32} size={50} width={1.6} />
          </g>
        ))}
      </>
    ),
    labels: pos.map(([X, Y], i) => ({ t: `${String(i + 1).padStart(2, '0')}  ${labels[i]}`, x: X, y: Y + 66, k: 'tag' })),
  };
}

/* ---------------------------------------------------------------- Platform: onboarding in weeks */
function onboarding() {
  const id = 'ob'; const ox = 650; const oy = -200; const P = iso(ox, oy);
  const T = [[190, 410], [500, 340], [810, 270], [1110, 200]];
  return {
    vb: [1300, 560],
    svg: (
      <>
        <Defs id={id} />
        <Mist id={id} cx={650} cy={320} rx={640} ry={250} />
        <Signal d={`M${T[0][0]} ${T[0][1] + 40} L${T[1][0]} ${T[1][1] + 40} L${T[2][0]} ${T[2][1] + 40} L${T[3][0]} ${T[3][1] + 40}`} width={1.6} />
        {T.slice(0, 3).map(([X, Y], i) => <Node key={i} id={id} x={(X + T[i + 1][0]) / 2} y={(Y + T[i + 1][1]) / 2 + 40} r={5} />)}
        {T.map(([X, Y], i) => <Tile key={i} P={P} id={id} ox={ox} oy={oy} X={X} Y={Y} w={150} h={18} on={i === 2} />)}
        <Glyph name="send" x={190} y={398} size={54} />
        <Glyph name="engineer" x={500} y={328} size={54} />
        <Glyph name="doc" x={810} y={258} size={54} />
        <g stroke={C.lagoon} strokeWidth="1.6" strokeLinecap="round">{Array.from({ length: 5 }, (_, k) => { const a = (-160 + k * 35) * (Math.PI / 180); return <line key={k} x1={838 + Math.cos(a) * 18} y1={200 + Math.sin(a) * 18} x2={838 + Math.cos(a) * 25} y2={200 + Math.sin(a) * 25} />; })}</g>
        <Tile P={P} id={id} ox={ox} oy={oy} X={1110} Y={150} w={96} h={14} z={0} />
        <Tile P={P} id={id} ox={ox} oy={oy} X={1110} Y={112} w={70} h={12} z={0} on />
        <Glyph name="plus" x={1110} y={108} size={30} />
      </>
    ),
    labels: [
      { t: 'Week 1', s: 'Send your exports', x: 190, y: 500, k: 'step' },
      { t: 'Weeks 2 to 3', s: 'Configure with your team', x: 500, y: 430, k: 'step' },
      { t: 'Go live', s: 'A daily read', x: 810, y: 360, k: 'step' },
      { t: 'When ready', s: 'Add Pulse and Field', x: 1110, y: 290, k: 'step' },
    ],
  };
}

/* ---------------------------------------------------------------- About: Portland to Puducherry */
function usIndia() {
  const id = 'ui'; const W = 1400; const x0 = 40; const w = 1320; const y0 = 30; const h = (w * 134) / 348;
  const M = (u, v) => [x0 + u * w, y0 + v * h];
  const dots = [];
  for (let i = 0; i < WORLD_DOTS.length; i += 2) {
    const [x, y] = M(WORLD_DOTS[i] / 1000, WORLD_DOTS[i + 1] / 1000);
    dots.push(<circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="3.6" fill={C.waterlight} opacity="0.35" />);
  }
  const a = M(0.1302, 0.2425); const b = M(0.7126, 0.493);
  const arc = `M${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2} ${y0 - 60} ${b[0]} ${b[1]}`;
  return {
    vb: [W, Math.round(y0 * 2 + h)],
    svg: (
      <>
        <Defs id={id} />
        {dots}
        <path d={arc} fill="none" stroke={C.clear} strokeWidth="6" opacity="0.15" />
        <path d={arc} fill="none" stroke={C.steel} strokeWidth="2" strokeDasharray="7 8" className="igv-flow" />
        <Node id={id} x={a[0]} y={a[1]} r={10} on />
        <Node id={id} x={b[0]} y={b[1]} r={10} on />
      </>
    ),
    labels: [
      { t: 'Portland, Oregon', x: a[0], y: a[1] + 46, k: 'tag' },
      { t: 'Puducherry, India', x: b[0], y: b[1] + 46, k: 'tag' },
    ],
  };
}

export const SCENES = {
  'venn-hydris': { make: venn, alt: 'Diagram: plant data, water science and team experience overlap, and Hydris sits where all three meet' },
  'lite-see': { make: liteSee, alt: 'Diagram: four layers, from every reading the plant collects, to readings in context, to what needs attention, to a few clear scores' },
  'pulse-understand': { make: pulseUnderstand, alt: 'Diagram: a question about drifting suspended solids leads to three ranked possible causes, each with its evidence, and ends with the operator deciding' },
  'field-act': { make: fieldAct, alt: 'Diagram: a guided round through Pump P-2, a coupling check, a gauge reading of 4.2 bar shown in smart glasses, a checklist and the shift record' },
  'shift-memory': { make: shiftMemory, alt: 'Diagram: a layered store of plant knowledge passes what each shift learns from the day shift to the night shift' },
  stewardship: { make: stewardship, alt: 'Diagram: one brand connected to five supplier factories, each with a water status ring; one reuses its water and one needs attention' },
  portfolio: { make: portfolio, alt: 'Diagram: many sites on one map connected to a centre, three flagged, with a chart showing where to invest first' },
  'every-drop': { make: everyDrop, alt: '' },
  'five-step-loop': { make: fiveStepLoop, alt: 'Diagram: five steps on one loop: data, understand, reason, act and learn' },
  'onboarding-timeline': { make: onboarding, alt: 'Diagram: four rising steps: send your exports in week one, configure with your team in weeks two to three, go live with a daily read, then add Pulse and Field' },
  'us-india': { make: usIndia, alt: 'Map: a line joins Portland, Oregon to Puducherry, India' },
};
export { pts };
