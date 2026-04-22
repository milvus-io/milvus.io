import { useTranslation, Trans } from 'react-i18next';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import { CLOUD_SIGNUP_LINK, GET_START_LINK } from '@/consts/links';
import { LanguageEnum } from '@/types/localization';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';
import { MILVUS_STARS, MILVUS_DOWNLOADS } from '../consts/stats';
import { useCopyFeedback } from '../components/useCopyFeedback';

const ATTU_SLIDES = [
  {
    src: '/images/home2/hero-attu-search.png',
    label: 'vector_search',
    meta: 'COLLECTION: agent_memory',
  },
  {
    src: '/images/home2/hero-attu-overview.png',
    label: 'overview',
    meta: 'CLUSTER: production',
  },
  {
    src: '/images/home2/hero-attu-data.png',
    label: 'data',
    meta: 'SCHEMA: agent_memory',
  },
];
const ATTU_CYCLE_MS = 5000;

type Props = {
  headlines: { label: string; link: string; tag: string }[];
  locale: LanguageEnum;
};

export default function HeroSection2(props: Props) {
  const { headlines, locale } = props;
  const { t } = useTranslation('home2', { lng: locale });
  const { copied, copy } = useCopyFeedback();
  const [activeSlide, setActiveSlide] = useState(0);

  const showSwiper = headlines.length > 1;
  const placeholderCmd = t('hero.ctaPlaceholder');

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduced) return;
    const id = setInterval(() => {
      setActiveSlide(i => (i + 1) % ATTU_SLIDES.length);
    }, ATTU_CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const active = ATTU_SLIDES[activeSlide];

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
              <div className={classes.ctaPair}>
                <a
                  href={GET_START_LINK(locale)}
                  className={classes.quickStartCta}
                >
                  {t('hero.ctaQuickStart')}
                </a>
                <a
                  href={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_homepage_hero&utm_content=home2`}
                  className={classes.secondaryCta}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('hero.ctaSecondary')} →
                </a>
              </div>
              <button
                type="button"
                onClick={() => copy(placeholderCmd)}
                className={classes.copyCommand}
                aria-label={t('hero.copyAriaLabel')}
              >
                <span className={classes.copyCommandLabel}>
                  {t('hero.installLabel')}
                </span>
                <span className={classes.copyCommandPlaceholder}>
                  {placeholderCmd}
                </span>
                <span className={classes.copyCommandHint}>
                  {copied ? '[copied]' : '[copy]'}
                </span>
              </button>
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
                  attu ▸ {active.label}
                </span>
                <span className={classes.attuFrameMeta}>{active.meta}</span>
              </figcaption>
              <div
                className={classes.attuImageStack}
                role="group"
                aria-roledescription="slideshow"
                aria-label={t('hero.attuAlt')}
              >
                {ATTU_SLIDES.map((slide, i) => (
                  <img
                    key={slide.src}
                    src={slide.src}
                    alt={t('hero.attuAlt')}
                    className={clsx(
                      classes.attuImage,
                      i === activeSlide && classes.attuImageActive
                    )}
                    width={3024}
                    height={1532}
                    fetchPriority={i === 0 ? 'high' : undefined}
                    aria-hidden={i !== activeSlide}
                  />
                ))}
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
