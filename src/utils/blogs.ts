import { validationFileFilter } from './docs';
import { BlogDataType, OriginBlogFrontMatterType } from '@/types/blogs';

const fs = require('fs');
const { join } = require('path');
const matter = require('gray-matter');

const BASE_PATH = join(process.cwd(), 'src/blogs/blog');

export const generateAllBlogContentList = (params?: {
  lang?: 'en' | 'cn';
  withContent?: boolean;
}) => {
  const { lang = 'en', withContent = false } = params || {};
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

  return blogList;
};
