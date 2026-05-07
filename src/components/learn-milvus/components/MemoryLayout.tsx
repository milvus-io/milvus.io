import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import styles from '../learnMilvus.module.css';

interface Props {
  n: number;
  dim: number;
  pqBytes: number;
}

function format(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(0)} KB`;
  return `${bytes} B`;
}

function formatN(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(0)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return `${n}`;
}

export default function MemoryLayout({ n, dim, pqBytes }: Props) {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('learnMilvus', { lng: locale });

  const fullVectorBytes = dim * 4;
  const ramBytes = n * pqBytes;
  const diskBytes = n * fullVectorBytes;
  const ratio = diskBytes / ramBytes;

  const maxBytes = Math.max(ramBytes, diskBytes);
  const ramPct = Math.max(2, (Math.sqrt(ramBytes) / Math.sqrt(maxBytes)) * 100);
  const diskPct = Math.max(2, (Math.sqrt(diskBytes) / Math.sqrt(maxBytes)) * 100);

  return (
    <div className={styles.memoryLayout}>
      <div className={styles.memoryRow}>
        <div className={styles.memoryRowHeader}>
          <span className={`${styles.memoryTag} ${styles.memoryTagRam}`}>RAM</span>
          <span className={styles.memoryRowTitle}>{t('memoryLayout.pqCodes', { bytes: pqBytes })}</span>
          <span className={styles.memoryRowValue}>{format(ramBytes)}</span>
        </div>
        <div className={styles.memoryBarTrack}>
          <div className={styles.memoryBarFillRam} style={{ width: `${ramPct}%` }} />
        </div>
      </div>
      <div className={styles.memoryRow}>
        <div className={styles.memoryRowHeader}>
          <span className={`${styles.memoryTag} ${styles.memoryTagDisk}`}>DISK</span>
          <span className={styles.memoryRowTitle}>{t('memoryLayout.fullVectors', { bytes: fullVectorBytes })}</span>
          <span className={styles.memoryRowValue}>{format(diskBytes)}</span>
        </div>
        <div className={styles.memoryBarTrack}>
          <div className={styles.memoryBarFillDisk} style={{ width: `${diskPct}%` }} />
        </div>
      </div>
      <div className={styles.memorySummary}>
        <span>{formatN(n)} vectors &times; {dim} dim</span>
        <span className={styles.memoryRatio}>
          DISK / RAM &asymp; <strong>{ratio.toFixed(0)}&times;</strong>
        </span>
      </div>
    </div>
  );
}
