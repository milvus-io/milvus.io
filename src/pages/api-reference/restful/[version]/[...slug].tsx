import { useMemo } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import clsx from 'clsx';

import DocLayout from '@/components/layout/docLayout';
import JsonLd from '@/components/JsonLd';
import { buildSchema } from '@/schema';
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
  getRehypeHeadingTagPlugin,
  rehypeCodeBlockHighlightPlugin,
} from '@/utils/mdx';
import {
  generateRestfulMenuAndContentDataOfAllVersions,
  generateRestfulMenuAndContentDataOfSingleVersion,
  generateRestfulVersionsInfo,
  generateSingleRestfulDocContent,
  SPLIT_FLAG,
} from '@/utils/restful';
import {
  stripMdListDataForClient,
  stripMenuForClient,
} from '@/utils/client-doc-data';
import {
  writeSitemapSegment,
  type ContentSitemapEntry,
} from '@/utils/doc-sitemap-segments';
import { getContentLastModified } from '@/server/content-freshness';

import classes from '@/styles/docDetail.module.css';
import styles from '@/styles/restful.module.css';
import Breadcrumb from '@/components/breadcrumb';
import { useBreadcrumbLabels } from '@/hooks/use-breadcrumb-lables';
import { getApiCanonicalUrl } from '@/components/localization/utils';

