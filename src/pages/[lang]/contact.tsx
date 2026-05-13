import { Contact } from '@/parts/contact/Contact';
import { getAllLanguageSlugs } from '@/utils/localization';

export default Contact;

export function getStaticPaths() {
  return {
    paths: getAllLanguageSlugs(),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  return {
    props: { locale: params.lang },
  };
}
