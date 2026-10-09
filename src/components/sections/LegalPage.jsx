import { RowList } from './Blocks.jsx';
import { Reveal, Words } from '../ui/Primitives.jsx';

/* Shared layout for the privacy policy and terms of use */
export default function LegalPage({ doc, contact }) {
  const rows = doc.sections.map(([title, text]) => ({ title, text }));
  rows.push({ title: 'Contact', text: contact });
  return (
    <>
      <section className="phero phero--short phero--legal">
        <div className="phero__inner grid">
          <Reveal as="p" className="s-label phero__label">(Legal) Hydris</Reveal>
          <Words as="h1" text={doc.title} className="t-l phero__title" delay={0.1} />
          <Reveal as="p" className="legal__updated" delay={0.4}>{doc.updated}</Reveal>
        </div>
      </section>
      <section className="sec legal">
        <div className="grid">
          <Reveal as="p" className="lead legal__intro" delay={0.05}>{doc.intro}</Reveal>
        </div>
        <RowList rows={rows} variant="rows--legal" />
      </section>
    </>
  );
}
