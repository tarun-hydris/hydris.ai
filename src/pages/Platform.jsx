import { Assurances, Definition, Faq, IconCards, Oneline, RowList, Timeline } from '../components/sections/Blocks.jsx';
import { Invitation, ProductStage } from '../components/sections/Chapters.jsx';
import { Band, Mosaic } from '../components/sections/Imagery.jsx';
import { LayerStack } from '../components/sections/Sections.jsx';
import { Days } from '../components/viz/Days.jsx';
import { KnowledgeBase } from '../components/viz/KnowledgeBase.jsx';
import { Arrow, Reveal, SecHead, Words } from '../components/ui/Primitives.jsx';
import Infographic from '../components/ui/Infographic.jsx';
import {
  AUDIENCE, CTA, GET_IN, HOME_FAQ, HOW, IMAGERY, IMPL, KNOWLEDGE, MISSING, PLATFORM,
} from '../lib/content.js';
import { useInView } from '../lib/hooks.js';

function Idea({ P }) {
  const [ref, on] = useInView({ rootMargin: '80px' });
  return (
    <section className="sec idea" id="idea" ref={ref}>
      <SecHead index="08" label={P.idea.eyebrow} title={P.idea.title} />
      <div className="idea__grid grid">
        <div className="idea__text">
          <Reveal as="p" className="lead" delay={0.05}>{P.idea.lede}</Reveal>
          {P.idea.paras.map((t, i) => <Reveal as="p" className="body mute" key={i} delay={0.12 + i * 0.1}>{t}</Reveal>)}
        </div>
        <Reveal className="idea__viz" delay={0.1}>
          <div className="idea__panel"><Days active={on} /></div>
          <p className="idea__concept">Illustrative. Not live plant data.</p>
        </Reveal>
      </div>
    </section>
  );
}

export default function Platform() {
  const P = PLATFORM;
  return (
    <>
      <section className="phero" aria-label="Platform">
        <div className="phero__inner grid">
          <Reveal as="p" className="s-label phero__label">(Platform) Hydris</Reveal>
          <Words as="h1" text={P.title} className="t-xl phero__title" delay={0.1} />
          <div className="phero__lead">
            <Reveal as="p" className="lead" delay={0.4}>{P.lead}</Reveal>
            <Reveal delay={0.5}><a className="pill" href={CTA.href}>{CTA.label} <Arrow /></a></Reveal>
          </div>
        </div>
      </section>

      <Band {...IMAGERY.bands.platform} />

      <ProductStage index="01" stack title={P.products.title} lead={P.products.lead} />

      <section className="sec alt" id="workflow">
        <SecHead index="02" label={HOW.eyebrow} title={HOW.title} text={HOW.lead} />
        <div className="pfig grid"><Reveal className="ig-wrap"><Infographic name="five-step-loop" /></Reveal></div>
        <RowList rows={HOW.steps.map((s, i) => ({ a: String(i + 1).padStart(2, '0'), title: s.key, role: s.title, text: s.text }))} variant="rows--verb" />
      </section>

      <section className="sec" id="bet">
        <SecHead index="03" label={P.bet.eyebrow} title={P.bet.title} />
        <div className="wide">
          <Definition term={P.bet.term} d1={P.bet.d1} d2={P.bet.d2} />
        </div>
      </section>

      <section className="sec alt" id="knowledge">
        <SecHead index="04" label={KNOWLEDGE.eyebrow} title={KNOWLEDGE.title} />
        <div className="kbsec__grid grid">
          <div className="kbsec__text">
            <Reveal as="h3" className="t-s" delay={0.05}>{KNOWLEDGE.lead}</Reveal>
            <Reveal as="p" className="body mute" delay={0.12}>{KNOWLEDGE.text}</Reveal>
            <Reveal as="p" className="body mute" delay={0.18}>{KNOWLEDGE.text2}</Reveal>
            <Reveal as="p" className="body kbsec__not" delay={0.24}>{KNOWLEDGE.not}</Reveal>
          </div>
          <Reveal className="kbsec__viz" delay={0.1}><KnowledgeBase layers={KNOWLEDGE.layers} /></Reveal>
        </div>
      </section>

      <section className="sec" id="technology">
        <SecHead index="05" label={P.tech.eyebrow} title={P.tech.title} text={P.tech.lead} />
        <IconCards items={P.tech.items} cols={3} variant="icards--tech" />
      </section>

      <section className="sec alt" id="layer">
        <SecHead index="06" label={MISSING.eyebrow} title={MISSING.title} text={MISSING.lead} />
        <div className="wide">
          <LayerStack items={MISSING.stack} />
          <Reveal as="p" className="s-label layer__note">{MISSING.note}</Reveal>
          <Reveal as="p" className="t-s layer__foot" delay={0.1}>{MISSING.foot}</Reveal>
        </div>
      </section>

      <section className="sec" id="gets">
        <SecHead index="07" label={P.gets.eyebrow} title={P.gets.title} text={P.gets.lead} />
        <RowList rows={P.gets.rows.map((r) => ({ ...r, a: r.verb }))} variant="rows--verb" />
        <div className="matters matters--plain grid">
          {P.principles.items.map((p, i) => (
            <Reveal className="matters__col hl" key={p.title} delay={i * 0.1}>
              <span className="matters__n">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="t-s">{p.title}</h3>
              <p className="body mute">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Idea P={P} />

      <section className="sec alt" id="reach">
        <SecHead index="09" label={P.reach.eyebrow} title={P.reach.title} text={P.reach.lead} />
        <RowList rows={P.reach.rows.map((r) => ({ ...r, a: r.verb }))} variant="rows--verb" />
        <Mosaic items={IMAGERY.reach} />
        <div className="verts grid">
          <div className="verts__chips">
            {AUDIENCE.verticals.map((v, i) => <Reveal as="span" className="chip" key={v} delay={i * 0.08}>{v}</Reveal>)}
          </div>
          <Reveal as="p" className="body mute verts__note" delay={0.2}>{AUDIENCE.note}</Reveal>
        </div>
      </section>

      <section className="sec" id="start">
        <SecHead index="10" label={P.start.eyebrow} title={P.start.title} />
        <RowList rows={P.start.rows.map((r) => ({ a: r.k, text: r.v, k: r.k }))} variant="rows--kit" />
      </section>

      <section className="sec alt" id="implementation">
        <SecHead index="11" label={IMPL.eyebrow} title={GET_IN.title} text={GET_IN.lead} />
        <div className="pfig grid"><Reveal className="ig-wrap"><Infographic name="onboarding-timeline" /></Reveal></div>
        <Assurances items={GET_IN.items} />
        <div className="wide"><Timeline steps={IMPL.steps} /><Oneline parts={IMPL.close} /></div>
      </section>

      <Faq index="12" items={HOME_FAQ} />
      <Invitation photo="plant-fog" />
    </>
  );
}
