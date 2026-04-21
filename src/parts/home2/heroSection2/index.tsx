import { useTranslation, Trans } from 'react-i18next';
import Link from 'next/link';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import { CLOUD_SIGNUP_LINK } from '@/consts/links';
import { LanguageEnum } from '@/types/localization';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';
import { MILVUS_STARS, MILVUS_DOWNLOADS } from '../consts/stats';
import { useCopyFeedback } from '../components/useCopyFeedback';

type Props = {
  headlines: { label: string; link: string; tag: string }[];
  locale: LanguageEnum;
};

export default function HeroSection2(props: Props) {
  const { headlines, locale } = props;
  const { t } = useTranslation('home2', { lng: locale });
  const { copied, copy } = useCopyFeedback();

  const showSwiper = headlines.length > 1;
  const placeholderCmd = t('hero.ctaPlaceholder');

  return (
    <section className={classes.heroSection}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.eyebrowRow}>
          <span className={classes.statusBadge}>
            <span className={classes.statusDot} aria-hidden />
            MILVUS//LIVE
          </span>
          <span className={classes.eyebrowDivider} aria-hidden>
            /
          </span>
          <span className={classes.buildTag}>v2.6.x</span>
          {headlines.length > 0 && (
            <>
              <span className={classes.eyebrowDivider} aria-hidden>
                /
              </span>
              <div className={classes.eyebrowHeadline}>
                <Swiper
                  modules={showSwiper ? [Autoplay] : []}
                  autoplay={
                    showSwiper
                      ? { delay: 8000, disableOnInteraction: false }
                      : false
                  }
                  loop={showSwiper}
                  slidesPerView={1}
                >
                  {headlines.map(item => (
                    <SwiperSlide key={item.label}>
                      <Link href={item.link}>
                        {item.tag ? `[${item.tag}] ` : ''}
                        {item.label}
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </>
          )}
        </div>

        <div className={classes.grid}>
          <div className={classes.leftColumn}>
            <h1 className={classes.title}>
              <Trans
                t={t}
                i18nKey="hero.title"
                components={[
                  <span key="accent" className={classes.titleAccent} />,
                  <br key="br" />,
                ]}
              />
            </h1>

            <p className={classes.subtitle}>{t('hero.subtitle')}</p>

            <div className={classes.ctaRow}>
              <button
                type="button"
                onClick={() => copy(placeholderCmd)}
                className={classes.copyCommand}
                aria-label={t('hero.copyAriaLabel')}
              >
                <span className={classes.copyCommandPrompt} aria-hidden>
                  $
                </span>
                <span className={classes.copyCommandPlaceholder}>
                  {placeholderCmd}
                </span>
                <span className={classes.copyCommandHint}>
                  {copied ? '[copied]' : '[copy]'}
                </span>
              </button>
              <a
                href={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_homepage_hero&utm_content=home2`}
                className={classes.secondaryCta}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('hero.ctaSecondary')} →
              </a>
            </div>

            <div className={classes.socialProof}>
              <div className={classes.stat}>
                <span className={classes.statValue}>{MILVUS_STARS}</span>
                <span className={classes.statLabel}>
                  ★ {t('hero.starsLabel')}
                </span>
              </div>
              <div className={classes.stat}>
                <span className={classes.statValue}>{MILVUS_DOWNLOADS}</span>
                <span className={classes.statLabel}>
                  ↓ {t('hero.downloadsLabel')}
                </span>
              </div>
            </div>
          </div>

          <div className={classes.rightColumn}>
            <figure className={classes.attuFrame}>
              <span
                className={`${classes.cornerTick} ${classes.cornerTopLeft}`}
                aria-hidden
              />
              <span
                className={`${classes.cornerTick} ${classes.cornerTopRight}`}
                aria-hidden
              />
              <span
                className={`${classes.cornerTick} ${classes.cornerBottomLeft}`}
                aria-hidden
              />
              <span
                className={`${classes.cornerTick} ${classes.cornerBottomRight}`}
                aria-hidden
              />
              <figcaption className={classes.attuFrameHeader}>
                <span className={classes.attuFrameTitle}>
                  attu ▸ vector_search
                </span>
                <span className={classes.attuFrameMeta}>
                  COLLECTION: agent_memory
                </span>
              </figcaption>
              <img
                src="/images/home2/hero-attu-search.png"
                alt={t('hero.attuAlt')}
                className={classes.attuImage}
                width={3024}
                height={1532}
                fetchPriority="high"
                loading="eager"
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
