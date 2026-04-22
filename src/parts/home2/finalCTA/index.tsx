import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import { CLOUD_SIGNUP_LINK } from '@/consts/links';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';
import { useCopyFeedback } from '../components/useCopyFeedback';

export default function FinalCTA() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });
  const { copied, copy } = useCopyFeedback();

  const pythonBody = t('finalCta.python.body');

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <h2 className={classes.title}>{t('finalCta.title')}</h2>
        </div>

        <div className={classes.grid}>
          <article className={classes.card}>
            <span className={classes.cardIndex} aria-hidden>PYTHON</span>
            <h3 className={classes.cardTitle}>{t('finalCta.python.label')}</h3>
            <code className={classes.pythonBody}>{pythonBody}</code>
            <button
              type="button"
              onClick={() => copy(pythonBody)}
              className={clsx(classes.button, copied && classes.buttonCopied)}
              aria-label={`Copy ${t('finalCta.python.label')} command`}
            >
              {copied
                ? `[${t('finalCta.python.copied')}]`
                : `${t('finalCta.python.button')} →`}
            </button>
          </article>

          <article className={classes.card}>
            <span className={classes.cardIndex} aria-hidden>CLOUD</span>
            <h3 className={classes.cardTitle}>{t('finalCta.cloud.label')}</h3>
            <p className={classes.cardBody}>{t('finalCta.cloud.body')}</p>
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
            <span className={classes.cardIndex} aria-hidden>DOCS</span>
            <h3 className={classes.cardTitle}>{t('finalCta.docs.label')}</h3>
            <p className={classes.cardBody}>{t('finalCta.docs.body')}</p>
            <a href="/docs" className={classes.button}>
              {t('finalCta.docs.button')} →
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
