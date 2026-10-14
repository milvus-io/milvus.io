import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { getAcquisitionParams, getMilvusEntryPage } from '@/utils/cloud-attribution';
import { trackCloudLinks, TrackedCloudLinks } from '@/utils/track-cloud-links';

export function useCloudLinkTracking() {
  const { asPath } = useRouter();
  const links = useRef<TrackedCloudLinks>(new WeakMap());

  useEffect(() => {
    let storage: Storage | undefined;
    try {
      storage = window.sessionStorage;
    } catch {
      // Some browser settings block even accessing sessionStorage.
    }
    const acquisition = getAcquisitionParams(asPath, storage);
    return trackCloudLinks(
      document.body,
      getMilvusEntryPage(asPath),
      acquisition,
      links.current
    );
  }, [asPath]);
}
