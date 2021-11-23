import React, { useMemo } from 'react';
import * as styles from './index.module.less';
import LocalizedLink from '../../../localizedLink/localizedLink';
import BlogTag from '../../../blogDetail/blogTag';
import * as dayjs from 'dayjs';

const BlogCard = ({ title, date, desc, tags, cover, locale, path }) => {
  const to = `/blog/${path}`;

  const dateTime = useMemo(() => {
    if (!date) {
      return locale === 'en' ? 'Unknown' : '未知';
    }
    return dayjs(date).format('YYYY/MM/DD');
  }, [date, locale]);

  return (
    <LocalizedLink locale={locale} to={to} className={styles.blogCardWrapper}>
      <div
        className={styles.coverWrapper}
        style={{ backgroundImage: `url(${cover})` }}
      ></div>
      <div className={styles.descWrapper}>
        <h6 className={styles.title}>{title}</h6>
        <p className={styles.desc}>{desc}</p>
        <div className={styles.bottomWrapper}>
          <ul className={styles.tags}>
            {tags.slice(0, 2).map(tag => {
              return (
                <li key={tag}>
                  <BlogTag name={tag} />
                </li>
              );
            })}
          </ul>
          <span className={styles.date}>{dateTime}</span>
        </div>
      </div>
    </LocalizedLink>
  );
};

export default BlogCard;
