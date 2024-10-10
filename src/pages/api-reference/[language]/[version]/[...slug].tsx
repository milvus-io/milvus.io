import LeftNavSection from '@/parts/docs/leftNavTree';
import { useTranslation } from 'react-i18next';
import Aside from '@/components/aside';
// import { useCodeCopy } from '../hooks/doc-dom-operation';
import { markdownToHtml } from '@/utils/common';
import classes from '@/styles/docDetail.module.less';
import DocLayout from '@/components/layout/docLayout';
import DocContent from '@/parts/docs/docContent';
import { useMemo } from 'react';
import {
  generateApiMenuAndContentDataOfAllVersions,
  generateApiMenuAndContentDataOfSingleVersion,
  generateApiReferenceVersionsInfo,
} from '@/utils/apiReference';
import {
  ApiFileDateInfoType,
  ApiReferenceLanguageEnum,
  ApiReferenceRouteEnum,
  FinalMenuStructureType,
  AllMdVersionIdType,
  ApiReferenceMetaInfoEnum,
} from '@/types/docs';
import { GetStaticProps } from 'next';
import { useCopyCode } from '@/hooks/enhanceCodeBlock';
import {
  SLACK_INVITE_URL,
  GITHUB_EDIT_API_JAVA_URL,
  GITHUB_EDIT_API_PYTHON_URL,
  GITHUB_EDIT_API_GO_URL,
  GITHUB_EDIT_API_NODE_URL,
  GITHUB_EDIT_API_CSHARP_URL,
  GITHUB_EDIT_API_RESTFUL_URL,
  GITHUB_DISCUSSION_URL,
  GITHUB_BUG_REPORT_URL,
} from '@/consts/externalLinks';
import { formatApiRelativePath } from '@/utils';
import { ABSOLUTE_BASE_URL } from '@/consts';

