import {
  BASE_DOC_DIR,
  generateDocVersionInfo,
  generateAllContentDataOfSingleVersion,
  generateSingleDocContent,
  generateMenuDataOfCurrentVersion,
  generateAllContentDataOfAllVersion,
  getAvailableLanguagesForDoc,
  docExistsInVersion,
} from '@/utils/docs';
import { GetStaticProps } from 'next';
import { generateApiMenuDataOfCurrentVersion } from '@/utils/apiReference';
import { LanguageEnum } from '@/types/localization';
import { DocDetailPage } from '@/components/localization/DocDetail';
import {
  getDocHreflangUrls,
  getDocCanonicalUrl,
  getDocCanonicalLang,
} from '@/components/localization/utils';
import {
  stripMdListDataForClient,
  stripMenuForClient,
} from '@/utils/client-doc-data';
import { writeSitemapSegment } from '@/utils/doc-sitemap-segments';
import {
  getContentLastModified,
  readContentFrontMatter,
} from '@/server/content-freshness';
import { join } from 'path';

export default DocDetailPage;

export const createDocDetailProps = (lang: LanguageEnum, version = '') => {
  const getPageStaticPaths = () => {
    const { latestVersion } = generateDocVersionInfo();
    const currentVersion = version || latestVersion;
    const content = generateAllContentDataOfSingleVersion({
      version: currentVersion,
      lang,
    });
    const seenIds = new Set<string>();
    const docs = content.filter(({ frontMatter: { id } }) => {
      // Match generateSingleDocContent, which renders the first source for an ID.
      if (seenIds.has(id)) return false;
      seenIds.add(id);
      return true;
    });

    const paths = docs.map(v => ({
      params: { id: v.frontMatter.id },
    }));

    // Only the English latest version is prerendered at build time. Every other
    // language/version is generated on demand via the blocking fallback and then
    // cached by the running server, which keeps build time and memory low.
    const isCorePrerender = lang === LanguageEnum.ENGLISH && version === '';

    if (!version && process.env.NODE_ENV === 'production') {
      const baseUrl = lang === LanguageEnum.ENGLISH ? '/docs' : `/docs/${lang}`;
      const homeFile = join(
        BASE_DOC_DIR, 'localization', currentVersion, 'site', lang, 'home/home.md'
      );
      writeSitemapSegment(`docs__${lang}__latest`, [
        {
          loc: baseUrl,
          lastmod: getContentLastModified(homeFile, readContentFrontMatter(homeFile)),
        },
        ...docs.map(({ editPath, frontMatter }) => ({
          loc: `${baseUrl}/${frontMatter.id}`,
          lastmod: getContentLastModified(
            join(BASE_DOC_DIR, 'localization', editPath),
            frontMatter
          ),
          onDemand: !isCorePrerender,
        })),
      ]);
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
    // Archived versions canonicalize to the latest-version page only when that
    // page exists in latest for the canonical language; otherwise self.
    const existsInLatest =
      currentVersion !== latestVersion &&
      docExistsInVersion({
        version: latestVersion,
        lang: getDocCanonicalLang(lang),
        id,
      });
    const canonicalUrl = getDocCanonicalUrl({
      lang,
      version: currentVersion,
      latestVersion,
      docId: id,
      existsInLatest,
    });

    const { codeList, anchorList } = propsInfo;
    const headingContent = anchorList?.[0]?.label;
    const lastModified = getContentLastModified(
      join(BASE_DOC_DIR, 'localization', editPath),
      frontMatter
    );

    return {
      props: {
        homeData: {
          tree: docDetailContent,
          codeList,
          headingContent,
          anchorList,
          summary: frontMatter.summary || '',
          editPath,
          frontMatter: JSON.parse(JSON.stringify(frontMatter)),
        },
        lastModified: lastModified ?? null,
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
