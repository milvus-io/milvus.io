import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { INDEXABLE_LANGUAGES, LanguageEnum } from '@/types/localization';

// Passing an options object bypasses gray-matter's unbounded global
// matter.cache, preventing full article bodies from accumulating in memory on
// on-demand production renders.
const parseMatter = (file: Buffer | string) => matter(file, {});

const generateBlogCover = (cover: string, date: Date) => {
  if (cover) {
    return `https://${cover}`;
  }
  const coverImgList = [
    'zilliz-cms.s3.us-west-2.amazonaws.com/pc_blog_2_9e3f35962c.jpg',
    'zilliz-cms.s3.us-west-2.amazonaws.com/pc_blog_8ed7696269.jpg',
  ];
  const day = new Date(date).getDay();
  const defaultCover = day % 2 === 0 ? coverImgList[0] : coverImgList[1];
  return `https://${defaultCover}`;
};

const getBlogDir = (locale: LanguageEnum = LanguageEnum.ENGLISH) =>
  locale === LanguageEnum.ENGLISH
    ? join(process.cwd(), 'src/blogs/blog/en')
    : join(process.cwd(), `src/blogs/localization/blog/${locale}`);

/** A blog markdown file is routable only if its frontmatter carries a
 *  non-empty `title`. Empty/placeholder stubs — e.g. the 1-byte untranslated
 *  files under localization/blog/<locale> — otherwise generate blank-title
 *  routes that also emit an empty BreadcrumbList `name`, which Google Search
 *  Console flags as invalid structured data. Skipping them here keeps them out
 *  of every consumer at once: routes, list, sitemap, hreflang. */
const hasBlogTitle = (blogDir: string, fileName: string) => {
  const { data } = parseMatter(fs.readFileSync(`${blogDir}/${fileName}`));
  return typeof data.title === 'string' && data.title.trim().length > 0;
};

const getBlogFileNames = (blogDir: string) =>
  fs
    .readdirSync(blogDir)
    .filter(fileName => fileName.endsWith('.md'))
    .filter(fileName => hasBlogTitle(blogDir, fileName));

const sortBlogsByDateDesc = <T extends { date: string }>(blogsData: T[]) => {
  blogsData.sort(
    (x, y) => new Date(y.date).getTime() - new Date(x.date).getTime()
  );
  return blogsData;
};

const generateBlogListData = (
  locale: LanguageEnum = LanguageEnum.ENGLISH
) => {
  const BASE_BLOG_DIR = getBlogDir(locale);
  const blogsData = getBlogFileNames(BASE_BLOG_DIR).map(v => {
    const file = fs.readFileSync(`${BASE_BLOG_DIR}/${v}`);
    const { data } = parseMatter(file);
    const { tag, date, cover, title = '', content, metaData, ...rest } = data;

    return {
      ...JSON.parse(JSON.stringify(rest)),
      id: v,
      date: new Date(data.date).toJSON(),
      cover: generateBlogCover(cover, new Date(data.date)),
      tags: tag ? tag.split(',') : [],
      href: `/blog/${v}`,
      title,
    };
  });

  return sortBlogsByDateDesc(blogsData);
};

// Lightweight metadata-only cache per locale (no article bodies) for
// production on-demand renders and list pages.
const listByLocale = new Map<
  LanguageEnum,
  ReturnType<typeof generateBlogListData>
>();

const getListData = (locale: LanguageEnum = LanguageEnum.ENGLISH) => {
  if (process.env.NODE_ENV !== 'production') {
    return generateBlogListData(locale);
  }

  const cached = listByLocale.get(locale);
  if (cached) return cached;

  const list = generateBlogListData(locale);
  listByLocale.set(locale, list);
  return list;
};

