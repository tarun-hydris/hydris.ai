import { useRef, useState } from 'react';
import { Mark } from '../ui/Brand.jsx';
import { reduced, sleep, useLoop, useMotionOff } from '../../lib/hooks.js';
import { Roll, useSvgId, useWidth } from './loop-parts.jsx';
import '../../styles/viz/loop.css';

/* 05 Learn: every decision goes once round the loop and leaves the plant knowing a little more.
   One beat drives everything: the point travels a quarter of the ring, the arc fills behind it,
   the node it reaches pulses, the list and its rail follow, and a completed lap adds one step
   to the chart. Decorative (aria-hidden): the copy beside the panel carries the meaning. */

const STAGES = ['Decided', 'Happened next', 'Goes back in', 'Sharper'];
const ROUNDS = 5;
const TRAVEL = 700; // one quarter of the ring, ms (shared with CSS as --vz-learn-travel)
const DWELL = 300; // rest on each node, so a stage reads as about one second

/* ---------- Ring geometry: a 128 unit box, 0 degrees at 12 o'clock, clockwise ---------- */
const C = 64;
const R = 44;
const fx = (n) => Math.round(n * 100) / 100;
const pt = (deg, r = R) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [fx(C + r * Math.cos(a)), fx(C + r * Math.sin(a))];
};
const arc = (a0, a1, cw = true) => {
  const [x0, y0] = pt(a0);
  const [x1, y1] = pt(a1);
  return `M${x0} ${y0}A${R} ${R} 0 0 ${cw ? 1 : 0} ${x1} ${y1}`;
};
const tickPath = (major) => {
  let d = '';
  for (let i = 0; i < 48; i++) {
    if ((i % 12 === 0) !== major) continue;
    const [x0, y0] = pt(i * 7.5, major ? 49 : 50.5);
    const [x1, y1] = pt(i * 7.5, major ? 55.5 : 53.5);
    d += `M${x0} ${y0}L${x1} ${y1}`;
  }
  return d;
};
const TICKS = tickPath(false);
const TICKS_MAJOR = tickPath(true);
const QUARTERS = [0, 1, 2, 3].map((k) => ({ d: arc(k * 90, (k + 1) * 90), a: pt(k * 90), b: pt((k + 1) * 90) }));
const TRAIL_DEG = 46;
const TRAIL = arc(0, -TRAIL_DEG, false); // drawn from the point backwards, so the gradient fades to the tail
const HEAD = pt(0);
const TAIL = pt(-TRAIL_DEG);
const LABELS = [0, 1, 2, 3].map((k) => pt(k * 90, 31));
const SLATE = [42, 65, 72];
const BLUE = [23, 70, 228];
const mix = (t) => `rgb(${SLATE.map((v, i) => Math.round(v + (BLUE[i] - v) * t)).join(', ')})`;

/* ---------- Growth chart geometry (pixels, drawn 1:1 at the measured width) ---------- */
const LEVELS = [0.22, 0.4, 0.54, 0.65, 0.74, 0.8]; // shape only: where the plant starts, and each round adding a step
const PH = 80; // svg height
const TOP = 8; // top of the plot
const BASE = 56; // x axis
const CAP_L = 62; // room for "At install"
const CAP_R = 42; // room for "Today"

/* ---------- Loop state ----------
   q      quarters of the ring drawn this lap (0..4), moves on departure
   stage  node the point has reached (0..3, 4 = back at the top), moves on arrival
   turns  quarter turns of the point since mount, so it always travels clockwise
   done   rounds completed, one chart step each
   mode   run | lap (lap just closed) | clear (between laps) | hold (after round 5) | reset */
const INIT = { round: 1, stage: 0, q: 0, turns: 0, done: 0, hits: 0, mode: 'run' };
const FINAL = { round: ROUNDS, stage: 4, q: 4, turns: 4, done: ROUNDS, hits: 0, mode: 'hold' };
const isFresh = (s) => s.mode === 'run' && s.done === 0 && s.q === 0 && s.stage === 0;

