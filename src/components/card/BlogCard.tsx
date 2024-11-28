import React from 'react';
import Link from 'next/link';
import styles from './BlogCard.module.less';
import Tags from '../tags';
import clsx from 'clsx';

interface Props {
  title: string;
  desc: string;
  tags: string[];
  cover: string;
  path: string;
  className?: string;
  direction?: 'row' | 'column';
}

const BlogCard: React.FC<Props> = props => {
  const {
    title,
    desc,
    tags,
    cover,
    path,
    direction = 'column',
    className,
  } = props;
  const to = `/blog/${path}`;

  return (
    <Link
      href={to}
      className={clsx(styles.BlogCardWrapper, {
        [styles.row]: direction === 'row',
        [className]: className,
      })}
    >
      <div className="w-full aspect-[1.59817/1] overflow-hidden rounded-[12px] mb-[28px] cover-container">
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
