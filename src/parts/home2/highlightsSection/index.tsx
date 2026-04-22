import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';

const HIGHLIGHTS = [
  'lake',
  'multivector',
  'hardware',
  'tiering',
  'streaming',
  'enterprise',
] as const;

export default function HighlightsSection() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <span className={classes.eyebrow}>{t('highlights.eyebrow')}</span>
          <h2 className={classes.title}>
            <span className={classes.titleLine}>
              {t('highlights.titleLine1')}
            </span>
            <span
              className={`${classes.titleLine} ${classes.titleLineAccent}`}
            >
              {t('highlights.titleLine2')}
            </span>
            <span className={classes.titleLine}>
              {t('highlights.titleLine3')}
            </span>
          </h2>
        </div>

        <div className={classes.grid}>
          {HIGHLIGHTS.map((id, idx) => (
            <article className={classes.card} key={id}>
              <span className={classes.cardTag}>
                <span className={classes.cardIndex} aria-hidden>
                  0{idx + 1}
                </span>
                {t(`highlights.cards.${id}.tag`)}
              </span>
              <h3 className={classes.cardTitle}>
                {t(`highlights.cards.${id}.title`)}
              </h3>
              <p className={classes.cardBody}>
                {t(`highlights.cards.${id}.body`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
