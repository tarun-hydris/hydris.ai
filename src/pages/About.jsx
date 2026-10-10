import ScrollReveal from '../components/reactbits/ScrollReveal/ScrollReveal.jsx';
import Threads from '../components/reactbits/Threads/Threads.jsx';
import { Cta, Dots, Quote } from '../components/sections/Blocks.jsx';
import { Band } from '../components/sections/Imagery.jsx';
import { Frame } from '../components/ui/Photo.jsx';
import { Reveal, SecHead, Visible, Words } from '../components/ui/Primitives.jsx';
import { ABOUT, IMAGERY } from '../lib/content.js';
import { reduced } from '../lib/hooks.js';

export default function About() {
  const A = ABOUT;
  return (
    <>
      <section className="phero">
        {!reduced && (
          <div className="phero__bg" aria-hidden="true">
            <Visible>
              <Threads color={[0.16, 0.25, 0.28]} amplitude={1.2} distance={0.1} enableMouseInteraction />
            </Visible>
          </div>
        )}
        <div className="phero__inner grid">
          <Reveal as="p" className="s-label phero__label">(About) Hydris</Reveal>
          <Words as="h1" text={A.title} className="t-xl phero__title" delay={0.1} />
          <Reveal as="p" className="lead phero__lead" delay={0.5}>{A.lead}</Reveal>
        </div>
      </section>

      <Band {...IMAGERY.bands.about} position="40% 50%" />

      <section className="sec story" id="why">
        <SecHead index="01" label={A.why.eyebrow} title={A.why.title} />
        <div className="story__body grid">
          <Reveal as="p" className="lead story__lede" delay={0.05}>{A.why.lede}</Reveal>
          <div className="story__paras">
            {A.why.paras.map((t, i) => <Reveal as="p" className="body mute" key={i} delay={0.08 + i * 0.08}>{t}</Reveal>)}
          </div>
        </div>
        <Quote text={A.why.quote} cite={A.why.cite} />
      </section>

      <section className="sec alt" id="founder">
        <SecHead index="02" label={A.founder.eyebrow} title={A.founder.title} />
        <div className="story__body grid">
          <div className="story__paras story__paras--wide">
            {A.founder.paras.map((t, i) => <Reveal as="p" className={i === 0 ? 'lead' : 'body mute'} key={i} delay={0.06 + i * 0.08}>{t}</Reveal>)}
          </div>
        </div>
        <Quote text={A.founder.quote} cite={A.founder.cite} />
      </section>

      <section className="sec info" id="protecting">
        <div className="grid">
          <Reveal as="p" className="s-label info__label">(03) {A.protect.eyebrow}</Reveal>
          <div className="info__main">
            <ScrollReveal as="h2" textClassName="statement" baseOpacity={0.12} enableBlur blurStrength={5} baseRotation={1.5}>{A.protect.title}</ScrollReveal>
          </div>
        </div>
        <div className="story__body grid protect__body">
          <Frame name={IMAGERY.bands.protect.name} ratio="4 / 5" sizes="(min-width: 901px) 24vw, 100vw" drift={0.14} className="protect__photo">
            <figcaption className="s-label frame__cap">{IMAGERY.bands.protect.caption}</figcaption>
          </Frame>
          <Reveal as="p" className="lead story__lede" delay={0.05}>{A.protect.lede}</Reveal>
          <div className="story__paras">
            {A.protect.paras.map((t, i) => <Reveal as="p" className="body mute" key={i} delay={0.08 + i * 0.08}>{t}</Reveal>)}
          </div>
        </div>
      </section>

      <section className="sec values" id="values">
        <SecHead index="04" label={A.work.eyebrow} title={A.work.title} />
        <div className="vgrid">
          {A.work.items.map((v, i) => (
            <Reveal className="vcell hl" key={v.title} delay={i * 0.1}>
              <span className="vcell__n">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="t-s">{v.title}</h3>
              <p className="body mute">{v.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sec team" id="team">
        <Dots className="dots--soft" />
        <SecHead index="05" label={A.team.eyebrow} title={A.team.title} />
        <div className="story__body grid team__body">
          <Reveal as="p" className="lead story__lede" delay={0.05}>{A.team.text}</Reveal>
          <Reveal className="team__places" delay={0.15}>
            <span className="chip chip--live">United States</span>
            <span className="chip chip--live">India</span>
          </Reveal>
        </div>
      </section>

      <Cta short />
    </>
  );
}
