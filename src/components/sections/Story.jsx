import { Frame } from '../ui/Photo.jsx';
import Icon from '../ui/Icon.jsx';
import { Arrow, Heading, Reveal } from '../ui/Primitives.jsx';
import { useInView } from '../../lib/hooks.js';

/* Small mono label with its section number */
export function Label({ index, children }) {
  return <Reveal as="p" className="s-label story__label">{index && <span className="story__n">{index}</span>}{children}</Reveal>;
}

/* 01 The product example: one change in the data, three questions, and the operator's decision.
   An illustration, labelled as one. */
export function Example({ eyebrow, title, lead, label, steps, decision, link }) {
  const [ref, inView] = useInView({ threshold: 0.3, once: true });
  return (
    <section className="story story--example" id="example">
      <div className="story__head grid">
        <div className="story__intro">
          <Label index="01">{eyebrow}</Label>
          <Heading text={title} className="t-m" />
          <Reveal as="p" className="lead mute" delay={0.12}>{lead}</Reveal>
          <Reveal delay={0.2}><a className="link-u" href="/platform/">{link} <Arrow /></a></Reveal>
        </div>
      </div>
      <div className="grid">
        <div ref={ref} className={`inv ${inView ? 'is-in' : ''}`}>
          <div className="inv__chart" aria-hidden="true">
            <div className="inv__chartHead"><span>Effluent ammonia</span><span>Last 12 hours</span></div>
            <svg viewBox="0 0 600 120" preserveAspectRatio="none">
              <path className="inv__grid" d="M0 30H600M0 60H600M0 90H600" />
              <path className="inv__line" pathLength="1" d="M0 92 C60 90 110 94 160 90 S260 88 300 84 S380 70 420 62 S500 40 540 32 S580 22 600 18" />
            </svg>
          </div>
          <ol className="inv__steps">
            {steps.map((s, i) => (
              <li className="inv__step" key={s.q} style={{ '--i': i }}>
                <span className="inv__n">{String(i + 1).padStart(2, '0')}</span>
                <p className="inv__q">{s.q}</p>
                <p className="inv__a">{s.a}</p>
              </li>
            ))}
          </ol>
          <p className="inv__decision"><Icon name="operator" className="inv__ico" />{decision}</p>
        </div>
        <p className="s-label inv__label">{label}</p>
      </div>
    </section>
  );
}

/* 02 Everyday value: three plain statements, lots of air */
export function Value({ index, eyebrow, title, items }) {
  return (
    <section className="story story--value">
      <div className="story__head grid">
        <div className="story__intro">
          <Label index={index}>{eyebrow}</Label>
          <Heading text={title} className="t-m" />
        </div>
      </div>
      <div className="trio grid">
        {items.map((it, i) => (
          <Reveal className="trio__item" key={it.title} delay={i * 0.1}>
            <Icon name={it.icon} className="trio__ico icon--draw" />
            <h3 className="trio__t">{it.title}</h3>
            <p className="trio__p">{it.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* 03 How it works, after the walk through the plant: three steps */
export function Steps({ steps, link }) {
  return (
    <section className="story story--steps" id="how">
      <ol className="trio trio--steps grid">
        {steps.map((s, i) => (
          <Reveal as="li" className="trio__item" key={s.title} delay={i * 0.1}>
            <span className="trio__step">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="trio__t">{s.title}</h3>
            <p className="trio__p">{s.text}</p>
          </Reveal>
        ))}
      </ol>
      <div className="grid"><Reveal className="story__more" delay={0.2}><a className="link-u" href="/platform/">{link} <Arrow /></a></Reveal></div>
    </section>
  );
}

/* 04 Operator control, and how a conversation starts */
export function Control({ index, control, start, photo }) {
  return (
    <section className="story story--control">
      <div className="ctl grid">
        <Frame name={photo.name} ratio="4 / 5" position="50% 42%" sizes="(min-width: 901px) 40vw, 100vw" drift={0.08} className="ctl__photo" />
        <div className="ctl__text">
          <Label index={index}>{control.eyebrow}</Label>
          <Heading text={control.title} className="t-m" />
          <Reveal as="p" className="lead mute" delay={0.12}>{control.text}</Reveal>
          <div className="ctl__start">
            <Reveal as="p" className="s-label story__label">{start.eyebrow}</Reveal>
            <Reveal as="h3" className="t-s" delay={0.05}>{start.title}</Reveal>
            <Reveal as="p" className="body mute" delay={0.12}>{start.text}</Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
