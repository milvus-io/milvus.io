import {
  generateDocVersionInfo,
  generateAllContentDataOfSingleVersion,
  generateMenuDataOfCurrentVersion,
  generateAllContentDataOfAllVersion,
  getAvailableLanguagesForDoc,
} from '@/utils/docs';
import { GetStaticProps } from 'next';
import { generateApiMenuDataOfCurrentVersion } from '@/utils/apiReference';
import { LanguageEnum } from '@/types/localization';
import { DocDetailPage } from '@/components/localization/DocDetail';

export default DocDetailPage;

export const createDocDetailProps = (lang: LanguageEnum, version = '') => {
  const getPageStaticPaths = () => {
    const { latestVersion } = generateDocVersionInfo();
    const currentVersion = version || latestVersion;

    // Only pre-generate pages for the latest version at build time.
    // Older versions will be generated on-demand via fallback: 'blocking'.
    const isLatestVersion = currentVersion === latestVersion;
    let paths = [];

    if (isLatestVersion) {
      const latestDocContentList = generateAllContentDataOfSingleVersion({
        version: currentVersion,
        lang,
      });

      paths = latestDocContentList.map(v => ({
        params: { id: v.frontMatter.id },
      }));
    }

    return {
      paths,
      fallback: 'blocking',
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

    // languages that have this doc for hreflang tags
    const availableLanguages = getAvailableLanguagesForDoc({
      version: currentVersion,
      docId: id,
    });

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

    const docData = docDetailContentList.find(v => v.frontMatter.id === id);

    // Return 404 if document not found (e.g. invalid id in fallback mode)
    if (!docData) {
      return { notFound: true };
    }

    const {
      content: docDetailContent,
      frontMatter,
      editPath,
      propsInfo,
    } = docData;

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
        availableLanguages,
      },
    };
  };

  return { getPageStaticPaths, getPageStaticProps };
};
