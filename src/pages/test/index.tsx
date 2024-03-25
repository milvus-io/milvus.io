import { NextPage, GetStaticProps } from 'next';
import {
  generateDocVersionInfo,
  generateHomePageDataOfSingleVersion,
  generateMenuDataOfCurrentVersion,
} from '@/utils/docs';
import {
  generateApiReferenceVersionsInfo,
  generateApiMenuAndContentDataOfSingleVersion,
  generateApiMenuAndContentDataOfAllVersions,
} from '@/utils/apiReference';
import { ApiReferenceLanguageEnum } from '@/types/docs';

export default function TestPage(props: any) {
  const { data } = props;

  console.log(data);
  return <div className="">test page</div>;
}

export const getStaticProps: GetStaticProps = async context => {
  const { latestVersion } = generateDocVersionInfo();

  const info = generateApiMenuAndContentDataOfAllVersions({
    language: ApiReferenceLanguageEnum.Python,
  });

  return {
    props: {
      data: info || [],
    },
  };
};
