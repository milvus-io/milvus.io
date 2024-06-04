'use client';

import { useRef } from 'react';
import { LoadingIcon } from '@/components/icons';
import classes from '@/styles/error.module.less';

const RELOAD_LIMIT = 3;

export default function Error(props: { error: Error; reset: () => void }) {
  const { error, reset } = props;
  const count = useRef(0);

  return (
    <div className={classes.errorContainer}>
      <span className={classes.iconWrapper}>
        <LoadingIcon />
      </span>
      <p className={classes.prompt}>Loading...</p>
    </div>
  );
}
