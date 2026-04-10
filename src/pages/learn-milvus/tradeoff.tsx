import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useTranslation, Trans } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import Layout from '@/components/layout/commonLayout';
import { INDEXES, SCALES } from '@/components/learn-milvus/data/indexBenchmarks';
import type { Scale } from '@/components/learn-milvus/data/indexBenchmarks';
import TradeoffChart from '@/components/learn-milvus/components/TradeoffChart';
import styles from '@/components/learn-milvus/learnMilvus.module.css';

function formatMemory(mb: number): string {
  if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`;
  return `${mb} MB`;
}

function formatBuild(sec: number): string {
  if (sec === 0) return 'instant';
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.round(sec / 60)} min`;
  return `${(sec / 3600).toFixed(1)} h`;
}

function formatQps(qps: number): string {
  if (qps >= 1000) return `${(qps / 1000).toFixed(1)}k`;
  if (qps >= 10) return `${Math.round(qps)}`;
  return qps.toFixed(1);
}

export default function TradeoffDashboard() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('learnMilvus', { lng: locale });

  const [scale, setScale] = useState<Scale>('100K');
  const [highlight, setHighlight] = useState<string | null>(null);

  return (
    <Layout disableLangSelector>
      <Head>
        <title>{t('tradeoff.metaTitle')}</title>
      </Head>
      <div className={styles.tradeoffPage}>
        <header className={styles.playgroundHeader}>
          <Link href="/learn-milvus" className={styles.backLink}>&larr; {t('common.back')}</Link>
          <h1>{t('tradeoff.title')}</h1>
          <p>{t('tradeoff.subtitle')}</p>
        </header>

        <div className={styles.scaleSelector}>
          <span className={styles.scaleLabel}>{t('tradeoff.datasetScale')}</span>
          <div className={styles.scaleButtons}>
            {SCALES.map((s) => (
              <button
                key={s.id}
                className={`${styles.scaleBtn} ${scale === s.id ? styles.scaleBtnActive : ''}`}
                onClick={() => setScale(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tradeoffChartWrap}>
          <div className={styles.tradeoffChartHeader}>
            <div>
              <h3>{t('tradeoff.speedVsRecall')}</h3>
              <p className={styles.tradeoffChartSub}>
                <Trans t={t} i18nKey="tradeoff.bubbleSizeNote" components={{ strong: <strong key="strong" /> }} />
              </p>
            </div>
            <div className={styles.tradeoffChartLegend}>
              {INDEXES.map((idx) => (
                <button
                  key={idx.id}
                  className={`${styles.legendItem} ${highlight === idx.id ? styles.legendItemActive : ''}`}
                  onMouseEnter={() => setHighlight(idx.id)}
                  onMouseLeave={() => setHighlight(null)}
                >
                  <span className={styles.legendDot} style={{ background: idx.color }} />
                  {idx.name}
                </button>
              ))}
            </div>
          </div>
          <TradeoffChart width={780} height={420} indexes={INDEXES} scale={scale} highlight={highlight} onHighlight={setHighlight} />
        </div>

        <div className={styles.tradeoffCards}>
          {INDEXES.map((idx) => {
            const b = idx.perScale[scale];
            const isHighlighted = highlight === idx.id;
            const isFaded = highlight !== null && !isHighlighted;
            return (
              <div
                key={idx.id}
                className={`${styles.tradeoffCard} ${isHighlighted ? styles.tradeoffCardActive : ''} ${isFaded ? styles.tradeoffCardFaded : ''}`}
                style={{ borderTopColor: idx.color }}
                onMouseEnter={() => setHighlight(idx.id)}
                onMouseLeave={() => setHighlight(null)}
              >
                <div className={styles.tradeoffCardHeader}>
                  <h3>{idx.name}</h3>
                  <span className={styles.tradeoffCardDot} style={{ background: idx.color }} />
                </div>
                <p className={styles.tradeoffCardTag}>{idx.tagline}</p>

                <div className={styles.tradeoffCardMetrics}>
                  <div className={styles.metric}>
                    <div className={styles.metricLabelSmall}>{t('tradeoff.speedLabel')}</div>
                    <div className={styles.metricValueSmall}>{formatQps(b.qps)} qps</div>
                  </div>
                  <div className={styles.metric}>
                    <div className={styles.metricLabelSmall}>Recall@10</div>
                    <div className={styles.metricValueSmall}>{(b.recall * 100).toFixed(0)}%</div>
                  </div>
                  <div className={styles.metric}>
                    <div className={styles.metricLabelSmall}>{t('tradeoff.memoryLabel')}</div>
                    <div className={styles.metricValueSmall}>{formatMemory(b.memoryMB)}</div>
                  </div>
                  <div className={styles.metric}>
                    <div className={styles.metricLabelSmall}>{t('tradeoff.buildLabel')}</div>
                    <div className={styles.metricValueSmall}>{formatBuild(b.buildSec)}</div>
                  </div>
                </div>

                <div className={styles.tradeoffCardFooter}>
                  <div className={styles.tradeoffCardRow}>
                    <span className={`${styles.rowLabel} ${styles.rowLabelGood}`}>{'\u2713'} {t('tradeoff.bestFor')}</span>
                    <span>{idx.bestFor}</span>
                  </div>
                  <div className={styles.tradeoffCardRow}>
                    <span className={`${styles.rowLabel} ${styles.rowLabelBad}`}>{'\u2717'} {t('tradeoff.avoidWhen')}</span>
                    <span>{idx.worstFor}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.explainer}>
          <h3>{t('tradeoff.explainerTitle')}</h3>
          <ul>
            <li><Trans t={t} i18nKey="tradeoff.tip1" components={{ strong: <strong key="strong" /> }} /></li>
            <li><Trans t={t} i18nKey="tradeoff.tip2" components={{ strong: <strong key="strong" /> }} /></li>
            <li><Trans t={t} i18nKey="tradeoff.tip3" components={{ strong: <strong key="strong" /> }} /></li>
            <li><Trans t={t} i18nKey="tradeoff.tip4" components={{ strong: <strong key="strong" /> }} /></li>
          </ul>
          <p className={styles.takeaway}>
            <Trans t={t} i18nKey="tradeoff.takeaway" components={{ strong: <strong key="strong" /> }} />
          </p>
        </div>
      </div>
    </Layout>
  );
}
