import Typography from '@mui/material/Typography';
import HorizontalBlogCard from '../../../components/card/HorizontalBlogCard';
import { useTranslation } from 'react-i18next';
import classes from './index.module.less';
import clsx from 'clsx';

export default function HomeContent(props) {
  const { homeData, newestBlog = [] } = props;

  const { t } = useTranslation('common');

  return (
    <>
      <div
        className={clsx('doc-style', classes.docHomeHtmlWrapper)}
        dangerouslySetInnerHTML={{ __html: homeData }}
      />
      <Typography component="section" className={classes.docHomeBlog}>
        <Typography variant="h2" component="h2">
          {t('v3trans.docs.blogTitle')}
        </Typography>
        <HorizontalBlogCard blogData={newestBlog} />
      </Typography>
    </>
  );
}
