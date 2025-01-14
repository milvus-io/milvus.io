import { LanguageEnum } from '@/types/localization';
import { generateApiMenuDataOfCurrentVersion } from '@/utils/apiReference';
import { generateAllBlogContentList } from '@/utils/blogs';
import {
  generateAllContentDataOfAllVersion,
  generateDocVersionInfo,
  generateHomePageDataOfSingleVersion,
  generateMenuDataOfCurrentVersion,
} from '@/utils/docs';

export const createDocHomeProps = (lang: LanguageEnum, version = '') => {
  const getPageStaticProps = async () => {
    const { versions, latestVersion } = generateDocVersionInfo();
    const currentVersion = version || latestVersion;
    const { content: homeContent, filePath } =
      generateHomePageDataOfSingleVersion({
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

    return {
      props: {
        homeData: homeContent,
        isHome: true,
        version: currentVersion,
        latestVersion,
        lang,
        versions,
        blog: latestBlogData,
        menus: menu,
        mdListData,
      },
    };
  };

  return getPageStaticProps;
};
