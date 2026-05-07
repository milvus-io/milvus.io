import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useTranslation, Trans } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import Layout from '@/components/layout/commonLayout';
import type { Point } from '@/components/learn-milvus/algorithms/metrics';
import {
  kmeans,
  flatSearch,
  ivfSearch,
  recallAtK,
} from '@/components/learn-milvus/algorithms/ivf';
import IndexCanvas from '@/components/learn-milvus/components/IndexCanvas';
import type { Progress } from '@/components/learn-milvus/components/IndexCanvas';
import ParamSlider from '@/components/learn-milvus/components/ParamSlider';
import { useAnimationSteps } from '@/components/learn-milvus/hooks/useAnimationSteps';
import styles from '@/components/learn-milvus/learnMilvus.module.css';

const NUM_POINTS = 200;
const K = 8;
const TOP_K = 5;

const CLUSTER_COLORS = [
  '#0077ad', '#16a34a', '#d97706', '#9333ea',
  '#dc3545', '#0d9488', '#4f46e5', '#ea580c',
];

function makeStablePoints(): Point[] {
  let s = 1234;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const k = K;
  const centers: Point[] = [];
  for (let i = 0; i < k; i++) {
    centers.push({ x: (rand() - 0.5) * 380, y: (rand() - 0.5) * 380 });
  }
  const out: Point[] = [];
  const per = Math.floor(NUM_POINTS / k);
  for (const c of centers) {
    for (let i = 0; i < per; i++) {
      out.push({
        x: c.x + (rand() - 0.5) * 80,
        y: c.y + (rand() - 0.5) * 80,
      });
    }
  }
  while (out.length < NUM_POINTS) {
    out.push({ x: (rand() - 0.5) * 400, y: (rand() - 0.5) * 400 });
  }
  return out;
}

