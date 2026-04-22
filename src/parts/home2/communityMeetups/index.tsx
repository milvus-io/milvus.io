import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import { DISCORD_INVITE_URL } from '@/consts/links';
import { MEETUP_UNSTRUCTURED_DATA_URL } from '@/consts/externalLinks';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';
import { MILVUS_STARS, MILVUS_DOWNLOADS } from '../consts/stats';

export default function CommunityMeetups() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <h2 className={classes.sectionTitle}>{t('community.sectionTitle')}</h2>
        </div>
        <div className={classes.grid}>
          <article className={classes.card}>
            <h3 className={classes.cardTitle}>{t('community.stats.title')}</h3>
            <div className={classes.statRow}>
              <span className={classes.statValue}>{MILVUS_STARS}</span>
              <span className={classes.statLabel}>
                ⭐ {t('community.stats.stars')}
              </span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statValue}>{MILVUS_DOWNLOADS}</span>
              <span className={classes.statLabel}>
                📥 {t('community.stats.downloads')}
              </span>
            </div>
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${classes.statRow} ${classes.statRowLink}`}
            >
              <span className={classes.statValue} aria-hidden>💬</span>
              <span className={classes.statLabel}>
                {t('community.stats.chat')}
              </span>
            </a>
          </article>

          <article className={classes.card}>
            <img
              src="/images/home/meetup-logo.png"
              alt="Unstructured Data Meetup"
              className={classes.meetupLogo}
              loading="lazy"
            />
            <h3 className={classes.cardTitle}>{t('community.meetups.title')}</h3>
            <p className={classes.meetupDesc}>{t('community.meetups.desc')}</p>
            <a
              href={MEETUP_UNSTRUCTURED_DATA_URL}
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
