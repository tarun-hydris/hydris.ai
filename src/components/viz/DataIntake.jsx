import { useRef, useState } from 'react';
import { Mark } from '../ui/Brand.jsx';
import Icon from '../ui/Icon.jsx';
import { reduced, sleep, useLoop, useMotionOff } from '../../lib/hooks.js';
import { Roll } from './loop-parts.jsx';
import '../../styles/viz/loop.css';

/* 01 Data: every source lands in one place.
   Each source is read (a scan passes along its row), then sent: a packet travels its connector
   into the hub while the connector draws in behind it. On arrival the row ticks, the hub pulses,
   the counter rolls and one segment of the bar fills. Decorative (aria-hidden). */

const SOURCES = [
  ['stack', 'Control system history', 'Read only'],
  ['flask', 'Lab results', 'Imported'],
  ['grid', 'Spreadsheets', 'Parsed'],
  ['doc', 'Procedures', 'Indexed'],
  ['book', 'Shift logs', 'Linked'],
  ['eye', 'What the operator saw', 'Captured'],
];
const N = SOURCES.length;

/* Connector geometry, in pixels: fixed row height, so the wiring is drawn 1:1 */
const ROW = 42;
const WW = 116; // wiring column width
const WH = ROW * N; // wiring column height
const HUB = [84, WH / 2]; // hub centre
const HUB_R = 26; // hub radius (CSS: 52px circle)
const SEG_R = 31; // ring of six segments around the hub
const fx = (n) => Math.round(n * 100) / 100;
const rowY = (i) => ROW * i + ROW / 2;
const WIRES = SOURCES.map((_, i) => {
  const y = rowY(i);
  return `M2 ${y}C42 ${y} 46 ${HUB[1]} ${HUB[0]} ${HUB[1]}`;
});
const polar = (deg, r) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [fx(HUB[0] + r * Math.cos(a)), fx(HUB[1] + r * Math.sin(a))];
};
const SEGS = SOURCES.map((_, i) => {
  const [x0, y0] = polar(i * 60 + 7, SEG_R);
  const [x1, y1] = polar((i + 1) * 60 - 7, SEG_R);
  return `M${x0} ${y0}A${SEG_R} ${SEG_R} 0 0 1 ${x1} ${y1}`;
});

/* n     sources landed (0..6)
   live  source being read and sent (-1 for none)
   mode  run | reset */
const INIT = { n: 0, live: -1, mode: 'run' };
const FINAL = { n: N, live: -1, mode: 'run' };
const SEND = 950; // read plus travel, ms (CSS: scan 0.5s, then packet 0.62s from 0.33s)

export function DataIntake({ active }) {
  useMotionOff(); // re-render when Pause motion or the system setting changes
  const [st, setSt] = useState(INIT);
  const ref = useRef(INIT);
  const put = (patch) => { ref.current = { ...ref.current, ...patch }; setSt(ref.current); };

  useLoop(active, async (alive) => {
    const wait = async (ms) => { await sleep(ms); return alive(); };
    if (ref.current.n > 0 || ref.current.live >= 0) {
      // Clear the board: connectors fade, then rows and counter return to empty
      put({ mode: 'reset', live: -1 });
      if (!(await wait(520))) return;
      put({ n: 0 });
      if (!(await wait(420))) return;
      put({ mode: 'run' });
      if (!(await wait(300))) return;
    }
    for (let i = 0; i < N; i++) {
      put({ live: i });
      if (!(await wait(SEND))) return;
      put({ n: i + 1, live: -1 });
      if (!(await wait(i < N - 1 ? 220 : 2800))) return;
    }
  });

  const s = reduced ? FINAL : st;
  const { n, live, mode } = s;
  const full = n === N;
  const state = (i) => (i === live ? 'is-live' : i < n ? 'is-in' : '');

  return (
    <div className={`vz-lp vz-intake ${full ? 'is-full' : ''} ${mode === 'reset' ? 'is-resetting' : ''}`} aria-hidden="true">
      <div className="vz-lp__head">
        <b className="vz-lp__title">Plant data</b>
        <span className="vz-lp__meta"><Roll value={n} from={0} to={N} /> of {N} sources in one place</span>
      </div>

      <div className="vz-intake__body">
        <div className="vz-intake__rows">
          {SOURCES.map(([ic, t, sub], i) => (
            <div className={`vz-intake__row ${state(i)}`} key={t}>
              <span className="vz-intake__ico"><Icon name={ic} /></span>
              <span className="vz-intake__txt"><b>{t}</b><small>{sub}</small></span>
              <svg className="vz-intake__st" viewBox="0 0 18 18">
                <circle className="vz-intake__base" cx="9" cy="9" r="7.25" />
                <circle className="vz-intake__prog" cx="9" cy="9" r="7.25" pathLength="1" />
                <circle className="vz-intake__disc" cx="9" cy="9" r="8" />
                <path className="vz-intake__chk" d="M5.7 9.2l2.2 2.2 4.4-4.7" pathLength="1" />
              </svg>
            </div>
          ))}
        </div>

        <div className="vz-intake__wire">
          <svg viewBox={`0 0 ${WW} ${WH}`} width={WW} height={WH}>
            {WIRES.map((d, i) => (
              <g key={i} className={`vz-intake__w ${state(i)}`}>
                <path className="vz-intake__idle" d={d} />
                <path className="vz-intake__line" d={d} pathLength="1" />
                <circle className="vz-intake__port" cx="2" cy={rowY(i)} r="2" />
              </g>
            ))}
            {live >= 0 && !reduced && <path key={`k${live}`} className="vz-intake__pkt" d={WIRES[live]} pathLength="1" />}
            <g className="vz-intake__segs">
              {SEGS.map((d, i) => <path key={i} d={d} className={i < n ? 'is-on' : ''} />)}
            </g>
            <circle className="vz-intake__all" cx={HUB[0]} cy={HUB[1]} r={SEG_R} pathLength="1" />
          </svg>
          <span className="vz-intake__hub" style={{ left: HUB[0] - HUB_R, top: HUB[1] - HUB_R }}>
            <Mark className="vz-intake__mark" />
            {n > 0 && mode === 'run' && !reduced && <i key={`h${n}`} className="vz-intake__ping" />}
          </span>
        </div>
      </div>

      <div className="vz-intake__foot">
        <div className="vz-intake__bar">
          {SOURCES.map(([, t], i) => <i key={t} className={i < n ? 'is-on' : ''}><u /></i>)}
        </div>
      </div>
    </div>
  );
}