export default function IVFLab() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('learnMilvus', { lng: locale });

  const points = useMemo(() => makeStablePoints(), []);
  const clusters = useMemo(() => kmeans(points, K, 7), [points]);

  const [query, setQuery] = useState<Point>({ x: 30, y: 50 });
  const [nprobe, setNprobe] = useState(2);
  const [speed, setSpeed] = useState(20);

  const flat = useMemo(() => flatSearch(query, points, TOP_K), [query, points]);
  const ivf = useMemo(
    () => ivfSearch(query, points, clusters, nprobe, TOP_K),
    [query, points, clusters, nprobe],
  );

  const recall = recallAtK(ivf.topK, flat.topK);

  const flatTotal = points.length;
  const ivfTotal = clusters.length + ivf.scannedPoints.length;
  const maxSteps = Math.max(flatTotal, ivfTotal);

  const { step, playing, play, pause, reset } = useAnimationSteps(maxSteps, speed);

  const flatScanned = Math.min(step, flatTotal);
  const flatDone = flatScanned >= flatTotal;

  const centroidsEvaluated = Math.min(step, clusters.length);
  const pointsScanned = Math.max(0, Math.min(step - clusters.length, ivf.scannedPoints.length));
  const ivfDone = step >= ivfTotal;

  const flatProgress: Progress = {
    mode: 'flat',
    scanOrder: flat.scanOrder,
    scanned: flatScanned,
    topK: flat.topK,
    done: flatDone,
  };

  const ivfProgress: Progress = {
    mode: 'ivf',
    clusters,
    centroidEvalOrder: ivf.centroidEvalOrder,
    centroidsEvaluated,
    selectedClusters: ivf.selectedClusters,
    scannedPoints: ivf.scannedPoints,
    pointsScanned,
    topK: ivf.topK,
    done: ivfDone,
  };

  const handleQueryChange = useCallback((p: Point) => {
    setQuery(p);
    reset();
  }, [reset]);

  return (
    <Layout disableLangSelector>
      <Head>
        <title>{t('ivf.metaTitle')}</title>
      </Head>
      <div className={styles.ivfLab}>
        <header className={styles.playgroundHeader}>
          <Link href="/learn-milvus" className={styles.backLink}>&larr; {t('common.back')}</Link>
          <h1>{t('ivf.title')}</h1>
          <p>
            <Trans t={t} i18nKey="ivf.subtitle" components={{ queryPoint: <span key="qp" style={{ color: '#00a1ea', fontWeight: 700 }} />, code: <code key="code" className={styles.codeInline} />, strong: <strong key="strong" /> }} />
          </p>
        </header>

        <div className={styles.ivfControls}>
          <div className={styles.ivfButtons}>
            {!playing ? (
              <button className={styles.btnPrimary} onClick={play}>
                &#9654; {step >= maxSteps ? t('common.runAgain') : t('common.runSearch')}
              </button>
            ) : (
              <button className={styles.btnPrimary} onClick={pause}>&#9208; {t('common.pause')}</button>
            )}
            <button className={styles.btnSecondary} onClick={reset}>&#8634; {t('common.reset')}</button>
          </div>
          <div className={styles.ivfSliders}>
            <ParamSlider
              label="nprobe"
              value={nprobe}
              min={1}
              max={K}
              onChange={(v) => { setNprobe(v); reset(); }}
              hint={t('ivf.nprobeHint', { nprobe, k: K })}
            />
            <ParamSlider
              label={t('common.speed')}
              value={speed}
              min={5}
              max={150}
              onChange={setSpeed}
              display={(v) => `${v}ms`}
              hint={t('common.lowerFaster')}
            />
          </div>
        </div>

        <div className={styles.ivfSplit}>
          <div className={styles.ivfSide}>
            <div className={styles.ivfTitle}>
              <h3>{t('ivf.flatTitle')}</h3>
              <span className={styles.ivfTag}>{t('ivf.flatTag')}</span>
            </div>
            <IndexCanvas
              width={500}
              height={420}
              points={points}
              query={query}
              onQueryChange={handleQueryChange}
              progress={flatProgress}
            />
            <div className={styles.ivfStats}>
              <div className={styles.stat}>
                <div className={styles.statLabel}>{t('common.comparisons')}</div>
                <div className={styles.statValue}>{flatScanned} / {points.length}</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statLabel}>{t('common.status')}</div>
                <div className={styles.statValue}>{flatDone ? `\u2713 ${t('common.done')}` : t('common.scanning')}</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statLabel}>{t('common.recall')}</div>
                <div className={styles.statValue}>100%</div>
              </div>
            </div>
          </div>

          <div className={styles.ivfSide}>
            <div className={styles.ivfTitle}>
              <h3>{t('ivf.ivfTitle')}</h3>
              <span className={styles.ivfTag}>{t('ivf.ivfTag')}</span>
            </div>
            <IndexCanvas
              width={500}
              height={420}
              points={points}
              query={query}
              onQueryChange={handleQueryChange}
              progress={ivfProgress}
              clusterColors={CLUSTER_COLORS}
            />
            <div className={styles.ivfStats}>
              <div className={styles.stat}>
                <div className={styles.statLabel}>{t('common.comparisons')}</div>
                <div className={styles.statValue}>{Math.min(step, ivfTotal)} / {ivfTotal}</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statLabel}>{t('common.status')}</div>
                <div className={styles.statValue}>
                  {ivfDone
                    ? `\u2713 ${t('common.done')}`
                    : centroidsEvaluated < clusters.length
                      ? t('ivf.evalCentroids')
                      : t('ivf.scanClusters')}
                </div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statLabel}>Recall@{TOP_K}</div>
                <div
                  className={styles.statValue}
                  style={{ color: recall === 1 ? '#16a34a' : recall >= 0.6 ? '#d97706' : '#dc3545' }}
                >
                  {(recall * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.explainer}>
          <h3>{t('ivf.explainerTitle')}</h3>
          <ol>
            <li><Trans t={t} i18nKey="ivf.step1" values={{ points: points.length, k: K }} components={{ strong: <strong key="strong" /> }} /></li>
            <li><Trans t={t} i18nKey="ivf.step2" values={{ k: K }} components={{ strong: <strong key="strong" /> }} /></li>
            <li><Trans t={t} i18nKey="ivf.step3" components={{ strong: <strong key="strong" />, code: <code key="code" className={styles.codeInline} /> }} /></li>
            <li><Trans t={t} i18nKey="ivf.step4" values={{ scanned: Math.round((NUM_POINTS / K) * nprobe), total: NUM_POINTS }} components={{ strong: <strong key="strong" /> }} /></li>
          </ol>
          <p className={styles.takeaway}>
            <Trans t={t} i18nKey="ivf.takeaway" components={{ strong: <strong key="strong" />, code: <code key="code" className={styles.codeInline} /> }} />
          </p>
        </div>
      </div>
    </Layout>
  );
}
