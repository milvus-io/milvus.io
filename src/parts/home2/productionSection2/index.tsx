import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';

type Metric = {
  value: string;
  labelKey: 'downloads' | 'stars' | 'customers' | 'scale';
};

const METRICS: Metric[] = [
  { value: '25M+', labelKey: 'downloads' },
  { value: '35K+', labelKey: 'stars' },
  { value: 'XX+', labelKey: 'customers' },
  { value: 'XX billion', labelKey: 'scale' },
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
        <h2 className={classes.title}>{t('production.sectionTitle')}</h2>

        <div className={classes.numbersStrip}>
          {METRICS.map(m => (
            <div className={classes.metric} key={m.labelKey}>
              <span className={classes.metricValue}>{m.value}</span>
              <span className={classes.metricLabel}>
                {t(`production.metrics.${m.labelKey}`)}
              </span>
            </div>
          ))}
        </div>

        <div className={classes.logoWall}>
          {LOGO_PATHS.map(l => (
            <img
              key={l.src}
              src={l.src}
              alt={l.alt}
              className={classes.logoItem}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
