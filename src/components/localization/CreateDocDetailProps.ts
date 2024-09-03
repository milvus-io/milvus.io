import {
  generateDocVersionInfo,
  generateAllContentDataOfSingleVersion,
  generateHomePageDataOfSingleVersion,
  generateMenuDataOfCurrentVersion,
  generateAllContentDataOfAllVersion,
} from '@/utils/docs';
import { GetStaticProps } from 'next';
import { generateApiMenuDataOfCurrentVersion } from '@/utils/apiReference';
import { generateAllBlogContentList } from '@/utils/blogs';
import { LanguageEnum } from '@/components/language-selector';
import { DocDetailPage } from '@/components/localization/DocDetail';

export default DocDetailPage;

export const createDocDetailProps = (lang: LanguageEnum) => {
  const isEN = lang === LanguageEnum.ENGLISH;

  const getPageStaticPaths = () => {
    const { latestVersion, restVersions } = generateDocVersionInfo();
    const latestDocContentList = generateAllContentDataOfSingleVersion({
      version: latestVersion,
      lang,
    });

    /**
     * Detail page path: latest version
     */
    const paths = latestDocContentList.map(v => ({
      params: { id: v.frontMatter.id },
    }));

    /**
     * Home page path: previous versions
     */
    const homePagePaths = isEN
      ? restVersions.map(v => ({
          params: { id: v },
        }))
      : [];

    return {
      paths: [...paths, ...homePagePaths],
      fallback: false,
    };
  };

  const getPageStaticProps: GetStaticProps = async context => {
    const { params } = context;
    const VERSION_REG = /^v\d/;

    const id = params.id as string;
    const { versions, latestVersion } = generateDocVersionInfo();
    const version = VERSION_REG.test(id) ? id : latestVersion;

    const docMenu = generateMenuDataOfCurrentVersion({
      docVersion: version,
      lang,
    });

    // used to detect has same page of current md
    const mdListData = generateAllContentDataOfAllVersion();

    // home page data
    if (VERSION_REG.test(id)) {
      const {
        content: homepageContent,
        frontMatter,
        propsInfo,
      } = generateHomePageDataOfSingleVersion({ version });
      const outerApiMenuItem = generateApiMenuDataOfCurrentVersion({
        docVersion: version,
      });
      const menu = [...docMenu, outerApiMenuItem];
      const { frontMatter: latestBlogData } = generateAllBlogContentList()[0];

      const { codeList, headingContent, anchorList } = propsInfo;

      return {
        props: {
          homeData: {
            tree: homepageContent,
            codeList: codeList || [],
            headingContent: headingContent || '',
            anchorList: anchorList || [],
            summary: frontMatter?.summary || '',
            editPath: '',
            frontMatter: frontMatter,
          },
          isHome: true,
          blog: latestBlogData,
          version,
          lang,
          versions,
          latestVersion,
          menus: menu,
          id: 'home.md',
          mdListData,
        },
      };
    }

    // xxx.md of latest version
    const outerApiMenuItem = generateApiMenuDataOfCurrentVersion({
      docVersion: latestVersion,
    });
    const menu = [...docMenu, outerApiMenuItem];

    const docDetailContentList = generateAllContentDataOfSingleVersion({
      version: latestVersion,
      withContent: true,
      lang,
    });

    const {
      content: docDetailContent,
      frontMatter,
      editPath,
      propsInfo,
    } = docDetailContentList.find(v => v.frontMatter.id === id);

    const { codeList, headingContent, anchorList } = propsInfo;

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
        isHome: false,
        version: latestVersion,
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