interface ApiDetailPageProps {
  doc: string;
  currentId: string;
  menus: FinalMenuStructureType[];
  version: string;
  versions: string[];
  category: ApiReferenceRouteEnum;
  relativePath: string;
  codeList: string[];
  curCategoryContentData: AllMdVersionIdType[];
  headingContent: string;
  languageCategory: string;
  latestVersion: string;
  meta: {
    title: string;
    path: string[];
  };
}
export default function Template(props: ApiDetailPageProps) {
  const {
    doc,
    currentId,
    menus,
    version,
    category,
    versions,
    relativePath,
    codeList,
    curCategoryContentData,
    headingContent,
    languageCategory,
    latestVersion,
    meta,
  } = props;

  const { t } = useTranslation('common');
  const { title: metaTitle, path: metaPath } = meta;

  // https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md
  // Specify supported languages to fix Java doc code layout.

  useCopyCode(codeList);

  // get version links on version change
  // const getApiVersionLink = version => {
  //   const currentApiMenu = allApiMenus[category][version];
  //   const hasSamePage = currentApiMenu.some(
  //     v =>
  //       // pId: some.md  v.id: language_some.id
  //       v.id === `${category}_${pageContext.pId}`
  //   );

  //   return hasSamePage
  //     ? `/api-reference/${category}/${version}/${pageContext.pId}`
  //     : `/docs`;
  // };

  // Generate apiReferenceData.sourceUrl for final page's Edit Button.
  const apiReferenceData = useMemo(() => {
    const commonData = {
      slackPath: SLACK_INVITE_URL,
      discussPath: GITHUB_DISCUSSION_URL,
      reportPath: GITHUB_BUG_REPORT_URL,
    };
    switch (category) {
      case ApiReferenceRouteEnum.Csharp:
        const cSharpData = Object.assign(commonData, {
          editPath: `${GITHUB_EDIT_API_CSHARP_URL}${relativePath}`,
        });
        return cSharpData;
      case ApiReferenceRouteEnum.Go:
        const goData = Object.assign(commonData, {
          editPath: `${GITHUB_EDIT_API_GO_URL}${relativePath}`,
        });
        return goData;
      case ApiReferenceRouteEnum.Java:
        const javaData = Object.assign(commonData, {
          editPath: `${GITHUB_EDIT_API_JAVA_URL}${relativePath}`,
        });
        return javaData;
      case ApiReferenceRouteEnum.Node:
        const nodeData = Object.assign(commonData, {
          editPath: `${GITHUB_EDIT_API_NODE_URL}${relativePath}`,
        });
        return nodeData;
      case ApiReferenceRouteEnum.Python:
        const pyData = Object.assign(commonData, {
          editPath: `${GITHUB_EDIT_API_PYTHON_URL}${relativePath}`,
        });
        return pyData;
      default:
        const restfulData = Object.assign(commonData, {
          editPath: `${GITHUB_EDIT_API_RESTFUL_URL}${relativePath}`,
        });
        return restfulData;
    }
  }, [category, relativePath, version]);

  const { pageTitle, absoluteUrl, pageDesc } = useMemo(() => {
    let suffix = '';
    switch (languageCategory) {
      case ApiReferenceRouteEnum.Csharp:
        suffix = `${ApiReferenceMetaInfoEnum.Csharp} sdk ${version}`;
        break;
      case ApiReferenceRouteEnum.Go:
        suffix = `${ApiReferenceMetaInfoEnum.Go} sdk ${version}`;
        break;
      case ApiReferenceRouteEnum.Java:
        suffix = `${ApiReferenceMetaInfoEnum.Java} sdk ${version}`;
        break;
      case ApiReferenceRouteEnum.Node:
        suffix = `${ApiReferenceMetaInfoEnum.Node} sdk ${version}`;
        break;
      case ApiReferenceRouteEnum.Python:
        suffix = `${ApiReferenceMetaInfoEnum.Python} sdk ${version}`;
        break;
      default:
        suffix = `${ApiReferenceMetaInfoEnum.Restful} sdk ${version}`;
        break;
    }

    const pageTitle = metaPath
      ? `${headingContent} - Milvus ${suffix}/${metaPath}`
      : `${headingContent} - Milvus ${suffix}`;
    const absoluteUrl = `${ABSOLUTE_BASE_URL}/api-reference/${languageCategory}${relativePath}`;
    const pageDesc = metaPath
      ? `${headingContent} - Milvus Documentation ${suffix}/${metaPath}`
      : `${headingContent} - Milvus Documentation ${suffix}`;

    return {
      pageTitle,
      absoluteUrl,
      pageDesc,
    };
  }, [headingContent, metaPath, languageCategory, relativePath, version]);

  return (
    <DocLayout
      seo={{
        title: pageTitle,
        desc: pageDesc,
        url: absoluteUrl,
      }}
      version={version}
      latestVersion={latestVersion}
      left={
        <LeftNavSection
          tree={menus}
          className={classes.docMenu}
          version={version}
          versions={versions}
          type="api"
          homepageConf={{
            label: '< Docs',
            link: '/docs',
          }}
          currentMdId={currentId}
          latestVersion={version}
          mdListData={curCategoryContentData}
          category={category}
          disableSearch={true}
        />
      }
      center={
        <section className={classes.docDetailContainer}>
          <div className={classes.contentSection}>
            <DocContent
              version={version}
              htmlContent={doc}
              mdId={currentId}
              commitPath={apiReferenceData.editPath}
              type="api"
            />
          </div>

          <div className={classes.asideSection}>
            <Aside
              apiReferenceData={apiReferenceData}
              category="api"
              classes={{
                root: classes.rightAnchorTreeWrapper,
              }}
              disableLanguageSelector={true}
            />
          </div>
        </section>
      }
    />
  );
}

