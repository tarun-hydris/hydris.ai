import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Context } from '../viz/Context.jsx';
import { DataIntake } from '../viz/DataIntake.jsx';
import { KnowledgeBase } from '../viz/KnowledgeBase.jsx';
import { Learn } from '../viz/Learn.jsx';
import { Recommend } from '../viz/Recommend.jsx';
import { Trace } from '../viz/Trace.jsx';
import Icon, { Arrow } from '../ui/Icon.jsx';
import { Reveal, Words } from '../ui/Primitives.jsx';
import { INVESTIGATION, KNOWLEDGE } from '../../lib/content.js';
import { useInView, useMedia, useMotionOff } from '../../lib/hooks.js';
import { scrollToY } from '../../lib/scroll.js';

/* The one thing an operator on shift cannot get from a threshold alarm, shown as one story:
   data and context, then expertise and reasoning, then the next check and a human decision, then what
   the plant remembers. On a wide screen with motion allowed the section pins for about 265vh and the
   scroll advances the stages. Everywhere else (touch, narrow, motion paused or reduced) the stages are
   tap-controlled, nothing pins and the chart states are static. Either way the stage buttons work, the
   summary is plain text, and "Skip example" goes straight to the next chapter. */

function ControlCard() {
  return (
    <div className="inv__control" aria-hidden="true">
      <p className="inv__ctitle">Read only</p>
      <ul>
        <li><Icon name="check" />Reads your plant data</li>
        <li><Icon name="x" />Never writes to your control system</li>
        <li><Icon name="x" />Never moves equipment</li>
        <li><Icon name="check" />Your operator decides</li>
      </ul>
    </div>
  );
}

const SCENES = {
  context: (on) => (<><DataIntake active={on} /><Context active={on} /></>),
  reason: (on) => (<><Trace active={on} /><KnowledgeBase layers={KNOWLEDGE.layers} /></>),
  decide: (on) => (<><Recommend active={on} /><ControlCard /></>),
  learn: (on) => (<Learn active={on} />),
};

export default function Investigation({ index = '03' }) {
  const I = INVESTIGATION;
  const N = I.stages.length;
  const root = useRef(null);
  const track = useRef(null);
  const [stage, setStage] = useState(0);
  const wide = useMedia('(min-width: 1001px) and (min-height: 640px)');
  const off = useMotionOff();
  const pinned = wide && !off;
  const [visRef, visible] = useInView({ rootMargin: '120px' });

  /* Scroll drives the stage while pinned; the progress line is a CSS variable, so no re-render per frame */
  useEffect(() => {
    if (!pinned || !track.current) return undefined;
    const el = root.current;
    const st = ScrollTrigger.create({
      trigger: track.current, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => {
        el.style.setProperty('--p', self.progress.toFixed(4));
        const s = Math.min(N - 1, Math.floor(self.progress * N * 0.9999));
        setStage((v) => (v === s ? v : s));
      },
    });
    return () => st.kill();
  }, [pinned, N]);

  const go = (i) => {
    setStage(i);
    if (!pinned || !track.current) return;
    const top = track.current.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + (track.current.offsetHeight - window.innerHeight) * ((i + 0.5) / N));
  };

  const cur = I.stages[stage];
  return (
    <section ref={root} id="investigation" className={`inv ${pinned ? 'inv--pinned' : ''}`} style={{ '--n': N, '--p': 0 }} aria-label={I.label}>
      <div className="inv__track" ref={track}>
        <div className="inv__sticky" ref={visRef}>
          <div className="inv__grid grid">
            <div className="inv__side">
              <Reveal as="p" className="s-label inv__label">({index}) {I.label}</Reveal>
              <Words as="h2" text={I.title} className="t-m inv__title" />
              <Reveal as="p" className="inv__lead mute" delay={0.1}>{I.lead}</Reveal>

              <ol className="inv__steps" aria-label={I.stagesLabel}>
                {I.stages.map((s, i) => (
                  <li key={s.key} className={i === stage ? 'is-on' : i < stage ? 'is-past' : ''}>
                    <button type="button" onClick={() => go(i)} aria-current={i === stage ? 'step' : undefined} aria-controls="inv-scenes">
                      <span className="inv__n">{s.n}</span>
                      <span className="inv__name">{s.name}</span>
                    </button>
                  </li>
                ))}
              </ol>

              <div className="inv__sum" aria-live="polite">
                <p className="inv__sumn"><span>{cur.n}</span> {cur.name}</p>
                <p className="body">{cur.text}</p>
              </div>

              <a className="inv__skip link-u" href={I.skipHref}>{I.skip} <Arrow dir="down" /></a>
            </div>

            <div className="inv__scenes" id="inv-scenes">
              {I.stages.map((s, i) => (
                <div key={s.key} className={`inv__scene ${i === stage ? 'is-on' : ''}`} aria-hidden="true">
                  <div className="inv__cards">{SCENES[s.key](visible && i === stage)}</div>
                </div>
              ))}
              <p className="inv__cap">{I.caption}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
