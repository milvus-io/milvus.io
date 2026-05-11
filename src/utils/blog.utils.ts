import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { LanguageEnum } from '@/types/localization';

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

const getBlogFileNames = (blogDir: string) =>
  fs.readdirSync(blogDir).filter(fileName => fileName.endsWith('.md'));

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
    const { data } = matter(file);
    const { tag, date, cover, title = '', content, metaData, ...rest } = data;

    return {
      ...rest,
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

const generateBlogData = (locale: LanguageEnum = LanguageEnum.ENGLISH) => {
  const BASE_BLOG_DIR = getBlogDir(locale);
  const blogsData = getBlogFileNames(BASE_BLOG_DIR).map(v => {
    const file = fs.readFileSync(`${BASE_BLOG_DIR}/${v}`);
    const { data, content } = matter(file);
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
      ...rest,
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

const generateSimpleBlogList = (
  locale: LanguageEnum = LanguageEnum.ENGLISH
) => {
  const BASE_BLOG_DIR = getBlogDir(locale);
  const blogsData = getBlogFileNames(BASE_BLOG_DIR).map(v => {
    const file = fs.readFileSync(`${BASE_BLOG_DIR}/${v}`);
    const { data } = matter(file);
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

const blogUtils = {
  getAllData: generateBlogData,
  getListData: generateBlogListData,
  getRouter: generateBlogRouter,
  getSimpleList: generateSimpleBlogList,
};

export default blogUtils;