export const getStaticPaths = () => {
  const apiData = generateApiReferenceVersionsInfo();

  const result = apiData
    .map(data => {
      const { language, versions } = data;
      const ApiDataOfCurLang = versions.map(version =>
        generateApiMenuAndContentDataOfSingleVersion({
          version,
          language,
        })
      );
      return {
        language,
        versions,
        data: ApiDataOfCurLang,
      };
    })
    // Restful paths have been moved to api-reference/restful/[version]/[...slug].tsx
    .filter(item => item.language !== ApiReferenceLanguageEnum.Restful);

  let routers: ApiFileDateInfoType[] = [];
  result.forEach(({ data }) => {
    data.forEach(v => {
      routers = routers.concat(v.contentList);
    });
  });

  /**
   * 1. /pymilvus/v2.4.x/DataImport/LocalBulkWriter/append_row.md
   * 2. /pymilvus/v2.4.x/append_rows.md
   */
  const paths = routers.map(v => {
    const {
      frontMatter: { id, parentIds, category, version },
    } = v;
    const slug = [...parentIds, id];
    return {
      params: {
        language: category,
        version,
        slug,
      },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { version } = context.params;
  const languageCategory: ApiReferenceRouteEnum = context.params
    .language as ApiReferenceRouteEnum;

  const slug = context.params.slug as string[];
  const routeCategoryToLanguage: Record<
    ApiReferenceRouteEnum,
    ApiReferenceLanguageEnum
  > = {
    [ApiReferenceRouteEnum.Csharp]: ApiReferenceLanguageEnum.Csharp,
    [ApiReferenceRouteEnum.Go]: ApiReferenceLanguageEnum.Go,
    [ApiReferenceRouteEnum.Java]: ApiReferenceLanguageEnum.Java,
    [ApiReferenceRouteEnum.Node]: ApiReferenceLanguageEnum.Node,
    [ApiReferenceRouteEnum.Python]: ApiReferenceLanguageEnum.Python,
    [ApiReferenceRouteEnum.Restful]: ApiReferenceLanguageEnum.Restful,
  };

  const apiData = generateApiReferenceVersionsInfo();
  const { versions, latestVersion } =
    apiData.find(
      v => v.language === routeCategoryToLanguage[languageCategory]
    ) || {};
  const curCategoryData = generateApiMenuAndContentDataOfAllVersions({
    language: routeCategoryToLanguage[languageCategory],
    withContent: true,
  });

  const { menuData, contentList: contentData } =
    curCategoryData.find(v => v.version === version) || {};

  const { frontMatter, content: apiContent } =
    contentData.find(v => {
      const {
        frontMatter: { id, parentIds },
      } = v;
      const targetSlug = slug.join('/');
      const sourceSlug = [...parentIds, id].join('/');
      return targetSlug === sourceSlug;
    }) || {};

  const { tree: doc, codeList } = markdownToHtml(apiContent || '');

  const headingRegex = /^#\s+(.*)$/m;
  const match = headingRegex.exec(apiContent);
  const firstHeading = match ? match[1] : null;

  const curCategoryContentDataOfAllVersion =
    generateApiMenuAndContentDataOfAllVersions({
      language: routeCategoryToLanguage[languageCategory],
      withContent: false,
    }).map(v => ({
      version: v.version,
      mds: v.contentList.map(c =>
        formatApiRelativePath(c.frontMatter.relativePath)
      ),
    }));

  const metaPathList = slug.slice();
  const metaTitle = metaPathList.pop();
  const metaPath = metaPathList.join('/');

  return {
    props: {
      doc,
      codeList,
      currentId: slug.join('-'),
      menus: menuData,
      version: version,
      latestVersion,
      locale: 'en',
      category: languageCategory,
      versions: versions,
      relativePath: frontMatter.relativePath,
      curCategoryContentData: curCategoryContentDataOfAllVersion,
      headingContent: firstHeading || 'Milvus API Reference',
      languageCategory,
      meta: {
        title: metaTitle,
        path: metaPath,
      },
    },
  };
};
