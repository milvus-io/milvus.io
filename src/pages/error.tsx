'use client';

import { useEffect, useRef } from 'react';
import { LoadingIcon } from '@/components/icons';
import classes from '@/styles/error.module.less';
import { redirect } from 'next/navigation';

const RELOAD_LIMIT = 3;

// page will arise an error after published if not refresh it.
// we use an ErrorBoundary to catch the error and try to refresh current page 3 times.
export default function Error(props: { error: Error; reset: () => void }) {
  const count = useRef(0);

  useEffect(() => {
    if (count.current >= RELOAD_LIMIT) {
      redirect('/');
    }
    count.current += 1;
    window.location.reload();
  }, []);

  return (
    <div className={classes.errorContainer}>
      <span className={classes.iconWrapper}>
        <LoadingIcon />
      </span>
      <p className={classes.prompt}>Loading...</p>
    </div>
  );
}
