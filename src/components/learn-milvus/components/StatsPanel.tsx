import { computeMetric, isHigherBetter } from '../algorithms/metrics';
import type { Point, MetricType } from '../algorithms/metrics';
import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import styles from '../learnMilvus.module.css';

interface Props {
  query: Point;
  points: Point[];
  rankedIndices: number[];
  metric: MetricType;
  topK?: number;
  colors: string[];
}

export default function StatsPanel({
  query,
  points,
  rankedIndices,
  metric,
  topK = 5,
  colors,
}: Props) {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('learnMilvus', { lng: locale });

  const higherBetter = isHigherBetter(metric);
  const topIndices = rankedIndices.slice(0, topK);

  return (
    <div className={styles.statsPanel}>
      <h3>
        {t('metric.topKTitle', { k: topK })}
        <span className={styles.statsHint}>
          {higherBetter ? t('metric.higherCloser') : t('metric.lowerCloser')}
        </span>
      </h3>
      <div className={styles.statsList}>
        {topIndices.map((idx, rank) => {
          const score = computeMetric(query, points[idx], metric);
          const displayScore =
            metric === 'L2' ? Math.sqrt(score).toFixed(1) : score.toFixed(3);
          return (
            <div key={idx} className={styles.statsRow}>
              <span className={styles.statsRank}>#{rank + 1}</span>
              <span className={styles.statsDot} style={{ background: colors[idx] }} />
              <span className={styles.statsId}>P{idx}</span>
              <span className={styles.statsScore}>{displayScore}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.statsMeta}>
        <div className={styles.statsMetaLabel}>{t('metric.metricLabel')}</div>
        <div className={styles.statsMetaValue}>{metric}</div>
        <div className={styles.statsMetaLabel}>{t('metric.shows')}</div>
        <div className={styles.statsMetaValue}>
          {metric === 'L2'
            ? t('metric.euclideanDist')
            : metric === 'COSINE'
              ? t('metric.cosAngle')
              : t('metric.dotProduct')}
        </div>
      </div>
    </div>
  );
}
