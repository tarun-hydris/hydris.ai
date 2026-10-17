import { Block, C, Dash, Defs, Float, Glyph, IsoRing, Mist, Node, Rise, Signal, Slab, Traveller, iso, rng } from './kit.jsx';
import { WORLD_DOTS } from '../../../lib/worlddots.js';

/* ------------------------------------------------------------------------------------------------
   The Hydris infographics, drawn natively on the white page. Each scene returns its viewBox, the
   drawing, and its labels in drawing coordinates; Infographic.jsx sets the labels as real text.
   Label kinds: tag (an ink pill), plain, strong, small, axis, value, q, step. `on: true` marks a
   label that sits on a dark shape (light text). Every scene illustrates a workflow, not plant data.
   One focal object per drawing is ink; everything else is light glass and quiet structure.
   ------------------------------------------------------------------------------------------------ */

const K = 0.8660254;
/* A tile whose top face is centred on screen point (X, Y) */
function tileAt(ox, oy, X, Y, w, d = w) {
  const u = (X - ox) / K; const v = 2 * (Y - oy);
  return { x: (u + v) / 2 - w / 2, y: (v - u) / 2 - d / 2, w, d };
}
const Tile = ({ P, id, ox, oy, X, Y, w, d, h = 14, on, z = 0, alpha }) => <Slab P={P} id={id} {...tileAt(ox, oy, X, Y + h + z, w, d)} z={z} h={h} on={on} alpha={alpha} />;
const poly = (arr) => `M${arr.map((p) => p.join(' ')).join(' L')}`;

/* ---------------------------------------------------------------- Venn: data, science, people */
function venn() {
  const id = 'vn';
  const c = [[500, 300], [372, 522], [628, 522]];
  const R = 232;
  const orbit = (x, y, r) => `M${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y}`;
  return {
    vb: [1000, 860],
    svg: (
      <>
        <Defs id={id} />
        <defs>
          <radialGradient id="vn-fill" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E3EAEA" /></radialGradient>
          <clipPath id="vn-a"><circle cx={c[0][0]} cy={c[0][1]} r={R} /></clipPath>
          <clipPath id="vn-b"><circle cx={c[1][0]} cy={c[1][1]} r={R} /></clipPath>
        </defs>
        <Mist id={id} cx={500} cy={450} rx={480} ry={420} />
        {c.map(([x, y], i) => (
          <Rise key={i} i={i}>
            <circle cx={x} cy={y + 10} r={R} fill={C.ink} opacity="0.06" filter={`url(#${id}-shadow)`} />
            <circle cx={x} cy={y} r={R} fill="url(#vn-fill)" fillOpacity="0.8" stroke={C.edge} strokeWidth="1.3" />
            <circle cx={x} cy={y} r={R + 12} fill="none" stroke={C.mist} strokeWidth="1" strokeDasharray="2 7" />
          </Rise>
        ))}
        <Rise i={3}>
          <Float>
            <g clipPath="url(#vn-a)"><g clipPath="url(#vn-b)">
              <circle cx={c[2][0]} cy={c[2][1]} r={R} fill={`url(#${id}-topOn)`} stroke={C.ink} strokeWidth="1.4" />
            </g></g>
          </Float>
        </Rise>
        {c.map(([x, y], i) => <Traveller key={i} d={orbit(x, y, R + 12)} dur={18 + i * 4} delay={-i * 5} r={4} />)}
      </>
    ),
    labels: [
      { t: 'Plant data', x: 500, y: 196, k: 'plain' },
      { t: 'Water science', x: 296, y: 604, k: 'plain' },
      { t: 'Team experience', x: 704, y: 604, k: 'plain' },
      { t: 'Hydris', x: 500, y: 456, k: 'strong', on: true },
    ],
  };
}

