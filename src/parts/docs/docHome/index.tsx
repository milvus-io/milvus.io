import Typography from '@mui/material/Typography';
import HorizontalBlogCard from '../../../components/card/HorizontalBlogCard';
import classes from './index.module.less';
import clsx from 'clsx';
import { BlogFrontMatterType } from '@/types/blogs';

interface HomeContentProps {
  latestBlog: BlogFrontMatterType;
  homeData: string;
}
export default function HomeContent(props: HomeContentProps) {
  const { homeData = '', latestBlog } = props;

  return (
    <section>
      <div
        className={clsx('doc-style', classes.docHomeHtmlWrapper)}
        dangerouslySetInnerHTML={{ __html: homeData }}
      />
      <Typography component="section" className={classes.docHomeBlog}>
        <Typography variant="h2" component="h2">
          Blog
        </Typography>
        <HorizontalBlogCard blogData={latestBlog} />
      </Typography>
    </section>
  );
}
