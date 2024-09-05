import {
  generateAllContentDataOfAllVersion,
  generateAllContentDataOfSingleVersion,
  generateContentDataOfSingleFile,
  generateDocVersionInfo,
  generateMenuDataOfCurrentVersion,
} from '@/utils/docs';
import { GetStaticProps } from 'next';
import { generateApiMenuDataOfCurrentVersion } from '@/utils/apiReference';
import { LanguageEnum } from '@/components/language-selector';

export const createDocSlugProps = (lang: LanguageEnum) => {
  const isEN = lang === LanguageEnum.ENGLISH;

  const getPageStaticPaths = () => {
    const { restVersions } = generateDocVersionInfo();
    const contentList = restVersions.map(v => ({
      version: v,
      data: generateAllContentDataOfSingleVersion({ version: v, lang }),
    }));

    const paths = isEN
      ? contentList.reduce((acc, cur) => {
          const { version, data } = cur;
          const paths = data.map(d => {
            return {
              params: { slug: [version, d.frontMatter.id] },
            };
          });
          acc = acc.concat(paths);
          return acc;
        }, [])
      : [{ params: { slug: ['v2.4.x', 'overview.md'] } }];

    return {
      paths,
      fallback: false,
    };
  };

  const getPageStaticProps: GetStaticProps = async context => {
    const { params } = context;
    const [version, id] = params.slug as string[];

    console.log('slug params', JSON.stringify(params.slug));

    const { versions, latestVersion } = generateDocVersionInfo();
    const {
      content: docDetailContent,
      frontMatter,
      editPath,
      propsInfo,
    } = generateContentDataOfSingleFile({
      version,
      id,
      withContent: true,
      lang,
    });

    // used to detect has same page of current md
    const mdListData = generateAllContentDataOfAllVersion();

    const docMenu = generateMenuDataOfCurrentVersion({
      docVersion: version,
      lang,
    });
    const outerApiMenuItem = generateApiMenuDataOfCurrentVersion({
      docVersion: version,
    });
    const menu = [...docMenu, outerApiMenuItem];

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
        isHome: false,
        blog: null,
        version,
        lang,
        versions,
        latestVersion,
        menus: menu,
        id,
        mdListData,
      },
    };
  };

  return {
    getPageStaticPaths,
    getPageStaticProps,
  };
};
