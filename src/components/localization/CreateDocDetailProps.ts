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
import {
  getDocHreflangUrls,
  getDocCanonicalUrl,
} from '@/components/localization/utils';
import {
  stripMdListDataForClient,
  stripMenuForClient,
} from '@/utils/client-doc-data';

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
    const hreflangUrls = getDocHreflangUrls({
      version: currentVersion,
      latestVersion,
      docId: id,
      availableLanguages,
    });
    const canonicalUrl = getDocCanonicalUrl({
      lang,
      version: currentVersion,
      latestVersion,
      docId: id,
    });

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
        menus: stripMenuForClient(menu),
        id,
        mdListData: stripMdListDataForClient(mdListData, id),
        hreflangUrls,
        canonicalUrl,
      },
    };
  };

  return { getPageStaticPaths, getPageStaticProps };
};
