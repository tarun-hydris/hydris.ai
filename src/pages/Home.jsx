import ScrollReveal from '../components/reactbits/ScrollReveal/ScrollReveal.jsx';
import Hero, { Splash } from '../components/sections/Hero.jsx';
import { Assurances, Cta, Definition, Faq, IconCards, Nots, Process, Products, RowList, Timeline } from '../components/sections/Blocks.jsx';
import { Readout, ResultStrip } from '../components/sections/Sections.jsx';
import { Aperture, Stages } from '../components/sections/Imagery.jsx';
import { Frame } from '../components/ui/Photo.jsx';
import { Arrow, Parallax, Reveal, SecHead, Words } from '../components/ui/Primitives.jsx';
import {
  AUDIENCE, CATEGORY, GET_IN, HOME_FAQ, HOW, IMAGERY, IMPL, KNOWLEDGE, LOOKS, MATTERS, MISSING, PLATFORM_HOME,
  PRODUCTS, PROBLEM, PROOF, WHY,
} from '../lib/content.js';

const IMG = IMAGERY;

/* Ten parts, one idea each: the problem, the category, the plant, how it works, what it looks like,
   the platform, why it matters, how you get it in, who it is for, and questions. */
export default function Home() {
  return (
    <>
      <Splash />
      <Hero />
      <Aperture {...IMG.aperture} />

      {/* 01 The problem */}
      <section className="sec problem" id="problem">
        <SecHead index="01" label={PROBLEM.eyebrow} title={PROBLEM.title} />
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

      {/* 02 The category */}
      <section className="sec alt" id="category">
        <SecHead index="02" label={CATEGORY.eyebrow} title={CATEGORY.title} />
        <div className="wide">
          <Definition term={CATEGORY.term} d1={CATEGORY.d1} d2={CATEGORY.d2} />
          <Nots items={CATEGORY.nots} />
        </div>
      </section>

      {/* 03 Across the plant */}
      <Stages index="03" {...IMG.stages} />

      {/* 04 How it works, and what it runs on */}
      <section className="sec sec--process" id="how">
        <SecHead index="04" label={HOW.eyebrow} title={HOW.title} text={HOW.lead} />
        <Process steps={HOW.steps} />
        <ResultStrip items={HOW.result} />
        <div className="kbline grid">
          <Reveal as="p" className="s-label kbline__label">{KNOWLEDGE.eyebrow}</Reveal>
          <div className="kbline__main">
            <Reveal as="h3" className="t-s">{KNOWLEDGE.title}</Reveal>
            <Reveal as="p" className="body mute" delay={0.1}>{KNOWLEDGE.text2}</Reveal>
            <div className="kbline__chips">
              {KNOWLEDGE.layers.map((l, i) => <Reveal as="span" className="chip" key={l} delay={0.15 + i * 0.06}>{l}</Reveal>)}
            </div>
          </div>
        </div>
      </section>

      {/* 05 What it looks like, and the rules it keeps */}
      <section className="sec alt" id="looks">
        <SecHead index="05" label={LOOKS.eyebrow} title={LOOKS.title} text={LOOKS.lead} />
        <div className="looks grid">
          <Parallax amount={18} className="looks__card"><Readout /></Parallax>
          <div className="looks__copy">
            {LOOKS.copy.map((t, i) => (
              <Reveal as="p" className={i === 0 ? 'lead' : 'body mute'} key={i} delay={0.1 + i * 0.12}>{t}</Reveal>
            ))}
          </div>
        </div>
        <div className="subhead grid">
          <Reveal as="p" className="s-label subhead__label">{WHY.eyebrow}</Reveal>
          <Reveal as="h3" className="t-s subhead__title" delay={0.05}>{WHY.title}</Reveal>
        </div>
        <IconCards items={WHY.items} cols={3} />
      </section>

      {/* 06 The platform */}
      <section className="sec" id="platform">
        <SecHead index="06" label={PLATFORM_HOME.eyebrow} title={PLATFORM_HOME.title} text={MISSING.title} />
        <div className="wide">
          <Products items={PRODUCTS} />
          <div className="platline">
            <Reveal as="p" className="body mute">{MISSING.foot}</Reveal>
            <Reveal delay={0.1}><a className="link-u" href="/platform/">See the platform <Arrow /></a></Reveal>
          </div>
        </div>
      </section>

      {/* 07 Why it matters */}
      <section className="sec alt" id="matters">
        <SecHead index="07" label={MATTERS.eyebrow} title={MATTERS.title} />
        <div className="matters grid">
          {MATTERS.principles.map((p, i) => (
            <Reveal className="matters__col hl" key={p.title} delay={i * 0.1}>
              <span className="matters__n">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="t-s">{p.title}</h3>
              <p className="body mute">{p.text}</p>
            </Reveal>
          ))}
        </div>
        <div className="levers grid">
          <Reveal as="p" className="s-label levers__label">Where it shows</Reveal>
          <div className="levers__list">
            {MATTERS.levers.map((l, i) => (
              <Reveal className="lever" key={l.title} delay={i * 0.07}>
                <span className="lever__t">{l.title}</span>
                <span className="lever__w">{l.where}</span>
              </Reveal>
            ))}
          </div>
          <Reveal as="p" className="body mute levers__note" delay={0.2}>{MATTERS.note}</Reveal>
        </div>
      </section>

      {/* 08 Getting started, and where we are today */}
      <section className="sec" id="start">
        <SecHead index="08" label={IMPL.eyebrow} title={GET_IN.title} text={GET_IN.lead} />
        <Assurances items={GET_IN.items} />
        <div className="wide"><Timeline steps={IMPL.steps} /></div>
        <div className="today grid">
          <Reveal as="p" className="s-label today__label">{PROOF.eyebrow}</Reveal>
          <div className="today__main">
            <Words as="p" text={PROOF.big} className="t-l today__big" />
            <Reveal as="p" className="lead today__unit" delay={0.2}>{PROOF.unit}</Reveal>
            <Reveal as="p" className="body mute" delay={0.3}>{PROOF.lead}</Reveal>
          </div>
        </div>
      </section>

      {/* 09 Who it is for */}
      <section className="sec alt" id="audience">
        <SecHead index="09" label={AUDIENCE.eyebrow} title={AUDIENCE.title} text={AUDIENCE.lead} />
        <RowList rows={AUDIENCE.rows} variant="rows--icons" />
        <div className="verts grid">
          <div className="verts__chips">
            {AUDIENCE.verticals.map((v, i) => <Reveal as="span" className="chip" key={v} delay={i * 0.08}>{v}</Reveal>)}
          </div>
          <Reveal as="p" className="body mute verts__note" delay={0.2}>{AUDIENCE.note}</Reveal>
        </div>
      </section>

      <Faq index="10" items={HOME_FAQ} />
      <Cta />
    </>
  );
}
