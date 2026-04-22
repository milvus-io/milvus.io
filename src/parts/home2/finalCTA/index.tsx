import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import { CLOUD_SIGNUP_LINK } from '@/consts/links';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';

export default function FinalCTA() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <h2 className={classes.title}>{t('finalCta.title')}</h2>
        </div>

        <div className={classes.grid}>
          <article className={classes.card}>
            <span className={classes.cardIndex} aria-hidden>
              {t('finalCta.selfHost.tag')}
            </span>
            <h3 className={classes.cardTitle}>{t('finalCta.selfHost.label')}</h3>
            <p className={classes.cardBody}>{t('finalCta.selfHost.body')}</p>
            <a href="/docs" className={classes.button}>
              {t('finalCta.selfHost.button')} →
            </a>
          </article>

          <article className={`${classes.card} ${classes.cardAccent}`}>
            <span className={classes.cardIndex} aria-hidden>
              {t('finalCta.cloud.tag')}
            </span>
            <h3 className={classes.cardTitle}>{t('finalCta.cloud.label')}</h3>
            <p className={classes.cardBody}>{t('finalCta.cloud.body')}</p>
            <a
              href={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_homepage_final&utm_content=home2`}
              className={`${classes.button} ${classes.buttonPrimary}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('finalCta.cloud.button')} →
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
