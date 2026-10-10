import { Splash } from '../components/sections/Hero.jsx';
import { Cta } from '../components/sections/Blocks.jsx';
import { Aperture, Stages } from '../components/sections/Imagery.jsx';
import { Control, Example, Steps, Value } from '../components/sections/Story.jsx';
import { HOME, IMAGERY } from '../lib/content.js';

/* Six parts, in the order a visitor needs them: what Hydris does, an example of it working,
   why it helps every shift, how it starts, who stays in control, and the invitation.
   The splash and the clarifier from above are the two picture moments between them. */
export default function Home() {
  return (
    <>
      <Splash />
      <Aperture {...IMAGERY.aperture} />
      <Example {...HOME.example} />
      <Value index="02" {...HOME.value} />
      <Stages index="03" {...IMAGERY.stages} eyebrow={HOME.how.eyebrow} />
      <Steps steps={HOME.how.steps} link={HOME.how.link} />
      <Control index="04" control={HOME.control} start={HOME.start} photo={IMAGERY.control} />
      <Cta />
    </>
  );
}
