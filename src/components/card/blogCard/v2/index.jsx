import React from 'react';
import * as styles from './index.module.less';
import LocalizedLink from '../../../localizedLink/localizedLink';
import BlogTag from '../../../blogDetail/blogTag';

const BlogCard = ({ title, date, desc, tags, cover, locale, path }) => {
  const to = `/blogs/${path}`;
  return (
    <LocalizedLink locale={locale} to={to} className={styles.blogCardWrapper}>
      <div className={styles.coverWrapper}>
        <img src={cover} alt={desc} />
      </div>
      <div className={styles.descWrapper}>
        <h6 className={styles.title}>{title}</h6>
        <p className={styles.desc}>{desc}</p>
        <div className={styles.bottomWrapper}>
          <ul className={styles.tags}>
            {tags.slice(0, 2).map(tag => {
              return (
                <li key={tag}>
                  <BlogTag name={tag} isActive={false} />
                </li>
              );
            })}
          </ul>
          <span className={styles.date}>{new Date(date).toLocaleString()}</span>
        </div>
      </div>
    </LocalizedLink>
  );
};

export default BlogCard;
