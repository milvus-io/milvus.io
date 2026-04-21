import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import { CLOUD_SIGNUP_LINK } from '@/consts/links';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';

export default function FinalCTA() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });
  const [copied, setCopied] = useState(false);

  const pythonBody = t('finalCta.python.body');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pythonBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* no-op */
    }
  };

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <h2 className={classes.title}>{t('finalCta.title')}</h2>

        <div className={classes.grid}>
          <article className={classes.card}>
            <span className={classes.icon} aria-hidden>🐍</span>
            <h3 className={classes.cardTitle}>{t('finalCta.python.label')}</h3>
            <code className={classes.body}>{pythonBody}</code>
            <button
              type="button"
              onClick={handleCopy}
              className={classes.button}
              aria-label={`Copy ${t('finalCta.python.label')} command`}
            >
              {copied ? t('finalCta.python.copied') : `${t('finalCta.python.button')} →`}
            </button>
          </article>

          <article className={classes.card}>
            <span className={classes.icon} aria-hidden>☁️</span>
            <h3 className={classes.cardTitle}>{t('finalCta.cloud.label')}</h3>
            <span className={classes.body}>{t('finalCta.cloud.body')}</span>
            <a
              href={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_homepage_final&utm_content=home2`}
              className={classes.button}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('finalCta.cloud.button')} →
            </a>
          </article>

          <article className={classes.card}>
            <span className={classes.icon} aria-hidden>📖</span>
            <h3 className={classes.cardTitle}>{t('finalCta.docs.label')}</h3>
            <span className={classes.body}>{t('finalCta.docs.body')}</span>
            <a href="/docs" className={classes.button}>
              {t('finalCta.docs.button')} →
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
