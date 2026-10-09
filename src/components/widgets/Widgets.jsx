import { useState } from 'react';
import { Mark } from '../ui/Brand.jsx';
import Icon from '../ui/Icon.jsx';
import { reduced, sleep, useInView, useLoop } from '../../lib/hooks.js';

/* Illustrative product moments for the five-step loop. Decorative (aria-hidden):
   the copy beside each one carries the meaning. Each widget loops only while `active`. */

const Tick = () => <span className="tick"><Icon name="check" /></span>;
const Spin = () => <span className="spin" />;

/* ---------- 01 Data: every source lands in one place ---------- */
const SOURCES = [
  ['stack', 'Control system history', 'Read only'],
  ['flask', 'Lab results', 'Imported'],
  ['grid', 'Spreadsheets', 'Parsed'],
  ['doc', 'Procedures', 'Indexed'],
  ['book', 'Shift logs', 'Linked'],
  ['eye', 'What the operator saw', 'Captured'],
];

export function DataIntake({ active }) {
  const [n, setN] = useState(0);
  useLoop(active, async (alive) => {
    for (let i = 1; i <= SOURCES.length; i++) {
      await sleep(700);
      if (!alive()) return;
      setN(i);
    }
    await sleep(2600);
    if (!alive()) return;
    setN(0);
    await sleep(600);
  });
  const k = reduced ? SOURCES.length : n;
  return (
    <div className="ui w-data" aria-hidden="true">
      <div className="ui__head"><b>Plant data</b><span className="ui__meta">{k} of {SOURCES.length} sources in one place</span></div>
      {SOURCES.map(([ic, t, s], i) => (
        <div className={`row w-data__row ${i < k ? 'is-in' : ''}`} key={t}>
          <span className="row__ico"><Icon name={ic} /></span>
          <span className="row__txt"><b>{t}</b><small>{s}</small></span>
          <span className="row__end">{i < k ? <Tick /> : i === k && active && !reduced ? <Spin /> : null}</span>
        </div>
      ))}
      <i className="w-data__bar" style={{ transform: `scaleX(${k / SOURCES.length})` }} />
    </div>
  );
}

/* ---------- 02 Understand: normal for this plant, not for a textbook ---------- */
const pos = (v) => `${((v - 5) / 4) * 100}%`;

export function Context({ active }) {
  const [odd, setOdd] = useState(false);
  useLoop(active, async (alive) => {
    await sleep(3000);
    if (!alive()) return;
    setOdd((o) => !o);
  });
  const v = odd ? 7.6 : 7.1;
  return (
    <div className="ui w-ctx" aria-hidden="true">
      <div className="ui__head"><b>pH reading</b><span className="ui__meta">Plant 01</span></div>
      <div className="w-ctx__body">
        <p className="w-ctx__val"><span>{v.toFixed(1)}</span><small className={odd ? 'is-odd' : ''}>{odd ? 'Unusual for this plant' : 'Normal for this plant'}</small></p>
        <div className="w-ctx__scale">
          <div className="w-ctx__lane">
            <span className="w-ctx__lbl">In a textbook</span>
            <span className="w-ctx__track"><i style={{ left: pos(6.5), width: '50%' }} /></span>
          </div>
          <div className="w-ctx__lane">
            <span className="w-ctx__lbl">In this plant</span>
            <span className="w-ctx__track"><i className="is-plant" style={{ left: pos(6.9), width: '10%' }} /></span>
          </div>
          <span className="w-ctx__pin" style={{ left: pos(v) }}><b /></span>
        </div>
        <div className="w-ctx__chips"><span>Plant layout</span><span>This week&apos;s product</span><span>Operating rules</span></div>
      </div>
    </div>
  );
}

/* ---------- 03 Reason: trace the alarm back to where it began ---------- */
const CHAIN = [['Upstream', 'Feed change'], ['Biology', 'Settling slows'], ['Equipment', 'Alarm fires']];

export function Trace({ active }) {
  const [s, setS] = useState(0);
  useLoop(active, async (alive) => {
    for (const next of [1, 2]) {
      await sleep(1200);
      if (!alive()) return;
      setS(next);
    }
    await sleep(2800);
    if (!alive()) return;
    setS(0);
    await sleep(500);
  });
  const k = reduced ? 2 : s;
  return (
    <div className="ui w-trace" aria-hidden="true">
      <div className="ui__head"><b>Why is this happening?</b><span className="ui__meta">{k === 2 ? 'Source found' : 'Tracing'}</span></div>
      <div className="w-trace__chain">
        {CHAIN.map(([a, b], i) => {
          const hit = i === 2 || (i === 1 && k >= 1) || (i === 0 && k >= 2);
          return (
            <div className={`w-trace__node ${hit ? 'is-hit' : ''} ${i === 0 && k >= 2 ? 'is-origin' : ''} ${i === 2 ? 'is-alarm' : ''}`} key={a}>
              <span className="w-trace__dot" />
              <b>{a}</b>
              <small>{b}</small>
            </div>
          );
        })}
        <span className="w-trace__line"><i style={{ transform: `scaleX(${k / 2})` }} /></span>
      </div>
      <p className="w-trace__cap">{k === 2 ? 'Traced to the 18:40 feed change' : 'The alarm shows up at the equipment'}</p>
    </div>
  );
}

