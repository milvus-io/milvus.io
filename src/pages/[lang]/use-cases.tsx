import { GetStaticProps } from 'next';
import { fetchUseCases } from '@/http/useCase';
import { UseCase } from '@/parts/intro/UseCase';
import { getAllLanguageSlugs } from '@/i18n';

export default UseCase;

export function getStaticPaths() {
  return {
    paths: getAllLanguageSlugs(),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const useCaseList = await fetchUseCases();
  return {
    props: {
      useCaseList,
      locale: params.lang,
    },
  };
};
