import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';
import ArchitectureDiagram from './diagram';

const PILLAR_KEYS = ['disaggregation', 'scale', 'tenant', 'deploy'] as const;

export default function ArchitectureSection() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <h2 className={classes.title}>{t('architecture.sectionTitle')}</h2>
          <p className={classes.subtitle}>{t('architecture.sectionSubtitle')}</p>
        </div>

        <div className={classes.diagramWrap}>
          <ArchitectureDiagram />
        </div>

        <div className={classes.pillarGrid}>
          {PILLAR_KEYS.map(key => (
            <article className={classes.pillarCard} key={key}>
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
          <span>⚡ {t('architecture.benchmark.latency')}</span>
          <span>📦 {t('architecture.benchmark.scale')}</span>
          <span>💰 {t('architecture.benchmark.cost')}</span>
          <span>🛰 {t('architecture.benchmark.clouds')}</span>
        </div>
      </div>
    </section>
  );
}
