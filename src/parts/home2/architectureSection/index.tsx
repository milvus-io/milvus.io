import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';
import ArchitectureDiagram from './diagram';

const PILLAR_KEYS = ['disaggregation', 'scale', 'tenant', 'deploy'] as const;

const BENCHMARK_ITEMS = [
  { key: 'latency', label: 'latency' },
  { key: 'scale', label: 'scale' },
  { key: 'cost', label: 'cost' },
  { key: 'clouds', label: 'clouds' },
] as const;

export default function ArchitectureSection() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <span className={classes.eyebrow}>Infrastructure</span>
          <h2 className={classes.title}>{t('architecture.sectionTitle')}</h2>
          <p className={classes.subtitle}>{t('architecture.sectionSubtitle')}</p>
        </div>

        <div className={classes.diagramWrap}>
          <div className={classes.diagramHeader}>
            <span className={classes.diagramHeaderTitle}>
              milvus ▸ architecture
            </span>
            <span className={classes.diagramHeaderMeta}>v2.6.x · 4 layers</span>
          </div>
          <ArchitectureDiagram />
        </div>

        <div className={classes.pillarGrid}>
          {PILLAR_KEYS.map((key, idx) => (
            <article className={classes.pillarCard} key={key}>
              <span className={classes.pillarIndex} aria-hidden>
                0{idx + 1}
              </span>
              <h3 className={classes.pillarTitle}>
                {t(`architecture.pillars.${key}.title`)}
              </h3>
              <p className={classes.pillarBody}>
                {t(`architecture.pillars.${key}.body`)}
              </p>
            </article>
          ))}
        </div>

        <div className={classes.benchmarkStrip}>
          {BENCHMARK_ITEMS.map(item => (
            <div className={classes.benchmarkItem} key={item.key}>
              <span className={classes.benchmarkLabel}>// {item.label}</span>
              <span className={classes.benchmarkValue}>
                {t(`architecture.benchmark.${item.key}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