/* ---------------------------------------------------------------- Lite: readings to a few scores */
function liteSee() {
  const id = 'lt'; const P = iso(430, 440); const W = 300; const gap = 128; const h = 6;
  const r = rng(7);
  const raw = Array.from({ length: 150 }, () => [10 + r() * (W - 20), 10 + r() * (W - 20)]);
  const centres = [[70, 80], [200, 70], [150, 170], [80, 230], [230, 220]];
  const clusters = centres.flatMap(([cx, cy]) => Array.from({ length: 14 }, () => [cx + (r() - 0.5) * 44, cy + (r() - 0.5) * 44]));
  const z = (i) => i * gap;
  const top = (i) => z(i) + h;
  const rise = (() => { const a = P(W, W, top(0)); const b = P(W, W, top(3)); return `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`; })();
  return {
    vb: [1200, 800],
    svg: (
      <>
        <Defs id={id} />
        <Mist id={id} cx={450} cy={420} rx={440} ry={370} />
        {[[0, 0], [W, 0], [0, W], [W, W]].map(([a, b], i) => {
          const p0 = P(a, b, top(0)); const p3 = P(a, b, top(3));
          return <Dash key={i} d={`M${p0[0]} ${p0[1]} L${p3[0]} ${p3[1]}`} color={C.mist} dash="2 6" />;
        })}
        <Traveller d={rise} dur={5} r={4} />
        {[0, 1, 2, 3].map((i) => {
          const layer = (
            <g>
              <Slab P={P} id={id} x={0} y={0} w={W} d={W} z={z(i)} h={h} on={i === 3} shadow={i === 0} alpha={i === 3 ? 1 : 0.86} />
              {i === 0 && raw.map(([a, b], k) => { const [X, Y] = P(a, b, top(0)); return <circle key={k} cx={X} cy={Y} r="2.2" fill={C.silver} />; })}
              {i === 1 && clusters.map(([a, b], k) => { const [X, Y] = P(a, b, top(1)); return <circle key={k} cx={X} cy={Y} r="2.8" fill={k < 14 ? C.ink : C.steel} />; })}
              {i === 2 && centres.slice(0, 4).map(([a, b], k) => { const [X, Y] = P(a, b, top(2)); return (
                <g key={k}>{k === 1 && <IsoRing cx={X} cy={Y} r={40} fill={`url(#${id}-glow)`} />}
                  <IsoRing cx={X} cy={Y} r={k === 1 ? 22 : 13} fill={k === 1 ? C.ink : 'none'} fillOpacity={k === 1 ? 0.12 : 0} stroke={k === 1 ? C.ink : C.silver} strokeWidth={k === 1 ? 1.8 : 1.1} /></g>); })}
              {i === 3 && (() => {
                const [X, Y] = P(110, 120, top(3));
                return (
                  <g>
                    <IsoRing cx={X} cy={Y} r={62} fill="none" stroke={C.slate} strokeWidth="11" />
                    <IsoRing cx={X} cy={Y} r={62} fill="none" stroke={C.pale} strokeWidth="11" pathLength="100" strokeDasharray="76 24" strokeLinecap="round" className="igv-grow" />
                    {[[220, 70], [235, 150], [215, 230]].map(([a, b], k) => { const [x2, y2] = P(a, b, top(3)); return (
                      <g key={k}><IsoRing cx={x2} cy={y2} r={19} fill="none" stroke={C.slate} strokeWidth="5" />
                        <IsoRing cx={x2} cy={y2} r={19} fill="none" stroke={C.silver} strokeWidth="5" pathLength="100" strokeDasharray={`${[88, 64, 92][k]} 100`} /></g>); })}
                  </g>
                );
              })()}
              {(() => { const a = P(W, 0, top(i)); return <g><path d={`M${a[0] + 6} ${a[1]} H 860`} stroke={C.mist} strokeWidth="1" strokeDasharray="2 5" fill="none" /><circle cx={a[0]} cy={a[1]} r="3.5" fill="#FFFFFF" stroke={C.steel} strokeWidth="1.3" /></g>; })()}
            </g>
          );
          return <Rise key={i} i={i}>{i === 3 ? <Float>{layer}</Float> : layer}</Rise>;
        })}
      </>
    ),
    labels: [3, 2, 1, 0].map((i) => {
      const a = P(W, 0, top(i));
      return { t: ['Every reading the plant collects', 'Readings in context', 'What needs attention', 'A few clear scores'][i], x: 872, y: a[1], k: 'tag', align: 'left' };
    }),
  };
}

