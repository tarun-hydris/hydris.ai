import Icon from '../ui/Icon.jsx';
import { reduced, sleep, useLoop, useMotionOff } from '../../lib/hooks.js';
import { Check, settle, usePhase } from './reason-parts.jsx';
import '../../styles/viz/reason.css';

/* 03 Reason: the alarm shows at the equipment; Hydris traces it backwards, through the
   biology, to the upstream feed change where it began. Causality points right, the trace
   travels left. A time axis underneath shows how far back the cause sits. Decorative. */

const NODES = [
  { k: 'Upstream', t: 'Feed change', icon: 'drop' },
  { k: 'Biology', t: 'Settling slows', icon: 'layers' },
  { k: 'Equipment', t: 'Alarm fires', icon: 'alert' },
];

/* Time axis: scaled so 18:40 sits under Upstream and 02:14 under Equipment */
const CAUSE = 18 * 60 + 40;
const ALARM = 26 * 60 + 14;
const SPAN = (ALARM - CAUSE) / (4 / 6);
const T0 = CAUSE - SPAN / 6;
const tx = (m) => ((m - T0) / SPAN) * 100;
const HOURS = Array.from({ length: 12 }, (_, i) => tx((17 + i) * 60)).filter((p) => p > 0.5 && p < 99.5);

const TRAVEL = 900;

/* Phases: 0 alarm, 1 travel to biology, 2 biology lit, 3 travel to upstream,
   4 origin found, 5 fade, 6 snap back (transitions off) */
export function Trace({ active }) {
  useMotionOff(); // re-render when Pause motion or the system setting changes
  const [ph, go, phRef] = usePhase(0);

  useLoop(active, async (alive) => {
    if (!(await settle(phRef, go, alive, 5, 6))) return;
    await sleep(1300);
    if (!alive()) return;
    go(1);
    await sleep(TRAVEL);
    if (!alive()) return;
    go(2);
    await sleep(520);
    if (!alive()) return;
    go(3);
    await sleep(TRAVEL);
    if (!alive()) return;
    go(4);
    await sleep(3700);
    if (!alive()) return;
    await settle(phRef, go, alive, 5, 6, 650);
  });

  const k = reduced ? 4 : ph;
  const found = k === 4;
  const bio = k >= 2 && k <= 4;
  const segB = k >= 1 && k <= 5;
  const segA = k >= 3 && k <= 5;
  const at = k >= 3 && k <= 5 ? 2 : k === 1 || k === 2 ? 1 : 0;
  const comet = !reduced && k >= 1 && k <= 3;

  const node = (i) => {
    if (i === 0) return found ? 'is-hit is-origin is-tagged is-ripple' : '';
    if (i === 1) return bio ? 'is-hit is-ripple' : '';
    return `is-tagged ${found ? 'is-hit is-quiet' : 'is-alarm'}`;
  };

  return (
    <div className={`vz-rsn vz-trace ${active ? 'is-active' : ''} ${found ? 'is-found' : ''} ${k === 5 ? 'is-fade' : ''} ${k === 6 ? 'is-snap' : ''}`} aria-hidden="true">
      <div className="vz-rsn__head">
        <b className="vz-rsn__title">Why is this happening?</b>
        <span className={`vz-rsn__meta vz-swap ${found ? 'is-b' : ''}`}>
          <span className="vz-trace__m"><i className="vz-rsn__live" />Tracing</span>
          <span className="vz-trace__m vz-trace__m--found">Source found</span>
        </span>
      </div>

      <div className="vz-trace__body">
        <div className="vz-trace__chain">
          <span className="vz-trace__line" />
          <svg className="vz-trace__chev" style={{ left: '33.333%' }} viewBox="0 0 7 9"><path d="M1.5 1l4 3.5-4 3.5" /></svg>
          <svg className="vz-trace__chev" style={{ left: '66.667%' }} viewBox="0 0 7 9"><path d="M1.5 1l4 3.5-4 3.5" /></svg>
          <span className={`vz-trace__seg vz-trace__seg--a ${segA ? 'is-on' : ''}`} />
          <span className={`vz-trace__seg vz-trace__seg--b ${segB ? 'is-on' : ''}`} />
          <span className={`vz-trace__cw at-${at} ${comet ? 'is-on' : ''}`}><i className="vz-trace__comet" /></span>
          {NODES.map((n, i) => (
            <div className={`vz-trace__node ${node(i)}`} key={n.k}>
              <span className="vz-trace__tag"><i />{i === 0 ? 'Origin' : i === 2 ? 'Alarm' : ''}</span>
              <span className="vz-trace__tile"><Icon name={n.icon} /></span>
              <span className="vz-trace__k">{n.k}</span>
              <b className="vz-trace__t">{n.t}</b>
            </div>
          ))}
        </div>

        <div className="vz-trace__time">
          <span className="vz-trace__axis" />
          {HOURS.map((p) => <span className="vz-trace__hr" key={p} style={{ left: `${p}%` }} />)}
          <span className={`vz-trace__gap ${found ? 'is-on' : ''}`} />
          <span className="vz-trace__ev vz-trace__ev--origin" style={{ left: `${tx(CAUSE)}%` }} />
          <span className="vz-trace__ev" style={{ left: `${tx(ALARM)}%` }} />
          <span className="vz-trace__tl vz-trace__tl--origin" style={{ left: `${tx(CAUSE)}%` }}>18:40</span>
          <span className="vz-trace__tl vz-trace__tl--mid" style={{ left: `${tx(24 * 60)}%` }}>00:00</span>
          <span className="vz-trace__tl vz-trace__tl--key" style={{ left: `${tx(ALARM)}%` }}>02:14</span>
        </div>
      </div>

      <div className={`vz-swap vz-trace__cap ${found ? 'is-b is-in' : ''}`}>
        <span className="vz-trace__c"><i className="vz-trace__alarmdot" />The alarm shows up at the equipment</span>
        <span className="vz-trace__c vz-trace__c--found"><Check />Traced to the 18:40 feed change</span>
      </div>

      <div className="vz-rsn__foot">
        <span>Illustrative</span>
        <span>Traced right to left</span>
      </div>
    </div>
  );
}
