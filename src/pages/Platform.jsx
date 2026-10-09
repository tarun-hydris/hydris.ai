import { Cta, Definition, IconCards, Panel, Products, RowList } from '../components/sections/Blocks.jsx';
import { InkField } from '../components/sections/Hero.jsx';
import { Band, Mosaic, Texture } from '../components/sections/Imagery.jsx';
import { Reveal, SecHead, Visible, Words } from '../components/ui/Primitives.jsx';
import { IMAGERY, PLATFORM, PRODUCTS } from '../lib/content.js';
import { reduced } from '../lib/hooks.js';

export default function Platform() {
  const P = PLATFORM;
  return (
    <>
      <section className="phero">
        {!reduced && (
          <div className="phero__bg phero__bg--ink" aria-hidden="true">
            <Visible rootMargin="0px"><InkField /></Visible>
          </div>
        )}
        <div className="phero__inner grid">
          <Reveal as="p" className="s-label phero__label">(Platform) Hydris</Reveal>
          <Words as="h1" text={P.title} className="t-xl phero__title" delay={0.1} />
          <Reveal as="p" className="lead phero__lead" delay={0.5}>{P.lead}</Reveal>
        </div>
      </section>

      <Band {...IMAGERY.bands.platform} />

      <section className="sec alt" id="bet">
        <SecHead index="01" label={P.bet.eyebrow} title={P.bet.title} />
        <div className="wide">
          <Definition term={P.bet.term} d1={P.bet.d1} d2={P.bet.d2} />
        </div>
      </section>

      <section className="sec" id="products">
        <SecHead index="02" label={P.products.eyebrow} title={P.products.title} text={P.products.lead} />
        <div className="wide"><Products items={PRODUCTS} /></div>
      </section>

      <section className="sec alt" id="technology">
        <SecHead index="03" label={P.tech.eyebrow} title={P.tech.title} text={P.tech.lead} />
        <IconCards items={P.tech.items} cols={3} variant="icards--tech" />
      </section>

      <section className="sec" id="gets">
        <SecHead index="04" label={P.gets.eyebrow} title={P.gets.title} text={P.gets.lead} />
        <RowList rows={P.gets.rows.map((r) => ({ ...r, a: r.verb }))} variant="rows--verb" />
      </section>

      <section className="sec dark" id="principles">
        <Texture name="water-deep" />
        <SecHead index="05" label={P.principles.eyebrow} title={P.principles.title} tone="dark" />
        <div className="matters matters--dark grid">
          {P.principles.items.map((p, i) => (
            <Reveal className="matters__col hl" key={p.title} delay={i * 0.1}>
              <span className="matters__n">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="t-s">{p.title}</h3>
              <p className="body">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sec idea" id="idea">
        <SecHead index="06" label={P.idea.eyebrow} title={P.idea.title} />
        <div className="idea__grid grid">
          <div className="idea__text">
            <Reveal as="p" className="lead" delay={0.05}>{P.idea.lede}</Reveal>
            {P.idea.paras.map((t, i) => <Reveal as="p" className="body mute" key={i} delay={0.12 + i * 0.1}>{t}</Reveal>)}
          </div>
          <Reveal className="idea__viz" delay={0.1}><Panel name="days" /></Reveal>
        </div>
      </section>

      <section className="sec alt" id="reach">
        <SecHead index="07" label={P.reach.eyebrow} title={P.reach.title} text={P.reach.lead} />
        <RowList rows={P.reach.rows.map((r) => ({ ...r, a: r.verb }))} variant="rows--verb" />
        <Mosaic items={IMAGERY.reach} />
      </section>

      <section className="sec" id="start">
        <SecHead index="08" label={P.start.eyebrow} title={P.start.title} />
        <RowList rows={P.start.rows.map((r) => ({ a: r.k, text: r.v, k: r.k }))} variant="rows--kit" />
      </section>

      <Cta short />
    </>
  );
}
