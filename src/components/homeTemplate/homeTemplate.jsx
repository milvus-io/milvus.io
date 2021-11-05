import React from 'react';
import BlogCard from '../card/blogCard/v2';
import Button from '../button';
import './homeTemplate.less';

const HomeTemplate = props => {
  const { data, locale, newestBlog = [], text, homePath = '' } = props;

  const generateNewsetBlog = (bloglist, locale) => {
    return (
      <ul className="blog-content">
        {bloglist.map(item => {
          const { desc, cover, date, tags, id, title } = item;
          return (
            <li key={item.id}>
              <BlogCard
                locale={locale}
                title={title}
                date={date}
                cover={`https://${cover}`}
                desc={desc}
                tags={tags}
                path={id}
              />
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <section className="doc-home-container">
      <div
        className="doc-home-html-Wrapper"
        dangerouslySetInnerHTML={{ __html: data }}
      ></div>
      <div className="doc-home-blog-container">
        <h2>{text.title}</h2>
        {generateNewsetBlog(newestBlog, locale)}
        <Button
          className="loadBtn"
          isExternal={false}
          link="/blog"
          children={
            <>
              <span className="btnLabel">{text.btnLabel}</span>
              <i className="fa fa-chevron-right"></i>
            </>
          }
        />
      </div>
    </section>
  );
};

export default HomeTemplate;
