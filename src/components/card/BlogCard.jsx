import React from 'react';
import Link from 'next/link';
import * as styles from './BlogCard.module.less';
import Tags from '../tags';
import clsx from 'clsx';

const BlogCard = ({ title, desc, tags, cover, locale, path, className }) => {
  const to = `/blog/${path}`;

  return (
    <Link
      href={to}
      className={clsx(styles.BlogCardWrapper, {
        [className]: className,
      })}
    >
      <div className="w-full aspect-[1.59817/1] overflow-hidden rounded-[6px]">
        <img className={styles.cover} src={cover} alt={title} />
      </div>
      <div className={styles.descWrapper}>
        <div className={styles.bottomWrapper}>
          <Tags list={tags} tagsClass={styles.tags} />
        </div>
        <h6 className={styles.title}>{title}</h6>
      </div>
    </Link>
  );
};

export default BlogCard;
