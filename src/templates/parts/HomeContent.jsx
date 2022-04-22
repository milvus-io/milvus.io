import React from 'react';
import Typography from '@mui/material/Typography';
import HorizontalBlogCard from '../../components/card/HorizontalBlogCard';

export default function HomeContent(props) {
  const { homeData, newestBlog = [], trans } = props;

  return (
    <>
      <div
        className="doc-home-html-Wrapper doc-style"
        dangerouslySetInnerHTML={{ __html: homeData }}
      />
      <Typography component="section" className="doc-home-blog">
        <Typography variant="h2" component="h2">
          {trans('v3trans.docs.blogTitle')}
        </Typography>
        <HorizontalBlogCard blogData={newestBlog[0]} />
      </Typography>
    </>
  );
}
