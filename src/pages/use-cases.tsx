import { fetchUseCases } from '@/http/useCase';
import { UseCase } from '@/parts/intro/UseCase';
import { GetStaticProps } from 'next';

export default UseCase;

export const getStaticProps: GetStaticProps = async () => {
  const useCaseList = await fetchUseCases();
  return {
    props: {
      useCaseList,
    },
  };
};
