import { LanguageEnum } from '@/components/language-selector';
import { generateApiMenuDataOfCurrentVersion } from '@/utils/apiReference';
import { generateAllBlogContentList } from '@/utils/blogs';
import {
  generateAllContentDataOfAllVersion,
  generateDocVersionInfo,
  generateHomePageDataOfSingleVersion,
  generateMenuDataOfCurrentVersion,
} from '@/utils/docs';

export const createDocHomeProps = (lang: LanguageEnum) => {
  const getPageStaticProps = async () => {
    const { versions, latestVersion } = generateDocVersionInfo();
    const { content: homeContent, filePath } =
      generateHomePageDataOfSingleVersion({
        version: latestVersion,
        lang,
      });
    const { frontMatter: latestBlogData } = generateAllBlogContentList()[0];
    const docMenu = generateMenuDataOfCurrentVersion({
      docVersion: latestVersion,
      lang,
    });
    const outerApiMenuItem = generateApiMenuDataOfCurrentVersion({
      docVersion: latestVersion,
    });
    const menu = [...docMenu, outerApiMenuItem];

    // used to detect has same page of current md
    const mdListData = generateAllContentDataOfAllVersion();

    return {
      props: {
        homeData: homeContent,
        isHome: true,
        version: latestVersion,
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
