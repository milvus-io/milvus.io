import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';

const MEETUPS_URL = 'https://zilliz.com/community/unstructured-data-meetup';

export default function CommunityMeetups() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <h2 className={classes.sectionTitle}>{t('community.sectionTitle')}</h2>
        <div className={classes.grid}>
          <article className={classes.card}>
            <h3 className={classes.cardTitle}>{t('community.stats.title')}</h3>
            <div className={classes.statRow}>
              <span className={classes.statValue}>35K+</span>
              <span className={classes.statLabel}>
                ⭐ {t('community.stats.stars')}
              </span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statValue}>
                {t('community.contributorsPlaceholder')}
              </span>
              <span className={classes.statLabel}>
                👥 {t('community.stats.contributors')}
              </span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statValue}>25M+</span>
              <span className={classes.statLabel}>
                📥 {t('community.stats.downloads')}
              </span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statValue} aria-hidden>💬</span>
              <span className={classes.statLabel}>{t('community.stats.chat')}</span>
            </div>
          </article>

          <article className={classes.card}>
            <h3 className={classes.cardTitle}>{t('community.meetups.title')}</h3>
            <p className={classes.meetupDesc}>{t('community.meetups.desc')}</p>
            <a
              href={MEETUPS_URL}
              className={classes.meetupCta}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('community.meetups.cta')}
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
