import { useState } from 'react';
import { Dots, RowList } from '../components/sections/Blocks.jsx';
import { Band } from '../components/sections/Imagery.jsx';
import Icon from '../components/ui/Icon.jsx';
import { Arrow, Reveal, SecHead, Words } from '../components/ui/Primitives.jsx';
import { EMAIL_PRESS, IMAGERY, PRESS } from '../lib/content.js';

function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); } catch { /* clipboard unavailable */ }
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  };
  return (
    <button className="copy" type="button" onClick={copy} aria-live="polite">
      <Icon name={done ? 'check' : 'copy'} />{done ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function Press() {
  return (
    <>
      <section className="phero phero--short">
        <Dots className="dots--right" />
        <div className="phero__inner grid">
          <Reveal as="p" className="s-label phero__label">(Press) Hydris</Reveal>
          <Words as="h1" text={PRESS.title} className="t-xl phero__title" delay={0.1} />
          <Reveal as="p" className="lead phero__lead" delay={0.5}>
            {PRESS.lead} <a className="link-u" href={`mailto:${EMAIL_PRESS}`}>{EMAIL_PRESS}</a>. {PRESS.lead2}
          </Reveal>
        </div>
      </section>

      <Band {...IMAGERY.bands.press} />

      <section className="sec alt" id="copy">
        <SecHead index="01" label={PRESS.copyEyebrow} title={PRESS.copyTitle} />
        <RowList variant="rows--kit"
          rows={PRESS.copy.map((r) => ({ k: r.k, a: r.k, text: r.v, action: <CopyButton text={r.v} /> }))} />
      </section>

      <section className="sec" id="assets">
        <SecHead index="02" label={PRESS.assetsEyebrow} title={PRESS.assetsTitle} />
        <RowList variant="rows--kit"
          rows={[
            ...PRESS.assets.map((r) => ({ k: r.k, a: r.k, text: r.v })),
            {
              k: 'Everything', a: 'Everything',
              text: 'The full press kit is sent on request.',
              action: <a className="pill" href={`mailto:${EMAIL_PRESS}?subject=${encodeURIComponent('Press kit request')}`}>Request the press kit <Arrow /></a>,
            },
          ]} />
      </section>
    </>
  );
}
