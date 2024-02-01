import React, { useState } from 'react';
import Link from 'next/link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import * as styles from './HorizontalBlogCard.module.less';
import Skeleton from '@mui/material/Skeleton';
import clsx from 'clsx';

export default function HorizontalBlogCard(props) {
  const { blogData = {} } = props;
  const [imgLoading, setImgLoading] = useState(true);
  const { title, desc, tags, cover, id } = blogData;
  const handleImgLoad = () => {
    setImgLoading(false);
  };
  return (
    <Link href={`/blog/${id}`} style={{ display: 'block' }}>
      <Card classes={{ root: styles.root }} sx={{ boxShadow: 0 }}>
        <CardMedia
          component="img"
          classes={{ img: styles.cardImg }}
          className={clsx({ [styles.loading]: imgLoading })}
          src={cover}
          alt={title}
          onLoad={handleImgLoad}
        />
        {imgLoading && (
          <Skeleton variant="rectangular" width={250} height={160} />
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent classes={{ root: styles.cardContent }}>
            {tags?.length && (
              <Typography component="div" variant="h7" className={styles.tag}>
                {tags[0]}
              </Typography>
            )}
            <Typography variant="h4" component="div" className={styles.title}>
              {title}
            </Typography>
            <Typography component="div" variant="h7" className={styles.desc}>
              {desc}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Link>
  );
}
