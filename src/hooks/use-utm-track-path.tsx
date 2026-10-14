import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getMilvusEntryPage } from '@/utils/cloud-attribution';

export default function useUtmTrackPath() {
  const { asPath } = useRouter();
  // Return empty string during SSR to avoid hydration mismatch,
  // then update with the actual path after client mount.
  const [trackPath, setTrackPath] = useState('');

  useEffect(() => {
    setTrackPath(getMilvusEntryPage(asPath));
  }, [asPath]);

  return trackPath;
}