/* ---------------------------------------------------------------- Pulse: guided troubleshooting */
function pulseUnderstand() {
  const id = 'pu';
  const ys = [150, 300, 450]; const conf = [0.74, 0.46, 0.22];
  const icons = [['trend', 'book'], ['doc', 'trend'], ['book', 'doc']];
  const path = 'M300 300 L372 300 C 420 300, 430 150, 480 150 L 800 150 C 880 150, 900 250, 960 260 L 1036 260 L 1036 420';
  return {
    vb: [1200, 620],
    svg: (
      <>
        <Defs id={id} />
        <Mist id={id} cx={620} cy={310} rx={600} ry={300} />
        {/* 1 the alert that starts the investigation (from Lite) */}
        <Rise i={0}>
          <rect x="56" y="242" width="244" height="116" rx="18" fill={C.ink} opacity="0.18" filter={`url(#${id}-shadow)`} />
          <Float><rect x="50" y="234" width="250" height="122" rx="18" fill={`url(#${id}-topOn)`} stroke={C.ink} />
            <Glyph id={id} name="alert" x={96} y={312} size={26} on /></Float>
        </Rise>
        <Signal d="M300 296 H372" />
        <Node id={id} x={382} y={296} r={8} on />
        {/* 2 ranked hypotheses, each with its evidence and a confidence track */}
        {ys.map((y, i) => (
          <Rise key={y} i={i + 1}>
            <Dash d={`M392 296 C 430 296, 432 ${y}, 470 ${y}`} color={i === 0 ? C.slate : C.line} flow={i === 0} />
            <rect x="480" y={y - 25} width="320" height="50" rx="14" fill={`url(#${id}-top)`} stroke={i === 0 ? C.ink : C.edge} strokeWidth={i === 0 ? 1.5 : 1.1} />
            <rect x="496" y={y + 34} width="288" height="4" rx="2" fill={C.pale} />
            <rect x="496" y={y + 34} width={288 * conf[i]} height="4" rx="2" fill={i === 0 ? C.ink : C.steel} className="igv-grow-x" />
            {icons[i].map((g, k) => (
              <g key={g + k}>
                <rect x={716 + k * 40} y={y - 16} width="32" height="32" rx="8" fill={`url(#${id}-token)`} stroke={C.edge} />
                <Glyph id={id} name={g} x={732 + k * 40} y={y + 9} size={18} token={false} width={1.6} />
              </g>
            ))}
            <Dash d={`M800 ${y} C 880 ${y}, 900 260, 958 260`} color={C.line} opacity={i === 0 ? 1 : 0.55} />
          </Rise>
        ))}
        {/* 3 the next check */}
        <Rise i={4}>
          <rect x="960" y="206" width="170" height="108" rx="16" fill={`url(#${id}-top)`} stroke={C.edge} />
          {[0, 1].map((k) => (
            <g key={k}><circle cx="984" cy={262 + k * 26} r="7" fill="none" stroke={C.steel} strokeWidth="1.4" />
              <rect x="998" y={258 + k * 26} width={k ? 70 : 100} height="8" rx="4" fill={C.pale} /></g>
          ))}
        </Rise>
        {/* 4 the operator decides */}
        <Dash d="M1045 314 V398" color={C.slate} dash="3 5" flow />
        <Rise i={5}>
          <circle cx="1045" cy="440" r="36" fill={`url(#${id}-tokenOn)`} stroke={C.ink} />
          <path d="M1029 441 L1041 453 L1063 428" fill="none" stroke={C.pale} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </Rise>
        <Traveller d={path} dur={8} r={4} />
      </>
    ),
    labels: [
      { t: 'Alert from Lite', x: 50, y: 216, k: 'small', align: 'left' },
      { t: 'TSS drifting in the effluent', x: 130, y: 296, k: 'q', w: 160, on: true },
      { t: 'Most likely', x: 500, y: 150, k: 'plain', align: 'left' },
      { t: 'Possible', x: 500, y: 300, k: 'plain', align: 'left' },
      { t: 'Less likely', x: 500, y: 450, k: 'plain', align: 'left' },
      { t: 'Evidence', x: 716, y: 106, k: 'small', align: 'left' },
      { t: 'Next check', x: 974, y: 230, k: 'small', align: 'left' },
      { t: 'Operator decides', x: 1045, y: 512, k: 'tag' },
    ],
  };
}

