import { useRouter } from 'next/router';
import { useMemo } from 'react';

export default function useUtmTrackPath() {
  const { asPath } = useRouter();

  const trackPath = useMemo(() => {
    return asPath === '/' ? 'homepage' : asPath.replace(/\//, '');
  }, [asPath]);
  return trackPath;
}
