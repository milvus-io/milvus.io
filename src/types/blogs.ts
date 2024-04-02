export interface OriginBlogFrontMatterType {
  id: string;
  author: string;
  date: string;
  title: string;
  desc: string;
  cover: string;
  tag: string;
  isPublish?: string;
  recommend?: string;
  tags?: string;
  canonicalUrl?: string;
}

export interface BlogFrontMatterType
  extends Omit<OriginBlogFrontMatterType, 'tags'> {
  tags: string[];
}

export interface BlogDataType {
  frontMatter: BlogFrontMatterType;
  content: string;
}