/* ---------------------------------------------------------------- Field: a guided round in glasses */
function fieldAct() {
  const id = 'fa'; const ox = 600; const oy = 120; const P = iso(ox, oy);
  const T = [[180, 560], [420, 470], [670, 380], [920, 290]];
  const grid = [];
  for (let i = -6; i <= 14; i++) {
    const a = P(i * 70, -200); const b = P(i * 70, 900); grid.push(`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`);
    const c = P(-200, i * 70); const d = P(900, i * 70); grid.push(`M${c[0]} ${c[1]}L${d[0]} ${d[1]}`);
  }
  const route = poly([...T, [1080, 210]]);
  return {
    vb: [1200, 700],
    svg: (
      <>
        <Defs id={id} />
        <defs>
          <radialGradient id="fa-fade" cx="0.5" cy="0.62" r="0.62"><stop offset="0.35" stopColor="#fff" stopOpacity="1" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
          <mask id="fa-mask"><rect width="1200" height="700" fill="url(#fa-fade)" /></mask>
        </defs>
        <g mask="url(#fa-mask)"><path d={grid.join('')} stroke={C.pale} strokeWidth="1" opacity="0.8" /></g>
        <Dash d={route} flow color={C.steel} width={1.6} dash="5 8" />
        {T.map(([X, Y], i) => (
          <Rise key={i} i={i}>
            <Tile P={P} id={id} ox={ox} oy={oy} X={X} Y={Y} w={118} on={i === 2} />
            {i !== 2 && <Glyph id={id} name={['pin', 'engineer', '', 'doc'][i]} x={X} y={Y - 16} size={28} />}
          </Rise>
        ))}
        {/* the gauge, standing on the focal tile */}
        <Rise i={2}>
          <g transform="translate(670 300)">
            <line x1="0" y1="66" x2="0" y2="42" stroke={C.ink} strokeWidth="3" />
            <circle r="42" fill={`url(#${id}-top)`} stroke={C.ink} strokeWidth="2.2" />
            {Array.from({ length: 9 }, (_, k) => { const a = (-210 + k * 30) * (Math.PI / 180); return <line key={k} x1={Math.cos(a) * 27} y1={Math.sin(a) * 27} x2={Math.cos(a) * 34} y2={Math.sin(a) * 34} stroke={C.steel} strokeWidth="1.4" />; })}
            <g className="igv-needle"><line x1="0" y1="0" x2="18" y2="-20" stroke={C.ink} strokeWidth="2.6" strokeLinecap="round" /></g>
            <circle r="4" fill={C.ink} />
          </g>
        </Rise>
        {/* the glasses, and what they show: the reading captured */}
        <Rise i={4}>
          <Float>
            <g transform="translate(670 96)" strokeLinejoin="round">
              <path d="M-100 -12 H-14 Q-10 22 -42 28 H-72 Q-100 26 -100 -12 Z" fill={`url(#${id}-top)`} fillOpacity="0.9" stroke={C.ink} strokeWidth="2" />
              <path d="M100 -12 H14 Q10 22 42 28 H72 Q100 26 100 -12 Z" fill={`url(#${id}-top)`} fillOpacity="0.9" stroke={C.ink} strokeWidth="2" />
              <path d="M-14 -6 Q0 -14 14 -6 M-100 -12 L-122 -20 M100 -12 L122 -20" fill="none" stroke={C.ink} strokeWidth="2" />
              <rect x="22" y="-4" width="52" height="16" rx="4" fill={C.ink} opacity="0.85" />
            </g>
          </Float>
          <Dash d="M670 128 V252" color={C.ink} dash="2 5" flow />
          <rect x="430" y="194" width="176" height="64" rx="14" fill={`url(#${id}-topOn)`} stroke={C.ink} />
          <circle cx="580" cy="226" r="12" fill="none" stroke={C.pale} strokeWidth="1.4" />
          <path d="M574 226 L579 231 L587 221" fill="none" stroke={C.pale} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <Dash d="M606 236 L628 286" color={C.ink} dash="2 4" />
        </Rise>
        {/* the shift record */}
        <Rise i={5}>
          <Tile P={P} id={id} ox={ox} oy={oy} X={1080} Y={210} w={78} h={10} />
          <Glyph id={id} name="book" x={1080} y={196} size={24} />
        </Rise>
        <Traveller d={route} dur={9} r={4.5} />
      </>
    ),
    labels: [
      { t: 'Go to Pump P-2', x: 180, y: 640, k: 'tag' },
      { t: 'Check coupling', x: 420, y: 550, k: 'tag' },
      { t: 'Read the gauge', x: 670, y: 460, k: 'tag' },
      { t: 'Complete the checklist', x: 920, y: 370, k: 'tag' },
      { t: '4.2 bar', x: 498, y: 226, k: 'value', on: true },
      { t: 'In view, hands free', x: 670, y: 40, k: 'small' },
      { t: 'Shift record', x: 1080, y: 262, k: 'tag' },
    ],
  };
}

