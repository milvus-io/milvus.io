import { useRouter } from 'next/router';
import { useMemo } from 'react';

export default function useUtmTrackPath() {
  const { asPath } = useRouter();

  const trackPath = useMemo(() => {
    const route = asPath.split('?')[0];
    return asPath === '/' ? 'homepage' : route.replace(/\//, '');
  }, [asPath]);
  return trackPath;
}
