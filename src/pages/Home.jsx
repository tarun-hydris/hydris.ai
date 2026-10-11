import { Aperture, Change, Invitation, Opening, Operator, People, ProductStage } from '../components/sections/Chapters.jsx';
import Investigation from '../components/sections/Investigation.jsx';
import { IMAGERY } from '../lib/content.js';

/* One journey in seven chapters: the living system (with the circle that opens onto the plant), the
   change, the investigation, the product, the operator, the people, and the invitation. Technical
   depth lives on Platform. */
export default function Home() {
  return (
    <>
      <Opening />
      <Aperture {...IMAGERY.aperture} />
      <Change index="02" />
      <Investigation index="03" />
      <ProductStage index="04" />
      <Operator index="05" />
      <People index="06" />
      <Invitation />
    </>
  );
}
