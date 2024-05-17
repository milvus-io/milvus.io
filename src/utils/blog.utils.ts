import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const BASE_BLOG_DIR = join(process.cwd(), 'src/blogs/blog/en');

/***
 *
 * what i need:
 * routers: map all blogs
 * content: map all blogs
 */

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

const generateBlogData = (showContent = true) => {
  const blogsData = fs.readdirSync(BASE_BLOG_DIR).map(v => {
    const file = fs.readFileSync(`${BASE_BLOG_DIR}/${v}`);
    const { data, content } = matter(file);
    const { tag, date, cover, ...rest } = data;

    return {
      id: v,
      content: showContent ? content : '',
      date: new Date(data.date).toJSON(),
      cover: generateBlogCover(cover, new Date(data.date)),
      ...rest,
      tags: tag ? tag.split(',') : [],
      href: `/blog/${v}`,
    };
  });

  blogsData.sort(
    (x, y) => new Date(y.date).getTime() - new Date(x.date).getTime()
  );
  return blogsData;
};

const generateBlogRouter = () => {
  const data = generateBlogData();
  const router = data.map(v => ({
    params: {
      id: v.id,
    },
  }));
  return router;
};

const generateHomepageBannerData = () => {
  const filePath = join(process.cwd(), 'src/blogs/homepage/index.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Try to read homepage data json failed', error);
    return [];
  }
};

const blogUtils = {
  getAllData: generateBlogData,
  getRouter: generateBlogRouter,
  getHomepageData: generateHomepageBannerData,
};

export default blogUtils;
