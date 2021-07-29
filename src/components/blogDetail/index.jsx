import React from 'react';
import BlogTag from '../../components/blogDetail/blogTag';
import LocalizedLink from '../../components/localizedLink/localizedLink';
import * as styles from './index.module.less';

const BlogDetail = ({
  innerHtml,
  author,
  tags,
  banner,
  date,
  title,
  locale,
}) => {
  const NAV_TEXT = {
    cn: ['博客', '文章'],
    en: ['Blog', 'Article'],
  };

  return (
    <div className={styles.blogDetailWrapper}>
      <div
        className={styles.articleHeader}
        style={{
          backgroundImage: `url(${banner})`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.flexBox}>
          <p>{new Date(date).toLocaleDateString()}</p>
          <p>by {author}</p>
        </div>
        <ul className={styles.tagsLine}>
          {tags.map(tag => (
            <li key={tag}>
              <BlogTag name={tag} />
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.breadcrumd}>
        <LocalizedLink
          locale={locale}
          to="/blogs"
          className={styles.breadcrumdLink}
        >
          {NAV_TEXT[locale][0]}
        </LocalizedLink>
        <span className={styles.breadcrumdArrow}>{'>'}</span>
        <span className={styles.breadcrumdItem}>{NAV_TEXT[locale][1]}</span>
      </div>
      <div
        className={styles.articleContent}
        dangerouslySetInnerHTML={{ __html: innerHtml }}
      ></div>
    </div>
  );
};

export default BlogDetail;