// Reads only the requested blog post's content and sibling metadata JSON
// without caching full article bodies in memory, keeping on-demand renders
// memory-bounded.
const getSingleData = (
  locale: LanguageEnum = LanguageEnum.ENGLISH,
  id: string
) => {
  if (
    !id ||
    !id.endsWith('.md') ||
    id.includes('/') ||
    id.includes('\\') ||
    id.includes('..')
  ) {
    return undefined;
  }

  const BASE_BLOG_DIR = getBlogDir(locale);
  const filePath = join(BASE_BLOG_DIR, id);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const file = fs.readFileSync(filePath);
  const { data, content } = parseMatter(file);
  if (typeof data.title !== 'string' || !data.title.trim()) {
    return undefined;
  }

  const { tag, date, cover, title = '', ...rest } = data;
  const metaFilePath = join(BASE_BLOG_DIR, id.replace('.md', '.json'));
  let metaData: {
    codeList?: string[];
    anchorList?: Array<{
      label: string;
      href: string;
      type: number;
      isActive: boolean;
    }>;
  } = {};
  if (fs.existsSync(metaFilePath)) {
    const metaFile = fs.readFileSync(metaFilePath);
    metaData = JSON.parse(metaFile.toString());
  }

  return {
    ...JSON.parse(JSON.stringify(rest)),
    id,
    date: new Date(data.date).toJSON(),
    cover: generateBlogCover(cover, new Date(data.date)),
    tags: tag ? tag.split(',') : [],
    href: `/blog/${id}`,
    content,
    title,
    metaData,
  };
};

const generateBlogData = (locale: LanguageEnum = LanguageEnum.ENGLISH) => {
  const BASE_BLOG_DIR = getBlogDir(locale);
  const blogsData = getBlogFileNames(BASE_BLOG_DIR).map(v => {
    const file = fs.readFileSync(`${BASE_BLOG_DIR}/${v}`);
    const { data, content } = parseMatter(file);
    const { tag, date, cover, title = '', ...rest } = data;

    const metaFilePath = `${BASE_BLOG_DIR}/${v.replace('.md', '.json')}`;
    let metaData: {
      codeList?: string[];
      anchorList?: Array<{
        label: string;
        href: string;
        type: number;
        isActive: boolean;
      }>;
    } = {};
    if (fs.existsSync(metaFilePath)) {
      const metaFile = fs.readFileSync(metaFilePath);
      metaData = JSON.parse(metaFile.toString());
    }

    return {
      ...JSON.parse(JSON.stringify(rest)),
      id: v,
      date: new Date(data.date).toJSON(),
      cover: generateBlogCover(cover, new Date(data.date)),
      tags: tag ? tag.split(',') : [],
      href: `/blog/${v}`,
      content,
      title,
      metaData,
    };
  });

  return sortBlogsByDateDesc(blogsData);
};

// A production build renders many posts from the same immutable checkout per
// worker. Keep development reads live when an author edits a translation.
const postsByLocale = new Map<LanguageEnum, ReturnType<typeof generateBlogData>>();

const getAllData = (locale = LanguageEnum.ENGLISH) => {
  if (process.env.NODE_ENV !== 'production') return generateBlogData(locale);

  const cached = postsByLocale.get(locale);
  if (cached) return cached;

  const posts = generateBlogData(locale);
  postsByLocale.set(locale, posts);
  return posts;
};

const generateSimpleBlogList = (
  locale: LanguageEnum = LanguageEnum.ENGLISH
) => {
  const BASE_BLOG_DIR = getBlogDir(locale);
  const blogsData = getBlogFileNames(BASE_BLOG_DIR).map(v => {
    const file = fs.readFileSync(`${BASE_BLOG_DIR}/${v}`);
    const { data } = parseMatter(file);
    const { title = '' } = data;

    return {
      id: v,
      date: new Date(data.date).toJSON(),
      href: `/blog/${v}`,
      title,
    };
  });

  return sortBlogsByDateDesc(blogsData);
};

const generateBlogRouter = (locale: LanguageEnum) => {
  const BASE_BLOG_DIR = getBlogDir(locale);
  const router = getBlogFileNames(BASE_BLOG_DIR).map(v => ({
    params: {
      id: v,
    },
  }));
  return router;
};

// Indexable languages that actually provide a translation of this blog post,
// used to build a reciprocal hreflang cluster that never points at a 404.
const getAvailableLanguagesForBlog = (id: string) =>
  INDEXABLE_LANGUAGES.filter(locale => {
    const dir = getBlogDir(locale);
    return fs.existsSync(join(dir, id)) && hasBlogTitle(dir, id);
  });

const blogUtils = {
  getAllData,
  getListData,
  getSingleData,
  getRouter: generateBlogRouter,
  getSimpleList: generateSimpleBlogList,
  getAvailableLanguages: getAvailableLanguagesForBlog,
};

export default blogUtils;
