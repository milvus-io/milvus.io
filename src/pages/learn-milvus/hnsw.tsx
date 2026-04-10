import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useTranslation, Trans } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import Layout from '@/components/layout/commonLayout';
import type { Point } from '@/components/learn-milvus/algorithms/metrics';
import { buildHNSW, searchHNSW } from '@/components/learn-milvus/algorithms/hnsw';
import { seededPoints } from '@/components/learn-milvus/data/generators';
import HNSWGraph from '@/components/learn-milvus/components/HNSWGraph';
import ParamSlider from '@/components/learn-milvus/components/ParamSlider';
import { useAnimationSteps } from '@/components/learn-milvus/hooks/useAnimationSteps';
import styles from '@/components/learn-milvus/learnMilvus.module.css';

const NUM_POINTS = 30;
const TOP_K = 3;

export default function HNSWExplorer() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('learnMilvus', { lng: locale });

  const points = useMemo(() => seededPoints(11, NUM_POINTS, 220), []);
  const [M, setM] = useState(4);
  const [ef, setEf] = useState(8);
  const [query, setQuery] = useState<Point>({ x: 60, y: -40 });
  const [speed, setSpeed] = useState(450);

  const graph = useMemo(() => buildHNSW(points, M, 13), [points, M]);
  const result = useMemo(
    () => searchHNSW(query, graph, ef, TOP_K),
    [query, graph, ef],
  );

  const totalSteps = result.steps.length;
  const { step, playing, play, pause, reset } = useAnimationSteps(totalSteps, speed);

  const handleQueryChange = useCallback(
    (p: Point) => { setQuery(p); reset(); },
    [reset],
  );

  const layerCounts = useMemo(() => {
    const counts = new Array(graph.numLayers).fill(0);
    for (const n of graph.nodes) {
      for (let l = 0; l <= n.maxLayer; l++) counts[l]++;
    }
    return counts;
  }, [graph]);

  const currentStepDesc = useMemo(() => {
    if (step === 0) return t('common.pressRun');
    const s = result.steps[Math.min(step - 1, totalSteps - 1)];
    if (!s) return '';
    switch (s.type) {
      case 'enter':
        return t('hnsw.stepEnter', { layer: s.layer, node: s.current });
      case 'evaluate':
        return t('hnsw.stepEvaluate', { layer: s.layer, count: s.neighbors.length, node: s.current });
      case 'move':
        return t('hnsw.stepMove', { layer: s.layer, from: s.from, to: s.to });
      case 'drop':
        return t('hnsw.stepDrop', { layer: s.layer });
      case 'done':
        return `${t('common.searchComplete')} Top-${TOP_K}: [${s.topK.join(', ')}].`;
    }
  }, [step, result.steps, totalSteps, t]);

  return (
    <Layout disableLangSelector>
      <Head>
        <title>{t('hnsw.metaTitle')}</title>
      </Head>
      <div className={styles.hnswExplorer}>
        <header className={styles.playgroundHeader}>
          <Link href="/learn-milvus" className={styles.backLink}>&larr; {t('common.back')}</Link>
          <h1>{t('hnsw.title')}</h1>
          <p>
            <Trans t={t} i18nKey="hnsw.subtitle" components={{ queryPoint: <span key="qp" style={{ color: '#00a1ea', fontWeight: 700 }} />, code: <code key="code" className={styles.codeInline} /> }} />
          </p>
        </header>

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
          <div className={styles.hnswSliders}>
            <ParamSlider label="M" value={M} min={2} max={8} onChange={(v) => { setM(v); reset(); }} hint={t('hnsw.mHint')} />
            <ParamSlider label="ef" value={ef} min={1} max={20} onChange={(v) => { setEf(v); reset(); }} hint={t('hnsw.efHint')} />
            <ParamSlider label={t('common.speed')} value={speed} min={100} max={1200} onChange={setSpeed} display={(v) => `${v}ms`} hint={t('common.perStep')} />
          </div>
        </div>

        <div className={styles.hnswBody}>
          <div className={styles.hnswCanvasWrap}>
            <HNSWGraph width={620} graph={graph} query={query} onQueryChange={handleQueryChange} steps={result.steps} stepIdx={step} topK={result.topK} />
          </div>
          <div className={styles.hnswSide}>
            <div className={styles.hnswStepCard}>
              <div className={styles.hnswStepLabel}>{t('common.currentStep')}</div>
              <div className={styles.hnswStepCounter}>{step} / {totalSteps}</div>
              <div className={styles.hnswStepDesc}>{currentStepDesc}</div>
            </div>

            <div className={styles.statsPanel}>
              <h3>{t('common.searchStats')}</h3>
              <div className={styles.statsMeta}>
                <div className={styles.statsMetaLabel}>{t('common.visited')}</div>
                <div className={styles.statsMetaValue}>{result.comparisons} / {NUM_POINTS}</div>
                <div className={styles.statsMetaLabel}>{t('hnsw.layers')}</div>
                <div className={styles.statsMetaValue}>{graph.numLayers}</div>
                <div className={styles.statsMetaLabel}>{t('hnsw.entry')}</div>
                <div className={styles.statsMetaValue}>node {graph.entryPoint}</div>
                <div className={styles.statsMetaLabel}>Top-{TOP_K}</div>
                <div className={styles.statsMetaValue}>[{result.topK.join(', ')}]</div>
              </div>
            </div>

            <div className={styles.statsPanel}>
              <h3>{t('hnsw.layerDistribution')}</h3>
              <div className={styles.hnswLayerBars}>
                {layerCounts.map((_c, i) => {
                  const layer = layerCounts.length - 1 - i;
                  const count = layerCounts[layer];
                  const pct = (count / NUM_POINTS) * 100;
                  return (
                    <div key={layer} className={styles.hnswLayerBar}>
                      <span className={styles.hnswLayerBarLabel}>L{layer}</span>
                      <div className={styles.hnswLayerBarTrack}>
                        <div className={styles.hnswLayerBarFill} style={{ width: `${pct}%` }} />
                      </div>
                      <span className={styles.hnswLayerBarCount}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.explainer}>
          <h3>{t('hnsw.explainerTitle')}</h3>
          <ol>
            <li><Trans t={t} i18nKey="hnsw.step1" components={{ strong: <strong key="strong" /> }} /></li>
            <li><Trans t={t} i18nKey="hnsw.step2" components={{ strong: <strong key="strong" />, code: <code key="code" className={styles.codeInline} /> }} /></li>
            <li><Trans t={t} i18nKey="hnsw.step3" components={{ strong: <strong key="strong" /> }} /></li>
            <li><Trans t={t} i18nKey="hnsw.step4" components={{ strong: <strong key="strong" /> }} /></li>
            <li><Trans t={t} i18nKey="hnsw.step5" components={{ strong: <strong key="strong" />, code: <code key="code" className={styles.codeInline} /> }} /></li>
          </ol>
          <p className={styles.takeaway}>
            <Trans t={t} i18nKey="hnsw.takeaway" components={{ strong: <strong key="strong" />, code: <code key="code" className={styles.codeInline} /> }} />
          </p>
        </div>
      </div>
    </Layout>
  );
}
