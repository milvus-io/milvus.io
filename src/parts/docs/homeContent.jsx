import Typography from '@mui/material/Typography';
import HorizontalBlogCard from '../../components/card/HorizontalBlogCard';
import { useTranslation } from 'react-i18next';

export default function HomeContent(props) {
  const { homeData, newestBlog = [] } = props;

  const { t } = useTranslation('common');

  return (
    <>
      <div
        className="doc-home-html-Wrapper doc-style"
        dangerouslySetInnerHTML={{ __html: homeData }}
      />
      <Typography component="section" className="doc-home-blog">
        <Typography variant="h2" component="h2">
          {t('v3trans.docs.blogTitle')}
        </Typography>
        <HorizontalBlogCard blogData={newestBlog} />
      </Typography>
    </>
  );
}
