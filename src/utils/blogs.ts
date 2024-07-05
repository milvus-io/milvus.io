import { validationFileFilter } from './docs';
import { BlogDataType, OriginBlogFrontMatterType } from '@/types/blogs';
import { getCacheData, setCacheData } from './index';

const fs = require('fs');
const { join } = require('path');
const matter = require('gray-matter');

const BASE_PATH = join(process.cwd(), 'src/blogs/blog');

const blogCache = new Map<string, any>();

export const generateAllBlogContentList = (params?: {
  lang?: 'en' | 'cn';
  withContent?: boolean;
}) => {
  const { lang = 'en', withContent = false } = params || {};

  const cacheKey = `all-blog-${lang}-${withContent}`;

  const cachedData = getCacheData({ cache: blogCache, key: cacheKey });

  if (cachedData) {
    return cachedData;
  }

  const directoryName = lang === 'en' ? 'en' : 'zh-CN';
  const directoryPath = join(BASE_PATH, directoryName);

  const paths = fs
    .readdirSync(directoryPath)
    .filter(validationFileFilter)
    .map((v: string) => join(directoryPath, v));
  const blogList: BlogDataType[] = paths.map((p: string) => {
    const fileData = fs.readFileSync(p, 'utf-8');
    const { data, content } = matter(fileData) as {
      data: OriginBlogFrontMatterType;
      content: string;
    };

    return {
      frontMatter: {
        ...data,
        date: `${data.date}`,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
      },
      content: withContent ? content : '',
    };
  });
  blogList.sort((a, b) => {
    return (
      new Date(b.frontMatter.date).getTime() -
      new Date(a.frontMatter.date).getTime()
    );
  });

  setCacheData({ cache: blogCache, key: cacheKey, data: blogList });

  return blogList;
};

export const generateLatestBlogInfo = (params: { lang?: 'en' | 'cn' }) => {
  const { lang = 'en' } = params;
  const blogList = generateAllBlogContentList({ lang, withContent: false });
  return blogList[0];
};

export const getHomepageHeadline = () => {
  const path = join(process.cwd(), 'src/blogs/homepage/index.json');
  const data = fs.readFileSync(path, 'utf-8');
  return JSON.parse(data);
};
