import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './BlogCard.module.less';
import Tags from '../tags';
import clsx from 'clsx';
import Link from 'next/link';

interface Props {
  title: string;
  desc: string;
  tags: string[];
  cover: string;
  path: string;
  className?: string;
  direction?: 'row' | 'column';
  disableWrapperLink?: boolean;
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
    disableWrapperLink = false,
  } = props;
  const to = `/blog/${path}`;
  const router = useRouter();

  const handleWrapperClick = () => {
    if (disableWrapperLink) {
      return;
    }
    router.push(to);
  };

  return (
    <div
      className={clsx(styles.BlogCardWrapper, {
        [styles.row]: direction === 'row',
        [className]: className,
        [styles.wrapperLinkDisabled]: disableWrapperLink,
      })}
      onClick={handleWrapperClick}
    >
      <div className="w-full aspect-[1.59817/1] overflow-hidden rounded-[12px] mb-[28px] cover-container">
        <img className={styles.cover} src={cover} alt={title} />
      </div>
      <div className={styles.descWrapper}>
        <div className={styles.bottomWrapper}>
          <Tags list={tags} tagsClass={styles.tags} />
        </div>
        <h6 className={styles.title}>
          <Link href={to}>{title}</Link>
        </h6>
      </div>
    </div>
  );
};

export default BlogCard;
