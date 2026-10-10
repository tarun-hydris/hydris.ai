import ScrollReveal from '../components/reactbits/ScrollReveal/ScrollReveal.jsx';
import Hero, { Splash } from '../components/sections/Hero.jsx';
import {
  Cta, Definition, Faq, IconCards, Nots, Oneline, Process, Products, RowList, SystemsLoop, Timeline, Velocity,
} from '../components/sections/Blocks.jsx';
import { Capture, LayerStack, Proof, Readout, ResultStrip } from '../components/sections/Sections.jsx';
import { Aperture, Band, Hotspots, Stages, Texture } from '../components/sections/Imagery.jsx';
import { KnowledgeBase } from '../components/widgets/Widgets.jsx';
import { Frame } from '../components/ui/Photo.jsx';
import { Arrow, Parallax, Reveal, SecHead } from '../components/ui/Primitives.jsx';
import {
  AUDIENCE, CATEGORY, GET_IN, HOME_FAQ, HOW, IMAGERY, IMPL, KNOWLEDGE, LOOKS, MATTERS, MISSING, PLATFORM_HOME,
  PRODUCTS, PROBLEM, PROOF, WHY,
} from '../lib/content.js';

const IMG = IMAGERY;

export default function Home() {
  return (
    <>
      <Splash />
      <Hero />

      {/* The plant, from above: the clarifier opens out into the whole site */}
      <Aperture {...IMG.aperture} />

      {/* 01 Get Hydris in your plant */}
      <section className="sec" id="start">
        <SecHead index="01" label="Get started" title={GET_IN.title} text={GET_IN.lead} />
        <IconCards items={GET_IN.items} cols={4} variant="icards--four" />
        <Reveal className="sec__action" delay={0.1}>
          <a className="pill" href="/contact/">Talk to us <Arrow /></a>
        </Reveal>
      </section>

      <SystemsLoop />

      {/* 02 Across the plant */}
      <Stages index="02" {...IMG.stages} />

      {/* 03 The problem */}
      <section className="sec problem" id="problem">
        <SecHead index="03" label={PROBLEM.eyebrow} title={PROBLEM.title} />
        <div className="problem__body grid">
          <Reveal as="p" className="lead problem__lede" delay={0.05}>{PROBLEM.lede}</Reveal>
          {PROBLEM.points.map((p, i) => (
            <Reveal className="problem__pt hl" key={p.title} delay={0.1 + i * 0.12}>
              <h3 className="t-row">{p.title}</h3>
              <p className="body mute">{p.text}</p>
            </Reveal>
          ))}
          <Frame name={IMG.problem.name} ratio="4 / 5" position="36% 50%" sizes="(min-width: 901px) 24vw, 100vw"
            drift={0.14} className="problem__photo">
            <figcaption className="s-label frame__cap">{IMG.problem.caption}</figcaption>
          </Frame>
        </div>
        <div className="problem__close grid">
          <div className="problem__statement">
            <ScrollReveal as="p" textClassName="statement" baseOpacity={0.12} enableBlur blurStrength={5} baseRotation={1.5}>{PROBLEM.close}</ScrollReveal>
          </div>
        </div>
      </section>

      {/* 04 The category */}
      <section className="sec alt" id="category">
        <SecHead index="04" label={CATEGORY.eyebrow} title={CATEGORY.title} />
        <div className="wide">
          <Definition term={CATEGORY.term} d1={CATEGORY.d1} d2={CATEGORY.d2} />
          <Nots items={CATEGORY.nots} />
        </div>
      </section>

      <Velocity texts={['Capture knowledge · Guide decisions · Strengthen operations ·', 'Data · Understand · Reason · Act · Learn ·']} />

      {/* 05 How it works */}
      <section className="sec sec--process" id="how">
        <SecHead index="05" label={HOW.eyebrow} title={HOW.title} text={HOW.lead} />
        <Process steps={HOW.steps} />
        <ResultStrip items={HOW.result} />
      </section>

      {/* 06 What it runs on */}
      <section className="sec alt kbsec" id="knowledge">
        <SecHead index="06" label={KNOWLEDGE.eyebrow} title={KNOWLEDGE.title} />
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

      {/* 07 Why Hydris */}
      <section className="sec" id="why">
        <SecHead index="07" label={WHY.eyebrow} title={WHY.title} text={WHY.lead} />
        <Band {...IMG.control} ratio="21 / 8" position="50% 42%" className="band--inset" />
        <IconCards items={WHY.items} cols={3} />
      </section>

      {/* 08 The platform */}
      <section className="sec alt" id="platform">
        <SecHead index="08" label={PLATFORM_HOME.eyebrow} title={PLATFORM_HOME.title} text={PLATFORM_HOME.lead} />
        <div className="wide">
          <Products items={PRODUCTS} />
          <Reveal className="sec__action sec__action--start" delay={0.1}>
            <a className="link-u" href="/platform/">See the platform <Arrow /></a>
          </Reveal>
        </div>
      </section>

      {/* 09 How you get it in */}
      <section className="sec" id="implementation">
        <SecHead index="09" label={IMPL.eyebrow} title={IMPL.title} text={IMPL.lead} />
        <div className="wide">
          <Timeline steps={IMPL.steps} />
          <Oneline parts={IMPL.close} />
        </div>
      </section>

      {/* 10 Where we are today */}
      <section className="sec alt sec--proof" id="proof">
        <SecHead index="10" label={PROOF.eyebrow} title={PROOF.title} text={PROOF.lead} />
        <Proof big={PROOF.big} unit={PROOF.unit} note={PROOF.note} sweep={IMG.sweep} />
      </section>

      {/* 11 What it looks like */}
      <section className="sec" id="looks">
        <SecHead index="11" label={LOOKS.eyebrow} title={LOOKS.title} text={LOOKS.lead} />
        <Hotspots name={IMG.spots.name} items={IMG.spots.items} caption={IMG.spots.caption} />
        <div className="looks looks--overlap grid">
          <Parallax amount={18} className="looks__card"><Readout /></Parallax>
          <div className="looks__copy">
            {LOOKS.copy.map((t, i) => (
              <Reveal as="p" className={i === 0 ? 'lead' : i === 2 ? 'body mute' : 'body'} key={i} delay={0.1 + i * 0.12}>{t}</Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 12 Why it matters */}
      <section className="sec alt" id="matters">
        <SecHead index="12" label={MATTERS.eyebrow} title={MATTERS.title} />
        <div className="matters grid">
          {MATTERS.principles.map((p, i) => (
            <Reveal className="matters__col hl" key={p.title} delay={i * 0.1}>
              <span className="matters__n">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="t-s">{p.title}</h3>
              <p className="body mute">{p.text}</p>
            </Reveal>
          ))}
        </div>
        <RowList rows={MATTERS.levers.map((l, i) => ({ ...l, a: String(i + 1).padStart(2, '0') }))} />
        <div className="matters__notes grid">
          <Reveal as="p" className="body mute matters__note">{MATTERS.note}</Reveal>
          <Reveal as="p" className="lead matters__strong" delay={0.1}>{MATTERS.strong}</Reveal>
        </div>
      </section>

      {/* 13 The missing layer */}
      <section className="sec dark" id="layer">
        <Texture name="water-night" />
        <SecHead index="13" label={MISSING.eyebrow} title={MISSING.title} text={MISSING.lead} tone="dark" />
        <div className="wide">
          <LayerStack items={MISSING.stack} />
          <Reveal as="p" className="s-label layer__note">{MISSING.note}</Reveal>
          <Reveal as="p" className="t-s layer__foot" delay={0.1}>{MISSING.foot}</Reveal>
        </div>
      </section>

      {/* 14 Who it is for */}
      <section className="sec" id="audience">
        <SecHead index="14" label={AUDIENCE.eyebrow} title={AUDIENCE.title} text={AUDIENCE.lead} />
        <RowList rows={AUDIENCE.rows} variant="rows--icons" />
        <div className="verts grid">
          <div className="verts__chips">
            {AUDIENCE.verticals.map((v, i) => <Reveal as="span" className="chip" key={v} delay={i * 0.08}>{v}</Reveal>)}
          </div>
          <Reveal as="p" className="body mute verts__note" delay={0.2}>{AUDIENCE.note}</Reveal>
        </div>
      </section>

      <Faq index="15" items={HOME_FAQ} />
      <Capture />
      <Cta />
    </>
  );
}
