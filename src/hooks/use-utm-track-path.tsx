import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function useUtmTrackPath() {
  const { asPath } = useRouter();
  // Return empty string during SSR to avoid hydration mismatch,
  // then update with the actual path after client mount.
  const [trackPath, setTrackPath] = useState('');

  useEffect(() => {
    const route = asPath.split('?')[0];
    setTrackPath(asPath === '/' ? 'homepage' : route.replace(/\//, ''));
  }, [asPath]);

  return trackPath;
}
