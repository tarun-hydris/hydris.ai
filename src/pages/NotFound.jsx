import { Arrow, Reveal, Words } from '../components/ui/Primitives.jsx';

/* One quiet gesture from the system: the clarifier ring around the number. Recovery is immediate. */
export default function NotFound() {
  return (
    <section className="nf" aria-label="Page not found">
      <div className="nf__inner">
        <Reveal as="p" className="s-label">Page not found</Reveal>
        <div className="nf__digits">
          <svg className="nf__ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <circle className="nf__ticks" cx="50" cy="50" r="49" />
            <circle className="nf__line" cx="50" cy="50" r="46.5" />
          </svg>
          <span className="nf__num" role="img" aria-label="Error 404">404</span>
        </div>
        <Words as="h1" text="We could not find that page." className="t-m" center />
        <Reveal as="p" className="lead mute nf__lead" delay={0.15}>It may have moved, or the address may have a typo. Head back to the start, or talk to us.</Reveal>
        <Reveal className="nf__links" delay={0.25}>
          <a className="pill" href="/">Go back home <Arrow /></a>
          <a className="link-u" href="/contact/">Talk to us <Arrow /></a>
        </Reveal>
      </div>
    </section>
  );
}
