import { getAllLanguageSlugs } from '../../i18n';
import Page from '../index';
export default Page;

export async function getStaticPaths() {
  const paths = getAllLanguageSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const language = params.lang;
  return {
    props: {
      language,
    },
  };
}
