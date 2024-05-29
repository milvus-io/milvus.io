import React from 'react';
import Link from 'next/link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styles from './HorizontalBlogCard.module.less';
import { BlogFrontMatterType } from '@/types/blogs';

export default function HorizontalBlogCard(props: {
  blogData: BlogFrontMatterType;
}) {
  const { blogData } = props;
  const { title, desc, tag, cover, id } = blogData;

  return (
    <Link href={`/blog/${id}`} style={{ display: 'block' }}>
      <Card classes={{ root: styles.root }} sx={{ boxShadow: 0 }}>
        <CardMedia
          component="img"
          classes={{ img: styles.cardImg }}
          src={`https://${cover}`}
          alt={title}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent classes={{ root: styles.cardContent }}>
            <p className={styles.tag}>{tag}</p>
            <h6 className={styles.title}>{title}</h6>
            <p className={styles.desc}>{desc}</p>
          </CardContent>
        </Box>
      </Card>
    </Link>
  );
}