const toRestfulRouteMd = (path: string) => path.replace(/\.mdx$/, '.md');

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
  lastModified?: string | null;
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
    lastModified,
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

  const latestVersionData = curCategoryContentData.find(
    v => v.version === latestVersion
  );
  // Use route category ('restful') not languageCategory ('milvus-restful') for URL,
  // and convert .mdx extension to .md to match the actual route.
  const routeRelativePath = relativePath.replace(/\.mdx$/, '.md');
  // mds are built from the .mdx source paths; normalize them to the .md route
  // form too, otherwise no archived page ever matches latest and every
  // archived restful page self-canonicalizes.
  const canonicalUrl = getApiCanonicalUrl({
    languageCategory: category,
    version,
    latestVersion,
    relativePath: routeRelativePath,
    latestVersionMds: latestVersionData?.mds.map(toRestfulRouteMd),
  });

  const activeLabels = useBreadcrumbLabels({
    currentId,
    menu: menus,
  });

  const selfRouteUrl = `${ABSOLUTE_BASE_URL}/api-reference/${category}${routeRelativePath}`;
  const ldSchemas = useMemo(() => {
    const breadcrumb = buildSchema('breadcrumb', [
      { name: 'Home', url: ABSOLUTE_BASE_URL },
      { name: 'Docs', url: `${ABSOLUTE_BASE_URL}/docs` },
      {
        name: 'API Reference',
        url: `${ABSOLUTE_BASE_URL}/api-reference/restful/${version}/About.md`,
      },
      { name: headingContent, url: selfRouteUrl },
    ]);
    if (selfRouteUrl !== canonicalUrl) return [breadcrumb];
    return [
      buildSchema('techArticle', {
        absoluteUrl: canonicalUrl,
        title: pageTitle,
        desc: pageDesc,
        modifiedTime: lastModified,
        inLanguage: 'en',
        softwareVersion: version,
        keywords: ['Milvus', 'RESTful API', 'HTTP', 'API Reference'],
      }),
      breadcrumb,
    ];
  }, [
    version,
    headingContent,
    selfRouteUrl,
    canonicalUrl,
    pageTitle,
    pageDesc,
    lastModified,
  ]);

  return (
    <>
      <JsonLd schema={ldSchemas} />
      <DocLayout
      seo={{
        title: pageTitle,
        desc: pageDesc,
        url: selfRouteUrl,
        canonicalUrl,
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
            <Breadcrumb
              list={[
                {
                  label: 'Docs',
                  href:
                    version === latestVersion ? '/docs' : `/docs/${version}`,
                },
                {
                  label: 'API Reference',
                  href: `/api-reference/restful/${version}/About.md`,
                },
                ...activeLabels.map(v => ({
                  label: v,
                })),
              ]}
              lang={'en'}
              className={styles.breadcrumbContainer}
            />
            <article className={clsx(styles.restfulContainer)}>
              {mdxSource && (
                <MDXRemote {...mdxSource} components={components} />
              )}
            </article>
          </div>
        </section>
      }
      />
    </>
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

  // Only the latest version is prerendered at build time; archived versions are
  // generated on demand via the blocking fallback and cached by the running
  // server, which keeps build time and memory low.
  const latestVersion = restfulInfo.find(
    v => v.language === ApiReferenceLanguageEnum.Restful
  )?.latestVersion;

  // Latest-version ids in the same form the page passes to getApiCanonicalUrl,
  // so the sitemap can skip archived pages that canonicalize to latest.
  const latestVersionMds = routers
    .filter(v => v.frontMatter.version === latestVersion)
    .map(v =>
      toRestfulRouteMd(formatApiRelativePath(v.frontMatter.relativePath))
    );

  const corePaths: { params: { version: string; slug: string[] } }[] = [];
  const sitemapPages: ContentSitemapEntry[] = [];

  routers.forEach(v => {
    const {
      frontMatter: { id, parentIds, version },
    } = v;
    const slug = [...parentIds, id.replace('.mdx', '.md')];
    const loc = `/api-reference/restful/${version}/${slug.join('/')}`;
    const onDemand = version !== latestVersion;

    if (!onDemand) {
      corePaths.push({ params: { version, slug } });
    } else {
      // Only self-canonical archived pages belong in the sitemap.
      const canonicalUrl = getApiCanonicalUrl({
        languageCategory: ApiReferenceRouteEnum.Restful,
        version,
        latestVersion,
        relativePath: toRestfulRouteMd(v.frontMatter.relativePath),
        latestVersionMds,
      });
      if (canonicalUrl !== `${ABSOLUTE_BASE_URL}${loc}`) return;
    }
    sitemapPages.push({
      loc,
      lastmod: getContentLastModified(v.sourcePath, v.frontMatter),
      onDemand,
    });
  });

  writeSitemapSegment('api__restful', sitemapPages);

  return {
    paths: corePaths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const { version, slug } = params;
  const restfulInfo = generateRestfulVersionsInfo();
  const { versions, latestVersion } =
    restfulInfo.find(v => v.language === ApiReferenceLanguageEnum.Restful) ||
    {};
  // Load only the requested version's menu + a frontmatter-only content index,
  // then read the single matched .mdx file, so an on-demand render does not pull
  // every version's content into memory.
  const { menuData, contentList: contentData } =
    generateRestfulMenuAndContentDataOfSingleVersion({
      language: ApiReferenceLanguageEnum.Restful,
      version,
      withContent: false,
    }) as any;

  // Under the blocking fallback getStaticProps runs for arbitrary params, so an
  // unknown version/slug must 404 instead of throwing during destructuring.
  if (!contentData) {
    return { notFound: true };
  }

  const matchedDoc = contentData.find(v => {
    const {
      frontMatter: { id, parentIds },
    } = v;
    const targetSlug = slug.join('/');
    const sourceSlug = [...parentIds, id].join('/');
    return targetSlug === sourceSlug;
  });

  if (!matchedDoc) {
    return { notFound: true };
  }

  const { frontMatter } = matchedDoc;
  const content = generateSingleRestfulDocContent({
    language: ApiReferenceLanguageEnum.Restful,
    relativePath: frontMatter.relativePath,
  });

  const { exports } = await getVariablesFromMDX(content);
  const mdxSource = await serialize(content, {
    scope: exports,
    mdxOptions: {
      rehypePlugins: [
        rehypeCodeBlockHighlightPlugin,
        getRehypeHeadingTagPlugin({ betaTag: frontMatter.beta }),
      ],
    },
    blockJS: false,
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
  const lastModified = matchedDoc.sourcePath
    ? getContentLastModified(matchedDoc.sourcePath, frontMatter)
    : undefined;

  const currentApiMdId = formatApiRelativePath(frontMatter.relativePath);

  return {
    props: {
      version: params.version,
      slug: params.slug,
      mdxSource,

      currentId: slug.join(SPLIT_FLAG),
      menus: stripMenuForClient(menuData),
      latestVersion,
      locale: 'en',
      category: ApiReferenceRouteEnum.Restful,
      languageCategory: ApiReferenceLanguageEnum.Restful,
      versions: versions,
      relativePath: frontMatter.relativePath,
      curCategoryContentData: stripMdListDataForClient(
        curCategoryContentDataOfAllVersion,
        currentApiMdId
      ),
      headingContent: firstHeading || 'Milvus API Reference',
      lastModified: lastModified ?? null,
      meta: {
        title: metaTitle,
        path: metaPath,
      },
    },
  };
}