/* ---------------------------------------------------------------- Memory: what the plant keeps */
function shiftMemory() {
  const id = 'sm'; const P = iso(250, 330);
  const discs = [[560, 430], [700, 404], [840, 374], [980, 340], [1120, 300]];
  const r = rng(3);
  const drops = Array.from({ length: 6 }, (_, i) => [196 + i * 22 + r() * 8, 40 + r() * 40]);
  const chain = `M386 338 C 440 380, 480 430, 524 430 L${discs.map((d) => d.join(' ')).join(' L')}`;
  return {
    vb: [1240, 500],
    svg: (
      <>
        <Defs id={id} />
        <Mist id={id} cx={620} cy={320} rx={620} ry={240} />
        <circle cx="735" cy="250" r="128" fill="none" stroke={C.mist} strokeWidth="1" strokeDasharray="2 7" />
        <circle cx="1060" cy="220" r="128" fill="none" stroke={C.mist} strokeWidth="1" strokeDasharray="2 7" />
        <g stroke={C.steel} strokeWidth="1.5" fill="none" strokeLinecap="round">
          <circle cx="735" cy="186" r="13" />
          {Array.from({ length: 8 }, (_, k) => { const a = (k * Math.PI) / 4; return <line key={k} x1={735 + Math.cos(a) * 20} y1={186 + Math.sin(a) * 20} x2={735 + Math.cos(a) * 27} y2={186 + Math.sin(a) * 27} />; })}
          <path d="M1068 168 A 20 20 0 1 0 1078 198 A 15 15 0 1 1 1068 168 Z" />
        </g>
        {drops.map(([x, y], i) => (
          <g key={i} className="igv-drip" style={{ '--d': `${i * 0.5}s` }}><Dash d={`M${x} ${y + 8} V${y + 70}`} color={C.mist} dash="2 5" /><circle cx={x} cy={y} r="4.5" fill={`url(#${id}-node)`} stroke={C.silver} /></g>
        ))}
        <Rise i={0}><Float><Block P={P} id={id} x={-70} y={-70} w={140} d={140} z={0} h={150} on layers={8} /></Float></Rise>
        <Dash d={chain} color={C.line} dash="3 6" />
        {discs.map(([x, y], i) => (
          <Rise key={i} i={i + 1}>
            <IsoRing cx={x} cy={y + 9} r={30} fill={C.ink} opacity="0.1" filter={`url(#${id}-shadow)`} />
            <IsoRing cx={x} cy={y + 6} r={28} fill={`url(#${id}-sideR${i === 4 ? 'On' : ''})`} stroke={i === 4 ? C.ink : C.edge} />
            <IsoRing cx={x} cy={y} r={28} fill={`url(#${id}-top${i === 4 ? 'On' : ''})`} stroke={i === 4 ? C.ink : C.edge} strokeWidth="1.2" />
            <circle cx={x} cy={y} r="3.5" fill={i === 4 ? C.pale : C.steel} />
          </Rise>
        ))}
        <Traveller d={chain} dur={7} r={4} />
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
const Factory = ({ id, x, y }) => (
  <g transform={`translate(${x - 26} ${y - 46})`} fill={`url(#${id}-top)`} stroke={C.ink2} strokeWidth="1.5" strokeLinejoin="round">
    <path d="M0 46 V20 L14 28 V20 L28 28 V20 L40 28 V4 H50 V46 Z" />
    <path d="M8 36 H14 M22 36 H28 M34 36 H40" fill="none" />
  </g>
);
const Ring = ({ x, y, v, alert }) => (
  <g>
    <circle cx={x} cy={y} r="15" fill="#FFFFFF" stroke={C.pale} strokeWidth="4" />
    <circle cx={x} cy={y} r="15" fill="none" stroke={alert ? C.silver : C.ink} strokeWidth="4" pathLength="100" strokeDasharray={`${v} 100`} transform={`rotate(-90 ${x} ${y})`} strokeLinecap="round" className="igv-grow" style={{ '--g': v }} />
  </g>
);

/* ---------------------------------------------------------------- Stewardship: brand to suppliers */
function stewardship() {
  const id = 'st'; const ox = 650; const oy = 40; const P = iso(ox, oy);
  const F = [170, 410, 650, 890, 1130];
  const v = [90, 72, 86, 38, 78];
  const dots = [];
  for (let i = 0; i < WORLD_DOTS.length; i += 4) {
    const x = WORLD_DOTS[i] / 1000; const y = WORLD_DOTS[i + 1] / 1000;
    dots.push(<circle key={i} cx={60 + x * 1180} cy={130 + y * 400} r="2.4" fill={C.mist} opacity="0.5" />);
  }
  const lines = F.map((x) => `M650 214 C 650 300, ${x} 300, ${x} 392`);
  return {
    vb: [1300, 640],
    svg: (
      <>
        <Defs id={id} />
        {dots}
        {lines.map((d, i) => <Dash key={i} d={d} color={i === 3 ? C.slate : C.line} flow={i === 3} />)}
        <Rise i={0}><Float>
          <Tile P={P} id={id} ox={ox} oy={oy} X={650} Y={160} w={150} h={20} on />
          <g transform="translate(626 104)" fill="none" stroke={C.pale} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
            <path d="M4 18 H44 L41 52 H7 Z" /><path d="M15 18 V12 A9 9 0 0 1 33 12 V18" />
          </g>
        </Float></Rise>
        {F.map((x, i) => (
          <Rise key={x} i={i + 1}>
            <Tile P={P} id={id} ox={ox} oy={oy} X={x} Y={520} w={118} />
            <Factory id={id} x={x - 8} y={512} />
            <Ring x={x + 62} y={474} v={v[i]} alert={i === 3} />
            {i === 2
              ? <g transform={`translate(${x} 420)`} fill="none" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round"><path d="M-14 -4 A14 14 0 0 1 12 -8 M14 4 A14 14 0 0 1 -12 8" /><path d="M8 -14 L12 -8 L5 -5 M-8 14 L-12 8 L-5 5" /></g>
              : <Glyph id={id} name="drop" x={x} y={432} size={18} />}
          </Rise>
        ))}
        {lines.map((d, i) => (i % 2 === 0 ? <Traveller key={i} d={d} dur={4.5} delay={-i} r={3.5} /> : null))}
      </>
    ),
    labels: [
      { t: 'Brand', x: 650, y: 250, k: 'tag' },
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
  const arc = (x, y) => `M${cx} ${cy} Q ${(cx + x) / 2} ${Math.min(cy, y) - 70} ${x} ${y}`;
  return {
    vb: [W, H],
    svg: (
      <>
        <Defs id={id} />
        <Mist id={id} cx={cx} cy={cy} rx={560} ry={330} />
        {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.5" fill={C.mist} opacity="0.75" />)}
        {sites.map(([x, y], i) => <path key={`a${i}`} d={arc(x, y)} fill="none" stroke={flag.includes(i) ? C.slate : C.line} strokeWidth="1" strokeDasharray="3 6" opacity={flag.includes(i) ? 0.9 : 0.5} />)}
        {sites.map(([x, y], i) => (flag.includes(i)
          ? <Rise key={i} i={flag.indexOf(i) + 1}><IsoRing cx={x} cy={y} r={18} fill="none" stroke={C.ink} strokeWidth="1.3" /><line x1={x} y1={y} x2={x} y2={y - 52} stroke={C.ink} strokeWidth="2" /><Node id={id} x={x} y={y - 56} r={7} on /></Rise>
          : <Node key={i} id={id} x={x} y={y} r={4.5} />))}
        <Node id={id} x={cx} y={cy} r={10} on />
        {flag.map((s, i) => <Traveller key={s} d={arc(sites[s][0], sites[s][1])} dur={4} delay={-i * 1.3} r={3.5} />)}
        {/* the decision card: light glass, the place to act first in ink */}
        <Rise i={4}>
          <rect x="1016" y="78" width="250" height="200" rx="18" fill={C.ink} opacity="0.08" filter={`url(#${id}-shadow)`} />
          <rect x="1010" y="70" width="250" height="200" rx="18" fill={`url(#${id}-top)`} stroke={C.edge} strokeWidth="1.2" />
          <path d="M1040 240 H1236 M1040 240 V96" stroke={C.line} strokeWidth="1.2" fill="none" />
          <rect x="1140" y="100" width="90" height="70" rx="8" fill={`url(#${id}-topOn)`} stroke={C.ink} />
          {[[1060, 210], [1090, 190], [1112, 222], [1070, 150], [1120, 120]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill={C.silver} />)}
          {[[1160, 124], [1190, 116], [1206, 148]].map(([x, y], i) => <circle key={`h${i}`} cx={x} cy={y} r="5.5" fill={C.pale} />)}
        </Rise>
      </>
    ),
    labels: [
      ...flag.map((s) => ({ t: `Site ${s}`, x: sites[s][0], y: sites[s][1] - 86, k: 'tag' })),
      { t: 'Invest first', x: 1185, y: 160, k: 'small', on: true },
      { t: 'Value of acting', x: 1024, y: 168, k: 'axis' },
      { t: 'Operational risk', x: 1138, y: 256, k: 'small' },
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
    lines.push(<path key={k} d={d} fill="none" stroke={C.silver} strokeWidth="1" strokeDasharray="1 7" strokeLinecap="round" opacity={0.3 + k * 0.03} />);
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
          <linearGradient id="ed-river" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor={C.steel} /><stop offset="1" stopColor={C.ink} /></linearGradient>
          <radialGradient id="ed-dawn2" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#EAF0F0" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" /></radialGradient>
          <linearGradient id="ed-fadeG" x1="0" y1="0" x2="1" y2="0"><stop offset="0.36" stopColor="#fff" stopOpacity="0" /><stop offset="0.62" stopColor="#fff" stopOpacity="1" /></linearGradient>
          <mask id="ed-fade"><rect width={W} height={H} fill="url(#ed-fadeG)" /></mask>
        </defs>
        <ellipse cx="1240" cy="200" rx="520" ry="260" fill="url(#ed-dawn2)" />
        <g mask="url(#ed-fade)">{lines}</g>
        <path d={river} fill="none" stroke={C.silver} strokeWidth="24" strokeLinecap="round" opacity="0.18" />
        <path d={river} fill="none" stroke="url(#ed-river)" strokeWidth="8" strokeLinecap="round" />
        <path d={river} fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="10 14" className="igv-flow" opacity="0.9" />
        <Rise i={0}>
          <Slab P={P} id={id} x={-20} y={60} w={150} d={110} h={6} />
          {[[10, 90], [70, 90], [40, 140]].map(([a, b], i) => { const [X, Y] = P(a, b, 6); return (
            <g key={i}><IsoRing cx={X} cy={Y - 6} r={18} fill={`url(#${id}-sideR)`} stroke={C.edge} /><IsoRing cx={X} cy={Y - 12} r={18} fill={`url(#${id}-top)`} stroke={C.ink2} strokeWidth="1.2" /></g>); })}
        </Rise>
        {towns.map(([x, y], i) => <Node key={i} id={id} x={x} y={y} r={i % 3 === 0 ? 6 : 4} on={i === 4} />)}
        <Rise i={2}><Float>
          <g transform="translate(1270 150)">
            <circle r="90" fill="none" stroke={C.mist} strokeDasharray="2 7" />
            <circle r="64" fill="none" stroke={C.edge} strokeDasharray="2 6" />
            <path d="M0 -44 C 18 -18, 30 0, 30 16 A30 30 0 0 1 -30 16 C -30 0, -18 -18, 0 -44 Z" fill={`url(#${id}-topOn)`} stroke={C.ink} strokeWidth="1.4" />
            <path d="M-12 14 A14 14 0 0 0 0 28" fill="none" stroke={C.pale} strokeWidth="3" strokeLinecap="round" />
          </g>
        </Float></Rise>
        <Dash d="M1270 242 V330" color={C.slate} dash="2 5" flow />
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
  const loop = `M${cx} ${cy - ry} A${rx} ${ry} 0 1 1 ${cx} ${cy + ry} A${rx} ${ry} 0 1 1 ${cx} ${cy - ry}`;
  return {
    vb: [1300, 600],
    svg: (
      <>
        <Defs id={id} />
        <Mist id={id} cx={cx} cy={cy} rx={620} ry={300} />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={C.pale} strokeWidth="6" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={C.steel} strokeWidth="1.4" strokeDasharray="5 9" className="igv-flow" />
        {pos.map(([X, Y], i) => (
          <Rise key={i} i={i}>
            <Tile P={P} id={id} ox={ox} oy={oy} X={X} Y={Y - 14} w={120} h={16} on={i === 0} />
            <Glyph id={id} name={names[i]} x={X} y={Y - 36} size={30} on={i === 0} />
          </Rise>
        ))}
        <Traveller d={loop} dur={14} r={5} />
      </>
    ),
    labels: pos.map(([X, Y], i) => ({ t: `${String(i + 1).padStart(2, '0')}  ${labels[i]}`, x: X, y: Y + 66, k: 'tag' })),
  };
}

/* ---------------------------------------------------------------- Platform: onboarding in weeks */
function onboarding() {
  const id = 'ob'; const ox = 650; const oy = -200; const P = iso(ox, oy);
  const T = [[190, 410], [500, 340], [810, 270], [1110, 200]];
  const line = poly(T.map(([X, Y]) => [X, Y + 40]));
  return {
    vb: [1300, 560],
    svg: (
      <>
        <Defs id={id} />
        <Mist id={id} cx={650} cy={320} rx={640} ry={250} />
        <Signal d={line} width={1.5} />
        {T.map(([X, Y], i) => (
          <Rise key={i} i={i}>
            {i < 3 && <Tile P={P} id={id} ox={ox} oy={oy} X={X} Y={Y} w={150} h={18} on={i === 2} />}
            {i < 3 && <Glyph id={id} name={['send', 'engineer', 'doc'][i]} x={X} y={Y - 18} size={30} on={i === 2} />}
            {i === 3 && (
              <g>
                <Tile P={P} id={id} ox={ox} oy={oy} X={X} Y={Y} w={150} h={18} />
                <Float>
                  <Tile P={P} id={id} ox={ox} oy={oy} X={X} Y={Y - 40} w={96} h={14} />
                  <Tile P={P} id={id} ox={ox} oy={oy} X={X} Y={Y - 74} w={64} h={12} />
                  <Glyph id={id} name="plus" x={X} y={Y - 84} size={18} token={false} width={1.8} />
                </Float>
              </g>
            )}
          </Rise>
        ))}
        <Traveller d={line} dur={6} r={4.5} />
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
    dots.push(<circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="3.6" fill={C.mist} opacity="0.85" />);
  }
  const a = M(0.1302, 0.2425); const b = M(0.7126, 0.493);
  const arc = `M${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2} ${y0 - 60} ${b[0]} ${b[1]}`;
  return {
    vb: [W, Math.round(y0 * 2 + h)],
    svg: (
      <>
        <Defs id={id} />
        {dots}
        <path d={arc} fill="none" stroke={C.silver} strokeWidth="6" opacity="0.2" />
        <path d={arc} fill="none" stroke={C.slate} strokeWidth="1.8" strokeDasharray="6 8" className="igv-flow" />
        <Traveller d={arc} dur={6} r={5} />
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
  'pulse-understand': { make: pulseUnderstand, alt: 'Diagram: an alert about drifting suspended solids starts a guided investigation: three ranked hypotheses, each with its evidence and confidence, lead to the next check, and the operator decides' },
  'field-act': { make: fieldAct, alt: 'Diagram: a guided round seen through smart glasses: Pump P-2, a coupling check, a gauge reading of 4.2 bar captured hands free, a checklist and the shift record' },
  'shift-memory': { make: shiftMemory, alt: 'Diagram: a layered store of plant knowledge passes what each shift learns from the day shift to the night shift' },
  stewardship: { make: stewardship, alt: 'Diagram: one brand connected to five supplier factories, each with a water status ring; one reuses its water and one needs attention' },
  portfolio: { make: portfolio, alt: 'Diagram: many sites on one map connected to a centre, three flagged, with a chart showing where to invest first' },
  'every-drop': { make: everyDrop, alt: '' },
  'five-step-loop': { make: fiveStepLoop, alt: 'Diagram: five steps on one loop: data, understand, reason, act and learn' },
  'onboarding-timeline': { make: onboarding, alt: 'Diagram: four rising steps: send your exports in week one, configure with your team in weeks two to three, go live with a daily read, then add Pulse and Field' },
  'us-india': { make: usIndia, alt: 'Map: a line joins Portland, Oregon to Puducherry, India' },
};
