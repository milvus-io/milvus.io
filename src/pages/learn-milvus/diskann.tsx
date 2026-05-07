import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useTranslation, Trans } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import Layout from '@/components/layout/commonLayout';
import type { Point } from '@/components/learn-milvus/algorithms/metrics';
import { buildDiskANN, searchDiskANN } from '@/components/learn-milvus/algorithms/diskann';
import { seededPoints } from '@/components/learn-milvus/data/generators';
import DiskANNCanvas from '@/components/learn-milvus/components/DiskANNCanvas';
import MemoryLayout from '@/components/learn-milvus/components/MemoryLayout';
import ParamSlider from '@/components/learn-milvus/components/ParamSlider';
import { useAnimationSteps } from '@/components/learn-milvus/hooks/useAnimationSteps';
import styles from '@/components/learn-milvus/learnMilvus.module.css';

const NUM_POINTS = 36;
const TOP_K = 3;
const PQ_US = 1;
const DISK_US = 100;

const SCALES = [
  { id: '1M', label: '1M', n: 1_000_000 },
  { id: '100M', label: '100M', n: 100_000_000 },
  { id: '1B', label: '1B', n: 1_000_000_000 },
] as const;

type ScaleId = (typeof SCALES)[number]['id'];

export default function DiskANNExplorer() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('learnMilvus', { lng: locale });

  const points = useMemo(() => seededPoints(23, NUM_POINTS, 220), []);
  const [R, setR] = useState(5);
  const [L, setL] = useState(8);
  const [reRank, setReRank] = useState(5);
  const [query, setQuery] = useState<Point>({ x: -50, y: 60 });
  const [speed, setSpeed] = useState(420);
  const [scale, setScale] = useState<ScaleId>('100M');

  const graph = useMemo(() => buildDiskANN(points, R), [points, R]);
  const result = useMemo(
    () => searchDiskANN(query, graph, L, reRank, TOP_K),
    [query, graph, L, reRank],
  );

  const totalSteps = result.steps.length;
  const { step, playing, play, pause, reset } = useAnimationSteps(totalSteps, speed);

  const handleQueryChange = useCallback(
    (p: Point) => { setQuery(p); reset(); },
    [reset],
  );

  const scaleN = SCALES.find((s) => s.id === scale)!.n;

  const currentStepDesc = useMemo(() => {
    if (step === 0) return t('common.pressRun');
    const s = result.steps[Math.min(step - 1, totalSteps - 1)];
    if (!s) return '';
    switch (s.type) {
      case 'enter':
        return t('diskann.stepEnter', { node: s.current });
      case 'pq-compare':
        return t('diskann.stepPqCompare', { count: s.neighbors.length, node: s.current });
      case 'move':
        return t('diskann.stepMove', { from: s.from, to: s.to });
      case 'pool-trim':
        return t('diskann.stepPoolTrim', { l: L });
      case 'disk-read':
        return t('diskann.stepDiskRead', { node: s.node });
      case 'done':
        return `${t('common.searchComplete')} Top-${TOP_K}: [${s.topK.join(', ')}].`;
    }
  }, [step, result.steps, totalSteps, L, t]);

  const latency = useMemo(() => {
    let pq = 0;
    let disk = 0;
    for (let i = 0; i < Math.min(step, result.steps.length); i++) {
      const s = result.steps[i];
      if (s.type === 'enter') pq += 1;
      else if (s.type === 'pq-compare') pq += s.neighbors.length;
      else if (s.type === 'disk-read') disk += 1;
    }
    return { pq, disk, totalUs: pq * PQ_US + disk * DISK_US };
  }, [step, result.steps]);

  return (
    <Layout disableLangSelector>
      <Head>
        <title>{t('diskann.metaTitle')}</title>
      </Head>
      <div className={styles.diskannPage}>
        <header className={styles.playgroundHeader}>
          <Link href="/learn-milvus" className={styles.backLink}>&larr; {t('common.back')}</Link>
          <h1>{t('diskann.title')}</h1>
          <p>
            <Trans t={t} i18nKey="diskann.subtitle" components={{ strong: <strong key="strong" /> }} />
          </p>
        </header>

        <div className={styles.diskannMemoryCard}>
          <div className={styles.diskannMemoryHeader}>
            <h3>{t('diskann.memoryWallTitle')}</h3>
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
          <MemoryLayout n={scaleN} dim={768} pqBytes={32} />
          <p className={styles.diskannMemoryNote}>{t('diskann.memoryNote')}</p>
        </div>

        <div className={styles.ivfControls}>
          <div className={styles.ivfButtons}>
            {!playing ? (
              <button className={styles.btnPrimary} onClick={play}>
                &#9654; {step >= totalSteps ? t('common.runAgain') : t('common.runSearch')}
              </button>
            ) : (
              <button className={styles.btnPrimary} onClick={pause}>&#9208; {t('common.pause')}</button>
            )}
            <button className={styles.btnSecondary} onClick={reset}>&#8634; {t('common.reset')}</button>
          </div>
          <div className={styles.diskannSliders}>
            <ParamSlider label="R" value={R} min={3} max={8} onChange={(v) => { setR(v); reset(); }} hint={t('diskann.rHint')} />
            <ParamSlider label="L" value={L} min={3} max={20} onChange={(v) => { setL(v); reset(); }} hint={t('diskann.lHint')} />
            <ParamSlider label="re-rank" value={reRank} min={TOP_K} max={Math.max(TOP_K, L)} onChange={(v) => { setReRank(v); reset(); }} hint={t('diskann.reRankHint')} />
            <ParamSlider label={t('common.speed')} value={speed} min={100} max={1200} onChange={setSpeed} display={(v) => `${v}ms`} hint={t('common.perStep')} />
          </div>
        </div>

        <div className={styles.hnswBody}>
          <div className={styles.hnswCanvasWrap}>
            <DiskANNCanvas width={620} height={460} graph={graph} query={query} onQueryChange={handleQueryChange} steps={result.steps} stepIdx={step} topK={result.topK} />
            <div className={styles.diskannLegend}>
              <span><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', marginRight: 4, background: '#7dd3fc' }} /> {t('diskann.legendPqCompare')}</span>
              <span><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', marginRight: 4, background: '#38bdf8' }} /> {t('diskann.legendCandidatePool')}</span>
              <span><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', marginRight: 4, background: '#dc3545' }} /> {t('diskann.legendDiskReRank')}</span>
              <span><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', marginRight: 4, background: '#16a34a' }} /> {t('diskann.legendTopK')}</span>
            </div>
          </div>
          <div className={styles.hnswSide}>
            <div className={styles.hnswStepCard}>
              <div className={styles.hnswStepLabel}>{t('common.currentStep')}</div>
              <div className={styles.hnswStepCounter}>{step} / {totalSteps}</div>
              <div className={styles.hnswStepDesc}>{currentStepDesc}</div>
            </div>

            <div className={styles.statsPanel}>
              <h3>{t('diskann.costSoFar')}</h3>
              <div className={styles.diskannCost}>
                <div className={styles.diskannCostRow}>
                  <span className={`${styles.diskannCostLabel} ${styles.diskannCostLabelRam}`}>{t('diskann.ramPqCompares')}</span>
                  <span className={styles.diskannCostValue}>{latency.pq}</span>
                  <span className={styles.diskannCostSub}>&asymp; {(latency.pq * PQ_US).toFixed(0)} &micro;s</span>
                </div>
                <div className={styles.diskannCostRow}>
                  <span className={`${styles.diskannCostLabel} ${styles.diskannCostLabelDisk}`}>{t('diskann.ssdReads')}</span>
                  <span className={styles.diskannCostValue}>{latency.disk}</span>
                  <span className={styles.diskannCostSub}>&asymp; {(latency.disk * DISK_US).toFixed(0)} &micro;s</span>
                </div>
                <div className={styles.diskannCostTotal}>
                  <span>{t('common.totalLatency')}</span>
                  <strong>{(latency.totalUs / 1000).toFixed(2)} ms</strong>
                </div>
              </div>
              <div className={styles.diskannNote}>
                <Trans t={t} i18nKey="diskann.modelNote" components={{ code: <code key="code" className={styles.codeInline} /> }} />
              </div>
            </div>

            <div className={styles.statsPanel}>
              <h3>{t('common.searchStats')}</h3>
              <div className={styles.statsMeta}>
                <div className={styles.statsMetaLabel}>{t('common.visited')}</div>
                <div className={styles.statsMetaValue}>{result.visited.length} / {NUM_POINTS}</div>
                <div className={styles.statsMetaLabel}>{t('diskann.reRanked')}</div>
                <div className={styles.statsMetaValue}>{result.diskReads}</div>
                <div className={styles.statsMetaLabel}>Top-{TOP_K}</div>
                <div className={styles.statsMetaValue}>[{result.topK.join(', ')}]</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.explainer}>
          <h3>{t('diskann.explainerTitle')}</h3>
          <ol>
            <li><Trans t={t} i18nKey="diskann.step1" components={{ strong: <strong key="strong" />, code: <code key="code" className={styles.codeInline} /> }} /></li>
            <li><Trans t={t} i18nKey="diskann.step2" components={{ strong: <strong key="strong" /> }} /></li>
            <li><Trans t={t} i18nKey="diskann.step3" components={{ strong: <strong key="strong" />, code: <code key="code" className={styles.codeInline} /> }} /></li>
            <li><Trans t={t} i18nKey="diskann.step4" components={{ strong: <strong key="strong" />, em: <em key="em" /> }} /></li>
            <li><Trans t={t} i18nKey="diskann.step5" components={{ strong: <strong key="strong" /> }} /></li>
          </ol>
          <h4>{t('diskann.theTradeTitle')}</h4>
          <ul>
            <li><Trans t={t} i18nKey="diskann.whyScales" components={{ strong: <strong key="strong" /> }} /></li>
            <li><Trans t={t} i18nKey="diskann.whySlower" components={{ strong: <strong key="strong" /> }} /></li>
            <li><Trans t={t} i18nKey="diskann.whyBeats" components={{ strong: <strong key="strong" /> }} /></li>
          </ul>
          <p className={styles.takeaway}>
            <Trans t={t} i18nKey="diskann.takeaway" components={{ strong: <strong key="strong" /> }} />
          </p>
        </div>
      </div>
    </Layout>
  );
}
