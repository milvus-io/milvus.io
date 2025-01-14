import { getAllLanguageSlugs } from '@/i18n';
import { Bootcamp } from '@/parts/tutorials/Bootcamp';
import { generateBootCampData } from '@/utils/bootcamp';

export default Bootcamp;

export function getStaticPaths() {
  return {
    paths: getAllLanguageSlugs(),
    fallback: false,
  };
}

export const getStaticProps = async ({ params }) => {
  const bootcampData = generateBootCampData();
  return {
    props: {
      bootcampData,
      locale: params.lang,
    },
  };
};
