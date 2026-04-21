/**
 * Shared social-proof numbers for /index2, pulled from the repo's
 * global-stats.json so Hero / Production / Community all read the same
 * value and nothing drifts when the nightly sync updates the file.
 * Same source that the site nav uses (components/header/DescktopHeader.tsx).
 */
import milvusStats from '../../../../global-stats.json';

const milvusStars = Number(milvusStats?.milvusStars || 0);
const pipInstall = Number(milvusStats?.pipInstall || 0);

/** e.g. "33.0K" — matches the nav's "Star 33.0K" formatting. */
export const MILVUS_STARS = `${(milvusStars / 1000).toFixed(1)}K`;

/** e.g. "19M+" — whole millions, no decimal, always trailing +. */
export const MILVUS_DOWNLOADS = `${Math.floor(pipInstall / 1_000_000)}M+`;
