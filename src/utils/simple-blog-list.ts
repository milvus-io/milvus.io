import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

let simpleEnglishBlogListCache:
  | {
      id: string;
      date: string;
      href: string;
      title: string;
    }[]
  | null = null;

const generateSimpleEnglishBlogList = () => {
  if (simpleEnglishBlogListCache) {
    return simpleEnglishBlogListCache;
  }

  const baseBlogDir = join(process.cwd(), 'src/blogs/blog/en');
  const blogsData = fs
    .readdirSync(baseBlogDir)
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const file = fs.readFileSync(`${baseBlogDir}/${fileName}`);
      const { data } = matter(file);
      const { title = '' } = data;

      return {
        id: fileName,
        date: new Date(data.date).toJSON(),
        href: `/blog/${fileName}`,
        title,
      };
    });

  blogsData.sort(
    (x, y) => new Date(y.date).getTime() - new Date(x.date).getTime()
  );

  simpleEnglishBlogListCache = blogsData;
  return simpleEnglishBlogListCache;
};

export default generateSimpleEnglishBlogList;
