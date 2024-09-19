import matter from 'gray-matter';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import clsx from 'clsx';

import DocLayout from '@/components/layout/docLayout';
import { components } from '@/components/mdx';
import { ABSOLUTE_BASE_URL } from '@/consts';
import LeftNavSection from '@/parts/docs/leftNavTree';
import {
  AllMdVersionIdType,
  ApiFileDateInfoType,
  ApiReferenceLanguageEnum,
  ApiReferenceMetaInfoEnum,
  ApiReferenceRouteEnum,
  FinalMenuStructureType,
} from '@/types/docs';
import { formatApiRelativePath } from '@/utils';
import {
  getVariablesFromMDX,
  rehypeCodeBlockHighlightPlugin,
} from '@/utils/mdx';
import {
  generateRestfulMenuAndContentDataOfAllVersions,
  generateRestfulMenuAndContentDataOfSingleVersion,
  generateRestfulVersionsInfo,
  SPLIT_FLAG,
} from '@/utils/restful';

import classes from '@/styles/docDetail.module.less';
import styles from '@/styles/restful.module.less';

export default function RestfulApiReference(props: {
  mdxSource: MDXRemoteSerializeResult;
  headingContent: string;
  version: string;
  latestVersion: string;
  versions: string[];
  category: ApiReferenceRouteEnum;
  languageCategory: string;
  relativePath: string;
  meta: {
    title: string;
    path: string[];
  };
  menus: FinalMenuStructureType[];
  currentId: string;
  curCategoryContentData: AllMdVersionIdType[];
}) {
  const {
    mdxSource,
    version,
    latestVersion,
    versions,
    meta,
    headingContent,
    category,
    languageCategory,
    relativePath,
    menus,
    currentId,
    curCategoryContentData,
  } = props;
  const { title: metaTitle, path: metaPath } = meta;
  const suffix = `${ApiReferenceMetaInfoEnum.Restful} sdk ${version}`;

  const pageTitle = metaPath
    ? `${headingContent} - Milvus ${suffix}/${metaPath}`
    : `${headingContent} - Milvus ${suffix}`;
  const absoluteUrl = `${ABSOLUTE_BASE_URL}/api-reference/${languageCategory}${relativePath}`;
  const pageDesc = metaPath
    ? `${headingContent} - Milvus Documentation ${suffix}/${metaPath}`
    : `${headingContent} - Milvus Documentation ${suffix}`;

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
            <div className={clsx(styles.restfulContainer)}>
              {mdxSource && (
                <MDXRemote {...mdxSource} components={components} />
              )}
            </div>
          </div>
        </section>
      }
    />
  );
}

export async function getStaticPaths() {
  const restfulInfo = generateRestfulVersionsInfo();
  const result = restfulInfo.map(data => {
    const { language, versions } = data;
    const ApiDataOfCurLang = versions.map(version =>
      generateRestfulMenuAndContentDataOfSingleVersion({
        version,
        language,
      })
    );
    return {
      language,
      versions,
      data: ApiDataOfCurLang,
    };
  });

  let routers: ApiFileDateInfoType[] = [];
  result.forEach(({ data }) => {
    data.forEach(v => {
      routers = routers.concat(v.contentList);
    });
  });

  const paths = routers.map(v => {
    const {
      frontMatter: { id, parentIds, version },
    } = v;
    const slug = [...parentIds, id.replace('.mdx', '.md')];
    return {
      params: {
        version,
        slug,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { version, slug } = params;
  const restfulInfo = generateRestfulVersionsInfo();
  const { versions, latestVersion } =
    restfulInfo.find(v => v.language === ApiReferenceLanguageEnum.Restful) ||
    {};
  const curCategoryData = generateRestfulMenuAndContentDataOfAllVersions({
    language: ApiReferenceLanguageEnum.Restful,
    withContent: true,
  });

  const { menuData, contentList: contentData } =
    curCategoryData.find(v => v.version === version) || {};
  const { frontMatter, content: markdown } =
    contentData.find(v => {
      const {
        frontMatter: { id, parentIds },
      } = v;
      const targetSlug = slug.join('/');
      const sourceSlug = [...parentIds, id].join('/');
      return targetSlug === sourceSlug;
    }) || {};
  const { data = {}, content } = matter(markdown);

  const { exports } = await getVariablesFromMDX(content);
  const mdxSource = await serialize(content, {
    scope: exports,
    mdxOptions: {
      rehypePlugins: [rehypeCodeBlockHighlightPlugin],
    },
  });

  const headingRegex = /^#\s+(.*)$/m;
  const match = headingRegex.exec(content);
  const firstHeading = match ? match[1] : null;

  const curCategoryContentDataOfAllVersion =
    generateRestfulMenuAndContentDataOfAllVersions({
      language: ApiReferenceLanguageEnum.Restful,
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
      version: params.version,
      slug: params.slug,
      mdxSource,

      currentId: slug.join(SPLIT_FLAG),
      menus: menuData,
      latestVersion,
      locale: 'en',
      category: ApiReferenceRouteEnum.Restful,
      languageCategory: ApiReferenceLanguageEnum.Restful,
      versions: versions,
      relativePath: frontMatter.relativePath,
      curCategoryContentData: curCategoryContentDataOfAllVersion,
      headingContent: firstHeading || 'Milvus API Reference',
      meta: {
        title: metaTitle,
        path: metaPath,
      },
    },
  };
}