/* ---------- 04 Act: a recommendation with its reasoning, in the operator's hands ---------- */
export function Recommend({ active }) {
  const [p, setP] = useState(0);
  useLoop(active, async (alive) => {
    for (const next of [1, 2, 3]) {
      await sleep(next === 1 ? 900 : 1500);
      if (!alive()) return;
      setP(next);
    }
    await sleep(3000);
    if (!alive()) return;
    setP(0);
    await sleep(600);
  });
  const k = reduced ? 3 : p;
  return (
    <div className="ui w-act" aria-hidden="true">
      <div className="ui__head"><span className="w-act__who"><Mark className="w-act__mark" /><b>Hydris</b></span><span className="ui__meta">02:14</span></div>
      <p className="w-act__rec">Check the return rate before touching the blowers.</p>
      <ul className={`w-act__why ${k >= 1 ? 'is-in' : ''}`}>
        <li style={{ '--i': 0 }}><Icon name="check" />Same pattern preceded a settling problem on 14 March</li>
        <li style={{ '--i': 1 }}><Icon name="check" />The fix then was to reduce, not increase</li>
      </ul>
      <div className="w-act__foot">
        <span className={`ui__btn ${k >= 2 ? 'is-press' : ''}`}>Agree</span>
        <span className="ui__btn ui__btn--ghost">Overrule</span>
        <span className={`w-act__done ${k >= 3 ? 'is-in' : ''}`}><Tick />Decided by the operator</span>
      </div>
    </div>
  );
}

/* ---------- 05 Learn: every decision sharpens the plant ---------- */
const LOOP_STAGES = ['Decided', 'Happened next', 'Goes back in', 'Sharper'];

export function Learn({ active }) {
  const [i, setI] = useState(0);
  const [lap, setLap] = useState(0);
  const [turn, setTurn] = useState(0);
  useLoop(active, async (alive) => {
    for (let k = 1; k <= LOOP_STAGES.length; k++) {
      await sleep(1000);
      if (!alive()) return;
      setTurn((t) => t + 1);
      if (k === LOOP_STAGES.length) { setLap((l) => Math.min(l + 1, 4)); setI(0); } else setI(k);
    }
  });
  const level = reduced ? 0.9 : 0.34 + lap * 0.14 + (i / LOOP_STAGES.length) * 0.14;
  return (
    <div className="ui w-learn" aria-hidden="true">
      <div className="ui__head"><b>What the plant knows</b><span className="ui__meta">Round {lap + 1}</span></div>
      <div className="w-learn__body">
        <div className="w-learn__ring">
          <svg className="w-learn__circle" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" /></svg>
          <span className="w-learn__orbit" style={{ transform: `rotate(${turn * (360 / LOOP_STAGES.length)}deg)` }}><i /></span>
          <Mark className="w-learn__mark" />
        </div>
        <ol className="w-learn__steps">
          {LOOP_STAGES.map((t, k) => <li key={t} className={k === i ? 'is-on' : k < i ? 'is-past' : ''}><span>{String(k + 1).padStart(2, '0')}</span>{t}</li>)}
        </ol>
      </div>
      <div className="w-learn__meter"><span>At install</span><i><u style={{ transform: `scaleX(${Math.min(level, 1)})` }} /></i><span>Today</span></div>
    </div>
  );
}

/* ---------- Platform: the days between the cause and the alarm ---------- */
const DAYS = ['D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'D0'];
const ROWS = [['Upstream', 0], ['Biology', 2], ['Equipment', 3], ['Alarm', 5]];

export function Days({ active }) {
  const [t, setT] = useState(0);
  useLoop(active, async (alive) => {
    for (let x = 1; x <= 5; x++) {
      await sleep(750);
      if (!alive()) return;
      setT(x);
    }
    await sleep(1100);
    if (!alive()) return;
    setT(6);
    await sleep(3600);
    if (!alive()) return;
    setT(0);
    await sleep(500);
  });
  const k = reduced ? 6 : t;
  return (
    <div className="ui w-days" aria-hidden="true">
      <div className="ui__head"><b>One cause, five days</b><span className="ui__meta">Illustrative</span></div>
      <div className="w-days__grid">
        <span />
        {DAYS.map((d) => <span className="w-days__d" key={d}>{d}</span>)}
        {ROWS.map(([name, start]) => (
          <div className="w-days__row" key={name}>
            <span className="w-days__n">{name}</span>
            {DAYS.map((d, c) => {
              const lit = c >= start && c <= Math.min(k, 5) && (name !== 'Alarm' || c === 5);
              return <span className={`w-days__c ${lit ? 'is-on' : ''} ${name === 'Alarm' ? 'is-alarm' : ''}`} key={d} />;
            })}
          </div>
        ))}
      </div>
      <div className={`w-days__flag ${k >= 6 ? 'is-in' : ''}`}>
        <span className="w-days__brace"><i /></span>
        <p><b>Hydris flags it here</b> and your team gets those days back.</p>
      </div>
    </div>
  );
}

export const WIDGETS = { data: DataIntake, understand: Context, reason: Trace, act: Recommend, learn: Learn, days: Days };

/* ---------- Knowledge base: five layers fill in, ready on day one ---------- */
export function KnowledgeBase({ layers }) {
  const [ref, inView] = useInView({ threshold: 0.3, once: true });
  return (
    <div ref={ref} className={`kb ${inView ? 'is-in' : ''}`}>
      <p className="kb__head"><span>Hydris knowledge base</span><span>Built by our water engineers</span></p>
      {layers.map((l, i) => (
        <div className="kb__row" style={{ '--i': i }} key={l}>
          <span className="kb__n">{String(i + 1).padStart(2, '0')}</span>
          <b>{l}</b>
          <i className="kb__bar"><u /></i>
        </div>
      ))}
      <p className="kb__foot"><span className="kb__dot" />Useful on day one</p>
    </div>
  );
}
