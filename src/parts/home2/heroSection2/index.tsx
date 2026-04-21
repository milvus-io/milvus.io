import { useTranslation, Trans } from 'react-i18next';
import { useState } from 'react';
import Link from 'next/link';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import { CLOUD_SIGNUP_LINK } from '@/consts/links';
import { LanguageEnum } from '@/types/localization';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';

type Props = {
  headlines: { label: string; link: string; tag: string }[];
  locale: LanguageEnum;
  stars?: string;
  downloads?: string;
};

export default function HeroSection2(props: Props) {
  const { headlines, locale, stars = '35K+', downloads = '25M+' } = props;
  const { t } = useTranslation('home2', { lng: locale });
  const [copied, setCopied] = useState(false);

  const showSwiper = headlines.length > 1;
  const placeholderCmd = t('hero.ctaPlaceholder');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(placeholderCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unsupported — no-op */
    }
  };

  return (
    <section className={classes.heroSection}>
      {headlines.length > 0 && (
        <div className={classes.statusBar}>
          <div className={pageClasses.homeContainer}>
            <div className={classes.statusBarInner}>
              <span className={classes.statusBadge}>
                <span className={classes.statusDot} aria-hidden />
                MILVUS//LIVE
              </span>
              <span>BUILD 2.6.x</span>
              <div className={classes.statusHeadline}>
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
                        [{item.tag}] {item.label}
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={pageClasses.homeContainer}>
        <div className={classes.grid}>
          <div className={classes.leftColumn}>
            <span className={classes.eyebrow}>Open-source · 2026</span>

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
                onClick={handleCopy}
                className={classes.copyCommand}
                aria-label="Copy install command"
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
                <span className={classes.statValue}>{stars}</span>
                <span className={classes.statLabel}>
                  ★ {t('hero.starsLabel')}
                </span>
              </div>
              <div className={classes.stat}>
                <span className={classes.statValue}>{downloads}</span>
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
                src="/images/home2/hero-attu-search.svg"
                alt={t('hero.attuAlt')}
                className={classes.attuImage}
                width={640}
                height={400}
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
