import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';

type MetricKey = 'downloads' | 'stars' | 'customers' | 'scale';

type Metric =
  | { key: MetricKey; value: string }
  | { key: MetricKey; placeholderKey: string };

// Fixed values for community stats; placeholder keys read from i18n so that
// when engineering supplies real numbers, a translation edit is enough.
const METRICS: Metric[] = [
  { key: 'downloads', value: '25M+' },
  { key: 'stars', value: '35K+' },
  { key: 'customers', placeholderKey: 'production.placeholders.customers' },
  { key: 'scale', placeholderKey: 'production.placeholders.scale' },
];

// Logo list mirrored from src/parts/home/productionSection/ProductionSection.tsx
// Update both together if the production customer list changes.
const LOGO_PATHS: { src: string; alt: string }[] = [
  { src: '/images/home/brands/salesforce.svg', alt: 'Salesforce' },
  { src: '/images/home/brands/exa-ai.svg', alt: 'Exa.ai' },
  { src: '/images/home/brands/walmart.svg', alt: 'Walmart' },
  { src: '/images/home/brands/doordash.svg', alt: 'Doordash' },
  { src: '/images/home/brands/reddit.svg', alt: 'Reddit' },
  { src: '/images/home/brands/accenture.svg', alt: 'Accenture' },
  { src: '/images/home/brands/open-evidence.svg', alt: 'Open Evidence' },
  { src: '/images/home/brands/shell.svg', alt: 'Shell' },
  { src: '/images/home/brands/doximity.svg', alt: 'Doximity' },
  { src: '/images/home/brands/fiverr.svg', alt: 'Fiverr' },
  { src: '/images/home/brands/read-ai.svg', alt: 'Read.ai' },
  { src: '/images/home/brands/ebay.svg', alt: 'ebay' },
  { src: '/images/home/brands/notta-ai.svg', alt: 'Notta.ai' },
  { src: '/images/home/brands/bosch.svg', alt: 'Bosch' },
  { src: '/images/home/brands/nvidia.svg', alt: 'NVIDIA' },
  { src: '/images/home/brands/cisco.svg', alt: 'Cisco' },
  { src: '/images/home/brands/filevine.svg', alt: 'Filevine' },
  { src: '/images/home/brands/fanatics.svg', alt: 'Fanatics' },
  { src: '/images/home/brands/line.svg', alt: 'LINE' },
  { src: '/images/home/brands/roblox.svg', alt: 'ROBLOX' },
  { src: '/images/home/brands/airtable.svg', alt: 'Airtable' },
  { src: '/images/home/brands/plaud-ai.svg', alt: 'Pluad' },
  { src: '/images/home/brands/ibm.svg', alt: 'IBM' },
];

export default function ProductionSection2() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <span className={classes.eyebrow}>In Production</span>
          <h2 className={classes.title}>{t('production.sectionTitle')}</h2>
        </div>

        <div className={classes.numbersStrip}>
          {METRICS.map(m => (
            <div className={classes.metric} key={m.key}>
              <span className={classes.metricLabel}>
                // {t(`production.metrics.${m.key}`)}
              </span>
              <span className={classes.metricValue}>
                {'value' in m ? m.value : t(m.placeholderKey)}
              </span>
            </div>
          ))}
        </div>

        <div className={classes.logoWallHeader}>customers shipping milvus</div>

        <div className={classes.logoWall}>
          {LOGO_PATHS.map(l => (
            <div className={classes.logoCell} key={l.src}>
              <img
                src={l.src}
                alt={l.alt}
                className={classes.logoItem}
                width={100}
                height={40}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
