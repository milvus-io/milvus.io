import {
  generateDocVersionInfo,
  generateAllContentDataOfSingleVersion,
  generateSingleDocContent,
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
import { writeSitemapSegment } from '@/utils/doc-sitemap-segments';

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

    // Only the English latest version is prerendered at build time. Every other
    // language/version is generated on demand via the blocking fallback and then
    // cached by the running server, which keeps build time and memory low.
    const isCorePrerender =
      lang === LanguageEnum.ENGLISH && version === '';

    // next-sitemap auto-discovers prerendered pages from the prerender manifest,
    // so only on-demand routes need their URLs recorded here. This keeps the
    // sitemap complete without duplicating the prerendered English latest URLs.
    if (!isCorePrerender) {
      const langSegment =
        lang === LanguageEnum.ENGLISH ? '' : `/${lang}`;
      const versionSegment = version ? `/${version}` : '';
      writeSitemapSegment(
        `docs__${lang}__${version || 'latest'}`,
        paths.map(p => `/docs${langSegment}${versionSegment}/${p.params.id}`)
      );
    }

    return {
      paths: isCorePrerender ? paths : [],
      fallback: 'blocking' as const,
    };
  };

  const getPageStaticProps: GetStaticProps = async context => {
    const { params } = context;

    const id = params.id as string;
    const { versions, latestVersion } = generateDocVersionInfo();
    const currentVersion = version || latestVersion;

    // Load only the requested doc instead of the whole version's content, so an
    // on-demand render keeps runtime memory bounded.
    const matchedDoc = generateSingleDocContent({
      version: currentVersion,
      lang,
      id,
    });

    // Under the blocking fallback getStaticProps runs for arbitrary ids, so an
    // unknown id must 404 instead of throwing during destructuring.
    if (!matchedDoc) {
      return { notFound: true };
    }

    const {
      content: docDetailContent,
      frontMatter,
      editPath,
      propsInfo,
    } = matchedDoc;

    const docMenu = generateMenuDataOfCurrentVersion({
      docVersion: currentVersion,
      lang,
    });

    // used to detect has same page of current md
    const mdListData = generateAllContentDataOfAllVersion();

    // languages that have this doc for hreflang tags. Pass the matched file's
    // relative path so this resolves via cheap existsSync checks instead of
    // parsing every language's frontmatter on the on-demand render path.
    const availableLanguages = getAvailableLanguagesForDoc({
      version: currentVersion,
      docId: id,
      relativePath: editPath,
      lang,
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