export function Learn({ active }) {
  useMotionOff(); // re-render when Pause motion or the system setting changes
  const id = useSvgId('vzl');
  const [st, setSt] = useState(INIT);
  const ref = useRef(INIT);
  const put = (patch) => { ref.current = { ...ref.current, ...patch }; setSt(ref.current); };

  useLoop(active, async (alive) => {
    const wait = async (ms) => { await sleep(ms); return alive(); };
    if (!isFresh(ref.current)) {
      // Back to the start: the chart fades out, the counter rolls down to 1, the point finishes its lap
      put({ mode: 'reset', round: 1, turns: Math.ceil(ref.current.turns / 4) * 4 });
      if (!(await wait(800))) return;
      put({ ...INIT, turns: ref.current.turns, hits: ref.current.hits });
      if (!(await wait(450))) return;
    }
    for (let r = 1; r <= ROUNDS; r++) {
      put({ round: r, stage: 0, q: 0, mode: 'run', hits: ref.current.hits + 1 });
      if (!(await wait(DWELL + 250))) return;
      for (let k = 1; k <= 4; k++) {
        put({ q: k, turns: ref.current.turns + 1 }); // depart: the point and the arc move together
        if (!(await wait(TRAVEL))) return;
        put(k < 4
          ? { stage: k, hits: ref.current.hits + 1 } // arrive: node pulses, list moves on
          : { stage: 4, hits: ref.current.hits + 1, done: r, mode: 'lap' }); // lap closed: one step on the chart
        if (!(await wait(k < 4 ? DWELL : 1200))) return;
      }
      if (r < ROUNDS) {
        put({ mode: 'clear' });
        if (!(await wait(380))) return;
      }
    }
    put({ mode: 'hold' });
    await wait(2600);
  });

  const s = reduced ? FINAL : st;
  const { mode, stage, q, turns, done, round, hits } = s;
  const quiet = mode === 'clear' || mode === 'reset';
  const reached = (k) => !quiet && (stage === 4 || stage >= k);
  const cur = !quiet && stage < 4 ? stage : -1;
  const past = (k) => !quiet && (stage === 4 || k < stage);
  const rail = quiet ? 0 : Math.min(1, (q + 0.5) / 4);

  return (
    <div className={`vz-lp vz-learn ${active && !reduced ? 'is-live' : ''}`} style={{ '--vz-learn-travel': `${TRAVEL}ms` }} aria-hidden="true">
      <div className="vz-lp__head">
        <b className="vz-lp__title">What the plant knows</b>
        <span className="vz-lp__meta">Round <Roll value={round} from={1} to={ROUNDS} /></span>
      </div>

      <div className="vz-learn__body">
        <div className="vz-learn__ring">
          <svg className="vz-learn__svg" viewBox="0 0 128 128">
            <defs>
              {QUARTERS.map((qq, j) => (
                <linearGradient key={j} id={`${id}q${j}`} gradientUnits="userSpaceOnUse" x1={qq.a[0]} y1={qq.a[1]} x2={qq.b[0]} y2={qq.b[1]}>
                  <stop offset="0" stopColor={mix(j / 4)} />
                  <stop offset="1" stopColor={mix((j + 1) / 4)} />
                </linearGradient>
              ))}
              <linearGradient id={`${id}t`} gradientUnits="userSpaceOnUse" x1={HEAD[0]} y1={HEAD[1]} x2={TAIL[0]} y2={TAIL[1]}>
                <stop offset="0" stopColor="#1746e4" stopOpacity="0.85" />
                <stop offset="1" stopColor="#1746e4" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className="vz-learn__ticks" d={TICKS} />
            <path className="vz-learn__ticks is-major" d={TICKS_MAJOR} />
            <circle className="vz-learn__inner" cx={C} cy={C} r="22" />
            <circle className="vz-learn__track" cx={C} cy={C} r={R} />
            <g className={`vz-learn__arc ${quiet ? 'is-off' : ''} ${q === 0 ? 'is-fresh' : ''}`}>
              {QUARTERS.map((qq, j) => (
                <path key={j} d={qq.d} pathLength="1" stroke={`url(#${id}q${j})`} className={j < q ? 'is-on' : ''} />
              ))}
            </g>
            {QUARTERS.map((qq, k) => (
              <g key={k} className={`vz-learn__node ${reached(k) ? 'is-on' : ''}`} style={{ '--c': mix(k / 4) }}>
                <circle cx={qq.a[0]} cy={qq.a[1]} r="3.25" />
                <text x={LABELS[k][0]} y={LABELS[k][1]}>{String(k + 1).padStart(2, '0')}</text>
              </g>
            ))}
            {hits > 0 && !reduced && (
              <g key={`p${hits}`} transform={`rotate(${(stage % 4) * 90} ${C} ${C})`}>
                <circle className="vz-learn__ping" cx={HEAD[0]} cy={HEAD[1]} r="3.25" />
              </g>
            )}
            <g className="vz-learn__orbit" style={{ transform: `rotate(${turns * 90}deg)` }}>
              {turns > 0 && !reduced && <path key={`t${turns}`} className="vz-learn__trail" d={TRAIL} stroke={`url(#${id}t)`} />}
              <circle className="vz-learn__glow" cx={HEAD[0]} cy={HEAD[1]} r="7" />
              <circle className="vz-learn__dot" cx={HEAD[0]} cy={HEAD[1]} r="3.75" />
            </g>
          </svg>
          <span className={`vz-learn__core ${mode === 'lap' ? 'is-lap' : ''}`}><Mark className="vz-learn__mark" /></span>
        </div>

        <div className="vz-learn__list">
          <span className="vz-learn__rail"><i style={{ transform: `scaleY(${rail})` }} /></span>
          <ol className="vz-learn__steps">
            {STAGES.map((t, k) => (
              <li key={t} className={k === cur ? 'is-on' : past(k) ? 'is-past' : ''}>
                <span className="vz-learn__cur" />
                <span className="vz-learn__idx">
                  <b>{String(k + 1).padStart(2, '0')}</b>
                  <svg viewBox="0 0 12 12"><path d="M2.2 6.4l2.5 2.5 5.1-5.4" pathLength="1" /></svg>
                </span>
                <span className="vz-learn__lbl">{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <Growth id={id} done={done} round={round} q={q} mode={mode} />
    </div>
  );
}

/* What the plant knows, round by round: a stepped line that rises once per completed lap.
   The band marks the round in progress and its top edge fills with the ring. */
function Growth({ id, done, round, q, mode }) {
  const [ref, w] = useWidth(380);
  const x0 = CAP_L;
  const x5 = Math.max(CAP_L + 120, w - CAP_R);
  const step = (x5 - x0) / ROUNDS;
  const xs = LEVELS.map((_, k) => fx(x0 + k * step));
  const ys = LEVELS.map((l) => fx(BASE - l * (BASE - TOP)));
  const band = mode !== 'hold' && mode !== 'reset';
  const rounds = [1, 2, 3, 4, 5];

  return (
    <div className="vz-learn__chart">
      <p className="vz-learn__cap"><span>Round by round</span><span>Illustrative</span></p>
      <div ref={ref} className="vz-learn__plotwrap">
        <svg className={`vz-learn__plot ${done === 0 ? 'is-snap' : ''} ${mode === 'reset' ? 'is-hidden' : ''}`} viewBox={`0 0 ${w} ${PH}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={`${id}a`} gradientUnits="userSpaceOnUse" x1="0" y1={TOP} x2="0" y2={BASE}>
              <stop offset="0" stopColor="#2a4148" stopOpacity="0.15" />
              <stop offset="1" stopColor="#2a4148" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <g className="vz-learn__grid">
            <line x1={x0} x2={x5} y1={TOP} y2={TOP} />
            <line x1={x0} x2={x5} y1={(TOP + BASE) / 2} y2={(TOP + BASE) / 2} />
          </g>
          <g className={`vz-learn__band ${band ? '' : 'is-off'}`} style={{ transform: `translateX(${xs[round - 1]}px)` }}>
            <rect className="vz-learn__win" x="0" y={TOP} width={fx(step)} height={BASE - TOP} />
            <rect className={`vz-learn__prog ${q === 0 ? 'is-fresh' : ''}`} x="0" y={TOP - 1} width={fx(step)} height="2" style={{ transform: `scaleX(${q / 4})` }} />
          </g>
          <line className="vz-learn__ref" x1={x0} x2={x5} y1={ys[0]} y2={ys[0]} />
          <g className="vz-learn__data">
            {rounds.map((k) => (
              <rect key={`a${k}`} className={`vz-learn__area ${k <= done ? 'is-on' : ''}`} x={xs[k - 1]} y={ys[k - 1]} width={fx(step)} height={fx(BASE - ys[k - 1])} fill={`url(#${id}a)`} />
            ))}
            {rounds.map((k) => {
              const cls = `${k <= done ? 'is-on' : ''} ${k === done ? 'is-new' : ''}`;
              return (
                <g key={`l${k}`}>
                  <path className={`vz-learn__h ${cls}`} d={`M${xs[k - 1]} ${ys[k - 1]}H${xs[k]}`} pathLength="1" />
                  <path className={`vz-learn__v ${cls}`} d={`M${xs[k]} ${fx(ys[k - 1] + 1)}V${ys[k]}`} pathLength="1" />
                </g>
              );
            })}
            <g className="vz-learn__hx" style={{ transform: `translateX(${xs[done]}px)` }}>
              <g className="vz-learn__hy" style={{ transform: `translateY(${ys[done]}px)` }}>
                <circle className="vz-learn__breath" r="8" />
                <circle className="vz-learn__head" r="3.5" />
              </g>
            </g>
          </g>
          <line className="vz-learn__axis" x1={x0} x2={x5} y1={BASE} y2={BASE} />
          <path className="vz-learn__xt" d={xs.map((x) => `M${x} ${BASE}v4`).join('')} />
          <text className="vz-learn__end" x={x0 - 8} y={BASE} textAnchor="end">At install</text>
          <text className={`vz-learn__end ${done === ROUNDS ? 'is-on' : ''}`} x={x5 + 8} y={BASE}>Today</text>
          {rounds.map((k) => (
            <text key={`x${k}`} className={`vz-learn__xl ${k === round && band ? 'is-on' : k <= done ? 'is-done' : ''}`} x={fx((xs[k - 1] + xs[k]) / 2)} y={BASE + 16}>R{k}</text>
          ))}
        </svg>
      </div>
    </div>
  );
}
