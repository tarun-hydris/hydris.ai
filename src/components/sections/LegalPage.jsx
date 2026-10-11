import { Words } from '../ui/Primitives.jsx';

const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/* Quiet reading layout for the privacy policy and terms of use: a contents list, short line lengths,
   ordered headings and no scroll choreography. The text and its draft status are preserved as supplied. */
export default function LegalPage({ doc, contact }) {
  const sections = [...doc.sections.map(([title, text]) => ({ title, text })), { title: 'Contact', text: contact }];
  return (
    <>
      <section className="phero phero--legal" aria-label={doc.title}>
        <div className="phero__inner grid">
          <p className="s-label phero__label">(Legal) Hydris</p>
          <Words as="h1" text={doc.title} className="t-l phero__title" delay={0.05} />
          <p className="legal__updated">{doc.updated}</p>
        </div>
      </section>
      <section className="sec legal">
        <div className="legal__grid grid">
          <nav className="legal__toc" aria-label="Contents">
            <p className="s-label">Contents</p>
            <ol>
              {sections.map((s) => <li key={s.title}><a href={`#${slug(s.title)}`}>{s.title}</a></li>)}
            </ol>
          </nav>
          <div className="legal__body">
            <p className="lead legal__intro">{doc.intro}</p>
            {sections.map((s) => (
              <section className="legal__sec" id={slug(s.title)} key={s.title}>
                <h2 className="t-row">{s.title}</h2>
                <p className="body">{s.text}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
