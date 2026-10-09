import FuzzyText from '../components/reactbits/FuzzyText/FuzzyText.jsx';
import { InkField } from '../components/sections/Hero.jsx';
import { Arrow, Heading, Reveal, Visible } from '../components/ui/Primitives.jsx';
import { reduced } from '../lib/hooks.js';

export default function NotFound() {
  return (
    <section className="nf">
      <div className="nf__bg" aria-hidden="true"><Visible rootMargin="0px"><InkField color="rgba(0, 0, 0, 0.16)" /></Visible></div>
      <div className="nf__veil" aria-hidden="true" />
      <div className="nf__inner">
        <Reveal as="p" className="s-label">(404) Page not found</Reveal>
        <div className="nf__digits" aria-label="404" role="img">
          {reduced
            ? <span className="nf__static">404</span>
            : <FuzzyText fontSize="clamp(120px, 26vw, 360px)" fontWeight={400} color="#000000" baseIntensity={0.1} hoverIntensity={0.42} fuzzRange={26} enableHover>404</FuzzyText>}
        </div>
        <Heading as="h1" text="We could not find that page." className="t-m" center />
        <Reveal as="p" className="lead mute nf__lead" delay={0.15}>It may have moved, or the address may have a typo. Head back to the start, or talk to us.</Reveal>
        <Reveal className="nf__links" delay={0.25}>
          <a className="pill" href="/">Go back home <Arrow /></a>
          <a className="link-u" href="/contact/">Talk to us <Arrow /></a>
        </Reveal>
      </div>
    </section>
  );
}
