import {
  generateDocVersionInfo,
  generateAllContentDataOfSingleVersion,
  generateMenuDataOfCurrentVersion,
  generateAllContentDataOfAllVersion,
} from '@/utils/docs';
import { GetStaticProps } from 'next';
import { generateApiMenuDataOfCurrentVersion } from '@/utils/apiReference';
import { LanguageEnum } from '@/components/language-selector';
import { DocDetailPage } from '@/components/localization/DocDetail';

export default DocDetailPage;

export const createDocDetailProps = (lang: LanguageEnum, version = '') => {
  const getPageStaticPaths = () => {
    const { latestVersion } = generateDocVersionInfo();
    const currentVersion = version || latestVersion;
    const latestDocContentList = generateAllContentDataOfSingleVersion({
      version: currentVersion,
      lang,
    });

    const paths = latestDocContentList.map(v => ({
      params: { id: v.frontMatter.id },
    }));

    return {
      paths,
      fallback: false,
    };
  };

  const getPageStaticProps: GetStaticProps = async context => {
    const { params } = context;

    const id = params.id as string;
    const { versions, latestVersion } = generateDocVersionInfo();
    const currentVersion = version || latestVersion;

    const docMenu = generateMenuDataOfCurrentVersion({
      docVersion: currentVersion,
      lang,
    });

    // used to detect has same page of current md
    const mdListData = generateAllContentDataOfAllVersion();

    // xxx.md of latest version
    const outerApiMenuItem = generateApiMenuDataOfCurrentVersion({
      docVersion: currentVersion,
    });
    const menu = [...docMenu, outerApiMenuItem];

    const docDetailContentList = generateAllContentDataOfSingleVersion({
      version: currentVersion,
      withContent: true,
      lang,
    });

    const {
      content: docDetailContent,
      frontMatter,
      editPath,
      propsInfo,
    } = docDetailContentList.find(v => v.frontMatter.id === id);

    const { codeList, anchorList } = propsInfo;
    const headingContent = anchorList?.[0]?.label;

    return {
      props: {
        homeData: {
          tree: docDetailContent,
          codeList,
          headingContent,
          anchorList,
          summary: frontMatter.summary || '',
          editPath,
          frontMatter,
        },
        blog: null,
        version: currentVersion,
        latestVersion,
        lang,
        versions,
        menus: menu,
        id,
        mdListData,
      },
    };
  };

  return { getPageStaticPaths, getPageStaticProps };
};
