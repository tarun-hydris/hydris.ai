import { Aperture, Splash } from '../components/sections/Chapters.jsx';
import { Beyond, Close, Hydris, Knowledge, Memory, Products } from '../components/sections/Story.jsx';
import { IMAGERY } from '../lib/content.js';

/* The Home story follows the Hydris platform film, one question at a time:
   I    why water matters (the mark filled with water, then the plant from above)
   II   why the problem is knowledge as much as water
   III  what Hydris is: plant data, water science and team experience, in one place
   IV   the three products, See, Understand, Act, each with a live demo
   V    the knowledge a plant keeps from one shift to the next
   VI   the reach beyond one plant: Stewardship and Portfolio
   VII  the purpose, and the people it is for */
export default function Home() {
  return (
    <>
      <Splash />
      <Aperture {...IMAGERY.aperture} />
      <Knowledge index="02" />
      <Hydris index="03" />
      <Products index="04" />
      <Memory index="05" />
      <Beyond index="06" />
      <Close />
    </>
  );
}
