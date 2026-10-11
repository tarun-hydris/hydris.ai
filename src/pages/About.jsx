import ScrollReveal from '../components/reactbits/ScrollReveal/ScrollReveal.jsx';
import { Quote } from '../components/sections/Blocks.jsx';
import { Invitation } from '../components/sections/Chapters.jsx';
import { Band } from '../components/sections/Imagery.jsx';
import FounderPortrait from '../components/ui/FounderPortrait.jsx';
import { Frame } from '../components/ui/Photo.jsx';
import { Reveal, SecHead, Words } from '../components/ui/Primitives.jsx';
import { ABOUT, IMAGERY } from '../lib/content.js';

/* The company, told as one editorial story: the problem, why Vetri started Hydris, what is being
   protected, how the team works. The founder's portrait is a short sequence of photographs that plays as
   the cursor comes near; no team photograph has been supplied yet. Nothing here is invented. */
export default function About() {
  const A = ABOUT;
  return (
    <>
      <section className="phero" aria-label="About">
        <div className="phero__inner grid">
          <Reveal as="p" className="s-label phero__label">(About) Hydris</Reveal>
          <Words as="h1" text={A.title} className="t-xl phero__title" delay={0.1} />
          <Reveal as="p" className="lead phero__lead" delay={0.4}>{A.lead}</Reveal>
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

      <section className="sec alt founder" id="founder">
        <SecHead index="02" label={A.founder.eyebrow} title={A.founder.title} />
        <div className="founder__grid grid">
          <Reveal className="founder__portrait" delay={0.05}>
            <FounderPortrait alt={`Portrait of ${A.founder.cite}, founder and chief executive of Hydris`} />
          </Reveal>
          <div className="founder__text">
            <Reveal as="figure" className="founder__quote" delay={0.05}>
              <blockquote>{A.founder.quote}</blockquote>
              <figcaption className="s-label">{A.founder.cite}</figcaption>
            </Reveal>
            <div className="founder__paras">
              {A.founder.paras.map((t, i) => <Reveal as="p" className={i === 0 ? 'lead' : 'body mute'} key={i} delay={0.06 + i * 0.08}>{t}</Reveal>)}
            </div>
          </div>
        </div>
      </section>

      <section className="sec info" id="protecting">
        <div className="grid">
          <Reveal as="p" className="s-label info__label">(03) {A.protect.eyebrow}</Reveal>
          <div className="info__main">
            <ScrollReveal as="h2" textClassName="statement" baseOpacity={0.14} enableBlur={false} baseRotation={1.2}>{A.protect.title}</ScrollReveal>
          </div>
        </div>
        <div className="story__body grid protect__body">
          <Frame name={IMAGERY.bands.protect.name} ratio="4 / 5" sizes="(min-width: 901px) 24vw, 100vw" drift={0.1} className="protect__photo">
            <figcaption className="s-label frame__cap">{IMAGERY.bands.protect.caption}</figcaption>
          </Frame>
          <Reveal as="p" className="lead story__lede" delay={0.05}>{A.protect.lede}</Reveal>
          <div className="story__paras">
            {A.protect.paras.map((t, i) => <Reveal as="p" className="body mute" key={i} delay={0.08 + i * 0.08}>{t}</Reveal>)}
          </div>
        </div>
      </section>

      <section className="sec alt values" id="values">
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
        <SecHead index="05" label={A.team.eyebrow} title={A.team.title} />
        <div className="story__body grid team__body">
          <Reveal as="p" className="lead story__lede" delay={0.05}>{A.team.text}</Reveal>
          <Reveal className="team__places" delay={0.15}>
            <span className="chip">United States</span>
            <span className="chip">India</span>
          </Reveal>
        </div>
      </section>

      <Invitation photo="plant-night" />
    </>
  );
}
