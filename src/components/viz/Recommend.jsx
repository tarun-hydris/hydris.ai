import { Fragment } from 'react';
import { Mark } from '../ui/Brand.jsx';
import Icon from '../ui/Icon.jsx';
import { reduced, sleep, useLoop, useMotionOff } from '../../lib/hooks.js';
import { Check, settle, usePhase } from './reason-parts.jsx';
import '../../styles/viz/reason.css';

/* 04 Act: Hydris writes the recommendation, shows why and on what evidence, and the
   operator decides. Overrule stays available throughout. Decorative (aria-hidden). */

const WORDS = 'Check the return rate before touching the blowers.'.split(' ');
const REASONS = [
  'Same pattern preceded a settling problem on 14 March',
  'The fix then was to reduce, not increase',
];
const EVIDENCE = ['18:40 feed change', '14 March'];

/* Phases: 0 empty, 1 sentence, 2 reasons, 3 evidence, 4 pointer moves to Agree,
   5 press, 6 decided, 7 fade, 8 snap back (transitions off) */
export function Recommend({ active }) {
  useMotionOff(); // re-render when Pause motion or the system setting changes
  const [ph, go, phRef] = usePhase(0);

  useLoop(active, async (alive) => {
    if (!(await settle(phRef, go, alive, 7, 8, 560))) return;
    const steps = [[1, 520], [2, 1350], [3, 1250], [4, 900], [5, 950], [6, 560]];
    for (const [n, wait] of steps) {
      await sleep(wait);
      if (!alive()) return;
      go(n);
    }
    await sleep(3600);
    if (!alive()) return;
    await settle(phRef, go, alive, 7, 8, 560);
    await sleep(240);
  });

  const k = reduced ? 6 : ph;
  const s = k >= 7 ? 0 : k;
  const cursor = reduced ? '' : s === 4 ? 'is-on' : s === 5 ? 'is-on is-click' : s >= 6 ? 'is-gone' : '';

  return (
    <div className={`vz-rsn vz-rec ${active ? 'is-active' : ''} ${k === 7 ? 'is-fade' : ''} ${k === 8 ? 'is-snap' : ''}`} aria-hidden="true">
      <div className="vz-rsn__head">
        <span className="vz-rec__who"><Mark className="vz-rec__mark" /><b className="vz-rsn__title">Hydris</b></span>
        <span className="vz-rsn__meta">02:14</span>
      </div>

      <div className="vz-rec__body">
        <p className="vz-rsn__lbl">Recommendation</p>
        <p className={`vz-rec__say ${s >= 1 ? 'is-in' : ''}`}>
          {WORDS.map((w, i) => (
            <Fragment key={i}>
              <span className="vz-rec__wm"><span className="vz-rec__w" style={{ '--i': i }}>{w}</span></span>
              {i < WORDS.length - 1 ? ' ' : null}
            </Fragment>
          ))}
        </p>
        <ul className={`vz-rec__why ${s >= 2 ? 'is-in' : ''}`}>
          {REASONS.map((r, i) => (
            <li key={r} style={{ '--i': i }}><Check />{r}</li>
          ))}
        </ul>
        <div className={`vz-rec__ev ${s >= 3 ? 'is-in' : ''}`}>
          <span className="vz-rsn__lbl">Evidence</span>
          {EVIDENCE.map((e, i) => (
            <span className="vz-rec__chip" key={e} style={{ '--i': i }}>{e}<Icon name="arrow" /></span>
          ))}
        </div>
      </div>

      <div className="vz-rec__act">
        <span className={`vz-rec__btn vz-rec__btn--pri ${s >= 5 ? 'is-press' : ''}`}>
          <span className="vz-rec__clip"><span className="vz-rec__rip" /></span>
          <span className="vz-rec__bl">Agree</span>
          <svg className={`vz-rec__cur ${cursor}`} viewBox="0 0 16 20">
            <path d="M1.6 1.4v14.4l3.7-3.5 2.4 5.4 2.6-1.1-2.4-5.3h5.1z" />
          </svg>
        </span>
        <span className="vz-rec__btn vz-rec__btn--ghost">Overrule</span>
      </div>

      <div className={`vz-swap vz-rec__dec ${s >= 6 ? 'is-b is-in' : ''}`}>
        <span className="vz-rec__st vz-rec__st--wait"><i />Awaiting the operator</span>
        <span className="vz-rec__st vz-rec__st--done"><Check />Decided by the operator<time>02:14</time></span>
      </div>

      <div className="vz-rsn__foot">
        <span>Illustrative</span>
        <span>Plant 01 · Night shift</span>
      </div>
    </div>
  );
}
