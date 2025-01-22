import { Bootcamp } from '@/parts/tutorials/Bootcamp';
import { generateBootCampData } from '@/utils/bootcamp';

export default Bootcamp;

export const getStaticProps = async () => {
  const bootcampData = generateBootCampData();
  return {
    props: {
      bootcampData,
    },
  };
};
