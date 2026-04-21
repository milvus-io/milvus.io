import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';

const CARD_KEYS = ['nandula', 'bhargav', 'igor'] as const;

export default function LovedSection2() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <span className={classes.eyebrow}>Developers</span>
          <h2 className={classes.title}>{t('loved.title')}</h2>
        </div>
        <div className={classes.grid}>
          {CARD_KEYS.map(key => (
            <article className={classes.card} key={key}>
              <span className={classes.quoteMark} aria-hidden>
                &ldquo;
              </span>
              <p className={classes.content}>
                {t(`loved.cards.${key}.content`)}
              </p>
              <div className={classes.byline}>
                <div className={classes.author}>
                  {t(`loved.cards.${key}.author`)}
                </div>
                <div className={classes.jobTitle}>
                  {t(`loved.cards.${key}.title`)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
