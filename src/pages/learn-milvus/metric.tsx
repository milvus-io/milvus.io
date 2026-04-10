import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useTranslation, Trans } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import Layout from '@/components/layout/commonLayout';
import { rankNeighbors } from '@/components/learn-milvus/algorithms/metrics';
import type { Point, MetricType } from '@/components/learn-milvus/algorithms/metrics';
import { seededPoints } from '@/components/learn-milvus/data/generators';
import VectorCanvas from '@/components/learn-milvus/components/VectorCanvas';
import MetricSwitch from '@/components/learn-milvus/components/MetricSwitch';
import StatsPanel from '@/components/learn-milvus/components/StatsPanel';
import styles from '@/components/learn-milvus/learnMilvus.module.css';

const NUM_POINTS = 20;
const TOP_K = 5;

const PALETTE = [
  '#0077ad', '#16a34a', '#d97706', '#9333ea', '#dc3545',
  '#0d9488', '#4f46e5', '#db2777', '#65a30d', '#ea580c',
  '#06b6d4', '#6d28d9', '#c026d3', '#15803d', '#c2410c',
  '#0891b2', '#7c3aed', '#e11d48', '#0284c7', '#b45309',
];

export default function MetricPlayground() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('learnMilvus', { lng: locale });

  const [metric, setMetric] = useState<MetricType>('L2');
  const [query, setQuery] = useState<Point>({ x: 60, y: 80 });

  const points = useMemo(() => seededPoints(42, NUM_POINTS), []);
  const colors = useMemo(() => PALETTE.slice(0, NUM_POINTS), []);

  const ranked = useMemo(
    () => rankNeighbors(query, points, metric),
    [query, points, metric],
  );

  const handleQueryChange = useCallback((p: Point) => setQuery(p), []);

  const DESCRIPTIONS: Record<MetricType, { title: string; body: string }> = {
    L2: { title: t('metric.l2Title'), body: t('metric.l2Desc') },
    COSINE: { title: t('metric.cosineTitle'), body: t('metric.cosineDesc') },
    IP: { title: t('metric.ipTitle'), body: t('metric.ipDesc') },
  };

  const desc = DESCRIPTIONS[metric];

  return (
    <Layout disableLangSelector>
      <Head>
        <title>{t('metric.metaTitle')}</title>
      </Head>
      <div className={styles.playground}>
        <header className={styles.playgroundHeader}>
          <Link href="/learn-milvus" className={styles.backLink}>
            &larr; {t('common.back')}
          </Link>
          <h1>{t('metric.title')}</h1>
          <p>
            <Trans t={t} i18nKey="metric.subtitle" components={{ queryPoint: <span key="qp" style={{ color: '#00a1ea', fontWeight: 700 }} /> }} />
          </p>
        </header>

        <MetricSwitch value={metric} onChange={setMetric} />

        <div className={styles.playgroundBody}>
          <div className={styles.playgroundCanvas}>
            <VectorCanvas
              width={640}
              height={520}
              points={points}
              query={query}
              onQueryChange={handleQueryChange}
              metric={metric}
              topKIndices={ranked}
              colors={colors}
              topK={TOP_K}
            />
          </div>
          <div className={styles.playgroundSide}>
            <StatsPanel
              query={query}
              points={points}
              rankedIndices={ranked}
              metric={metric}
              topK={TOP_K}
              colors={colors}
            />
            <div className={styles.metricInfo}>
              <h3>{desc.title}</h3>
              <p>{desc.body}</p>
            </div>
          </div>
        </div>

        <div className={styles.explainer}>
          <h3>{t('metric.explainerTitle')}</h3>
          <p className={styles.explainerLead}>
            <Trans t={t} i18nKey="metric.explainerP1" components={{ strong: <strong key="strong" /> }} />
          </p>
          <p className={styles.explainerLead}>
            <Trans t={t} i18nKey="metric.explainerP2" components={{ strong: <strong key="strong" /> }} />
          </p>

          <h4>{t('metric.threeInPractice')}</h4>
          <ul>
            <li><Trans t={t} i18nKey="metric.l2Explain" components={{ strong: <strong key="strong" />, em: <em key="em" /> }} /></li>
            <li><Trans t={t} i18nKey="metric.cosineExplain" components={{ strong: <strong key="strong" />, em: <em key="em" /> }} /></li>
            <li><Trans t={t} i18nKey="metric.ipExplain" components={{ strong: <strong key="strong" />, em: <em key="em" /> }} /></li>
          </ul>

          <h4>{t('metric.twoRules')}</h4>
          <ul>
            <li><Trans t={t} i18nKey="metric.matchMetric" components={{ strong: <strong key="strong" />, em: <em key="em" /> }} /></li>
            <li><Trans t={t} i18nKey="metric.stayConsistent" components={{ strong: <strong key="strong" /> }} /></li>
          </ul>

          <p className={styles.takeaway}>
            <Trans t={t} i18nKey="metric.tryThis" components={{ strong: <strong key="strong" /> }} />
          </p>
        </div>
      </div>
    </Layout>
  );
}
