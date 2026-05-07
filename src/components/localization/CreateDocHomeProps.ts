import { LanguageEnum } from '@/types/localization';
import { generateApiMenuDataOfCurrentVersion } from '@/utils/apiReference';
import { generateAllBlogContentList } from '@/utils/blogs';
import {
  generateAllContentDataOfAllVersion,
  generateDocVersionInfo,
  generateHomePageDataOfSingleVersion,
  generateMenuDataOfCurrentVersion,
  getAvailableLanguagesForDoc,
} from '@/utils/docs';
import { getDocHreflangUrls } from '@/components/localization/utils';
import {
  stripMdListDataForClient,
  stripMenuForClient,
} from '@/utils/client-doc-data';

export const createDocHomeProps = (lang: LanguageEnum, version = '') => {
  const getPageStaticProps = async () => {
    const { versions, latestVersion } = generateDocVersionInfo();
    const currentVersion = version || latestVersion;
    const { content: homeContent } = generateHomePageDataOfSingleVersion({
      version: currentVersion,
      lang,
    });
    const { frontMatter: latestBlogData } = generateAllBlogContentList()[0];
    const docMenu = generateMenuDataOfCurrentVersion({
      docVersion: currentVersion,
      lang,
    });
    const outerApiMenuItem = generateApiMenuDataOfCurrentVersion({
      docVersion: currentVersion,
    });
    const menu = [...docMenu, outerApiMenuItem];

    // used to detect has same page of current md
    const mdListData = generateAllContentDataOfAllVersion();

    // languages that have the doc homepage for hreflang tags
    const availableLanguages = getAvailableLanguagesForDoc({
      version: currentVersion,
    });
    const hreflangUrls = getDocHreflangUrls({
      version: currentVersion,
      latestVersion,
      availableLanguages,
    });

    return {
      props: {
        homeData: homeContent,
        isHome: true,
        version: currentVersion,
        latestVersion,
        lang,
        versions,
        blog: latestBlogData,
        menus: stripMenuForClient(menu),
        mdListData: stripMdListDataForClient(mdListData, 'home'),
        hreflangUrls,
      },
    };
  };

  return getPageStaticProps;
};
