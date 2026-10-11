import { Change, Invitation, Opening, Operator, People, ProductStage } from '../components/sections/Chapters.jsx';
import Investigation from '../components/sections/Investigation.jsx';

/* One journey in seven chapters: the living system, the change, the investigation, the product,
   the operator, the people, and the invitation. Technical depth lives on Platform. */
export default function Home() {
  return (
    <>
      <Opening />
      <Change index="02" />
      <Investigation index="03" />
      <ProductStage index="04" />
      <Operator index="05" />
      <People index="06" />
      <Invitation />
    </>
  );
}
