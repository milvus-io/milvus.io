import React from 'react';
import Link from 'next/link';
import styles from './HorizontalBlogCard.module.css';
import { BlogFrontMatterType } from '@/types/blogs';

export default function HorizontalBlogCard(props: {
  blogData: BlogFrontMatterType;
}) {
  const { blogData } = props;
  const { title, desc, tag, cover, id } = blogData;

  return (
    <Link href={`/blog/${id}`} style={{ display: 'block' }}>
      <div className={styles.root}>
        <img
          className={styles.cardImg}
          src={`https://${cover}`}
          alt={title}
          loading="lazy"
        />
        <div className={styles.cardContent}>
          <p className={styles.tag}>{tag}</p>
          <h6 className={styles.title}>{title}</h6>
          <p className={styles.desc}>{desc}</p>
        </div>
      </div>
    </Link>
  );
}
