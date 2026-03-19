const fs = require('fs');
const { join } = require('path');
const csv = require('csv-parser');
const matter = require('gray-matter');

let simpleFaqCache = [];

const generateFaqPaths = () => {
  const filePath = join(process.cwd(), 'public/assets', 'milvus-faq.csv');

  if (simpleFaqCache.length > 0) {
    return simpleFaqCache;
  }

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim(),
          separator: ',',
        })
      )
      .on('data', row => {
        if (row.Order !== undefined) {
          simpleFaqCache.push({
            title: row.Questions,
            url: row.URL,
          });
        }
      })
      .on('end', () => {
        resolve(simpleFaqCache);
      })
      .on('error', error => {
        reject(error);
      });
  });
};

/**
 * Generate sitemap paths for old doc versions that are not pre-rendered at
 * build time (ISR fallback: 'blocking' pages).
 *
 * These pages exist and are served on-demand, but next-sitemap only includes
 * pages generated during build. This function scans the filesystem to produce
 * the full set of doc paths.
 */
const VERSION_REG = /^v\d+\.\d+\.x$/;
const IGNORE_FILES = ['README.md', '.DS_Store', 'fragments', 'menuStructure'];

const generateOldVersionDocPaths = () => {
  const baseDir = join(process.cwd(), 'src/docs');
  const versionFile = join(baseDir, 'version.json');
  const { version: releaseVersion } = JSON.parse(
    fs.readFileSync(versionFile, 'utf-8')
  );

  // Get all versions sorted descending
  const allVersions = fs
    .readdirSync(baseDir)
    .filter(d => VERSION_REG.test(d) && d <= releaseVersion)
    .sort()
    .reverse();

  const latestVersion = allVersions[0];
  const oldVersions = allVersions.filter(v => v !== latestVersion);

  // Language → route prefix mapping (matching src/pages/docs/ structure)
  const langRouteMap = {
    en: '',
    ja: '/ja',
    zh: '/zh',
    'zh-hant': '/zh-hant',
    ko: '/ko',
    es: '/es',
    fr: '/fr',
    de: '/de',
    pt: '/pt',
    it: '/it',
    ru: '/ru',
    ar: '/ar',
    id: '/id',
  };

  // Which (lang, version) combos have actual page files in src/pages/docs/
  const hasPageFile = (langPrefix, version) => {
    const pagePath = join(
      process.cwd(),
      'src/pages/docs',
      langPrefix.replace(/^\//, ''),
      version,
      '[id].tsx'
    );
    return fs.existsSync(pagePath);
  };

  const paths = [];

  for (const version of oldVersions) {
    for (const [lang, langPrefix] of Object.entries(langRouteMap)) {
      // Only add paths for lang/version combos that have page files
      const routePrefix = langPrefix ? langPrefix : '';
      if (!hasPageFile(routePrefix, version)) continue;

      const siteDir = join(
        baseDir,
        'localization',
        version,
        'site',
        lang
      );
      if (!fs.existsSync(siteDir)) continue;

      // Scan all .md files for their frontMatter.id
      const scanDir = dir => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (IGNORE_FILES.includes(entry.name)) continue;
          const fullPath = join(dir, entry.name);
          if (entry.isDirectory()) {
            scanDir(fullPath);
          } else if (entry.name.endsWith('.md')) {
            try {
              const content = fs.readFileSync(fullPath, 'utf-8');
              const { data: fm } = matter(content);
              if (fm.id && !fm.deprecate) {
                const loc = `/docs${routePrefix}/${version}/${fm.id}`;
                paths.push({
                  loc,
                  changefreq: 'monthly',
                  priority: 0.5,
                  lastmod: new Date().toISOString(),
                });
              }
            } catch (e) {
              // skip files that can't be parsed
            }
          }
        }
      };

      scanDir(siteDir);
    }
  }

  return paths;
};

/**
 * Generate sitemap paths for old API reference versions.
 * API Reference md files have no frontMatter — the id is derived from filename.
 */
const generateOldVersionApiPaths = () => {
  const apiRefDir = join(process.cwd(), 'src/docs/API_Reference');
  if (!fs.existsSync(apiRefDir)) return [];

  const paths = [];

  // Directory name → route name mapping
  const sdkLangMap = {
    pymilvus: 'pymilvus',
    'milvus-sdk-java': 'java',
    'milvus-sdk-go': 'go',
    'milvus-sdk-node': 'node',
    'milvus-sdk-csharp': 'csharp',
    'milvus-sdk-cpp': 'cpp',
  };

  const scanDir = (dir, parentIds, addPath) => {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (IGNORE_FILES.includes(entry.name)) continue;
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath, [...parentIds, entry.name], addPath);
      } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
        // Use filename (without extension) as id
        const id = entry.name.replace(/\.mdx?$/, '.md');
        addPath([...parentIds, id].join('/'));
      }
    }
  };

  // SDK languages (under API_Reference/, skip milvus-restful which is deprecated)
  for (const [dirName, routeName] of Object.entries(sdkLangMap)) {
    const langDir = join(apiRefDir, dirName);
    if (!fs.existsSync(langDir)) continue;

    const versions = fs
      .readdirSync(langDir)
      .filter(d => VERSION_REG.test(d))
      .sort()
      .reverse();

    const latestVersion = versions[0];
    const oldVersions = versions.filter(v => v !== latestVersion);

    for (const version of oldVersions) {
      scanDir(join(langDir, version), [], slug => {
        paths.push({
          loc: `/api-reference/${routeName}/${version}/${slug}`,
          changefreq: 'monthly',
          priority: 0.4,
          lastmod: new Date().toISOString(),
        });
      });
    }
  }

  // Restful (stored in API_Reference_MDX/milvus-restful, not API_Reference)
  const restfulDir = join(
    process.cwd(),
    'src/docs/API_Reference_MDX/milvus-restful'
  );
  if (fs.existsSync(restfulDir)) {
    const versions = fs
      .readdirSync(restfulDir)
      .filter(d => VERSION_REG.test(d))
      .sort()
      .reverse();
    const latestVersion = versions[0];
    const oldVersions = versions.filter(v => v !== latestVersion);

    for (const version of oldVersions) {
      scanDir(join(restfulDir, version), [], slug => {
        paths.push({
          loc: `/api-reference/restful/${version}/${slug}`,
          changefreq: 'monthly',
          priority: 0.4,
          lastmod: new Date().toISOString(),
        });
      });
    }
  }

  return paths;
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://milvus.io',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  generateIndexSitemap: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        // disallow: '*[id]*',
        host: 'https://milvus.io',
        sitemap: 'https://milvus.io/sitemap.xml',
      },
    ],
  },
  additionalPaths: async config => {
    const simpleList = await generateFaqPaths();
    const faqPaths = simpleList.map(v => ({
      loc: `/ai-quick-reference/${v.url}`,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }));

    // Add old version doc/api paths that are not pre-rendered (ISR fallback)
    const oldDocPaths = generateOldVersionDocPaths();
    const oldApiPaths = generateOldVersionApiPaths();

    return [...faqPaths, ...oldDocPaths, ...oldApiPaths];
  },
  outDir: './public',
};
