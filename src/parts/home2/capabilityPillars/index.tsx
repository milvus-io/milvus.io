import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';
import CodeHighlight from '../components/CodeHighlight';
import { PILLARS } from './const';

export default function CapabilityPillars() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <span className={classes.eyebrow}>Capabilities</span>
          <h2 className={classes.title}>{t('pillars.sectionTitle')}</h2>
          <p className={classes.subtitle}>{t('pillars.sectionSubtitle')}</p>
        </div>
        <div className={classes.grid}>
          {PILLARS.map((pillar, idx) => {
            const isExternal = /^https?:\/\//i.test(pillar.learnMoreHref);
            return (
              <article className={classes.card} key={pillar.id}>
                <span className={classes.cardIndex} aria-hidden>
                  0{idx + 1}
                </span>
                <h3 className={classes.cardTitle}>
                  {t(`pillars.${pillar.id}.title`)}
                </h3>
                <p className={classes.cardBody}>{t(`pillars.${pillar.id}.body`)}</p>
                <div className={classes.codeBlock}>
                  <CodeHighlight code={pillar.code} language={pillar.language} />
                </div>
                <a
                  href={pillar.learnMoreHref}
                  className={classes.learnMore}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                >
                  {t('pillars.learnMore')}
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
