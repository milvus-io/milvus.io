import { contentDimensions, pushGrowthEvent } from '@/utils/growth-measurement';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { getAcquisitionParams, getMilvusEntryPage } from '@/utils/cloud-attribution';
import { trackCloudLinks, TrackedCloudLinks } from '@/utils/track-cloud-links';
import { getAcquisitionContext } from '@/utils/acquisition-context';

export function useCloudLinkTracking() {
  const { asPath, isReady } = useRouter();
  const lastView = useRef<string | undefined>(undefined);
  const links = useRef<TrackedCloudLinks>(new WeakMap());

  useEffect(() => {
    if (!isReady) return;
    let storage: Storage | undefined;
    try {
      storage = window.sessionStorage;
    } catch {
      // Some browser settings block even accessing sessionStorage.
    }
    const acquisition = getAcquisitionParams(asPath, storage);
    const context = getAcquisitionContext('milvus.io', asPath, document.referrer, storage);
    const page = asPath.split(/[?#]/)[0] || '/';
    if (lastView.current !== page) {
      pushGrowthEvent('measurement_page_view', { ...contentDimensions('milvus.io', asPath),
        session_entry_page: context.session_entry_page });
      lastView.current = page;
    }
    return trackCloudLinks(
      document.body,
      getMilvusEntryPage(asPath),
      acquisition,
      links.current,
      context
    );
  }, [asPath, isReady]);
}
