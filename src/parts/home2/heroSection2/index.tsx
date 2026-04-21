import { useTranslation, Trans } from 'react-i18next';
import { useState } from 'react';
import Link from 'next/link';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import CustomButton from '@/components/customButton';
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
      <div className={pageClasses.homeContainer}>
        <div className={classes.grid}>
          <div className={classes.leftColumn}>
            {headlines.length > 0 && (
              <div className={classes.swiperWrap}>
                <Swiper
                  modules={showSwiper ? [Autoplay] : []}
                  autoplay={showSwiper ? { delay: 8000, disableOnInteraction: false } : false}
                  loop={showSwiper}
                  slidesPerView={1}
                >
                  {headlines.map(item => (
                    <SwiperSlide key={item.label}>
                      <Link href={item.link}>
                        {item.tag} · {item.label}
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

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
                <span className={classes.copyCommandPlaceholder}>
                  {copied ? 'Copied' : placeholderCmd}
                </span>
              </button>
              <CustomButton
                href={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_homepage_hero&utm_content=home2`}
                size="large"
                variant="outlined"
              >
                {t('hero.ctaSecondary')} →
              </CustomButton>
            </div>

            <div className={classes.socialProof}>
              <span>⭐ {stars} {t('hero.starsLabel')}</span>
              <span>📥 {downloads} {t('hero.downloadsLabel')}</span>
            </div>
          </div>

          <div className={classes.rightColumn}>
            <img
              src="/images/home2/hero-attu-search.svg"
              alt={t('hero.attuAlt')}
              className={classes.attuImage}
              width={640}
              height={400}
              fetchPriority="high"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
