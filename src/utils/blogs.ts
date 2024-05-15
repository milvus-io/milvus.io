import { IGNORE_FILES } from './docs';
import {
  BlogFrontMatterType,
  BlogDataType,
  OriginBlogFrontMatterType,
} from '@/types/blogs';
import dayjs from 'dayjs';

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
    .filter((v: string) => !IGNORE_FILES.includes(v))
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
        date: dayjs(data.date).format('lll'),
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
