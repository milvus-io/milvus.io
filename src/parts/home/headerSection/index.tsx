import { useTranslation, Trans } from 'react-i18next';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import classes from './index.module.less';
import {
  CLOUD_SIGNUP_LINK,
  GET_START_LINK,
  LEARN_MORE_LINK,
} from '@/consts/links';
import CustomButton from '@/components/customButton';
import Link from 'next/link';
import { LanguageEnum } from '@/types/localization';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRef, useMemo } from 'react';

const RightArrowIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.0459 16L13 15.0531L7.91831 10L13 4.94687L12.0459 4L6 10L12.0459 16Z"
      fill="#667176"
    />
  </svg>
);

export default function HomePageHeaderSection(props: {
  headlines: { label: string; link: string; tag: string }[];
  locale: LanguageEnum;
}) {
  const { headlines, locale } = props;
  const { t } = useTranslation('home', { lng: locale });
  const { t: milvusTrans } = useTranslation('common', { lng: locale });
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);

  const showSwiper = useMemo(() => {
    return headlines.length > 1;
  }, [headlines]);

  return (
    <section
      className={clsx(
        'pt-[98px] pb-[100px] max-phone:pt-[48px] relative bg-white transition-bg bg-no-repeat bg-cover bg-center flex items-center',
        classes.headerSectionContainer
      )}
    >
      <div className={pageClasses.homeContainer}>
        <div className={classes.headlinesContainer}>
          <Swiper
            // install Swiper modules
            modules={showSwiper ? [Navigation, Autoplay, Pagination] : []}
            navigation={{
              prevEl: prevButtonRef.current,
              nextEl: nextButtonRef.current,
            }}
            pagination={{
              clickable: true,
              horizontalClass: clsx(classes.customPagination, {
                [classes.hiddenPagination]: !showSwiper,
              }),
              bulletActiveClass: classes.customBulletActive,
              bulletClass: classes.customBullet,
            }}
            autoplay={
              showSwiper
                ? {
                    delay: 8000,
                    disableOnInteraction: false,
                  }
                : false
            }
            spaceBetween={50}
            slidesPerView={1}
            loop={true}
            className={classes.headlinesSwiperContainer}
          >
            {headlines.map(item => (
              <SwiperSlide key={item.label}>
                <div className={classes.headlineItem}>
                  <p className={classes.headlineTag}>{item.tag}</p>
                  <Link
                    href={item.link}
                    className={clsx(classes.headlineLink, {
                      [classes.noPadding]: !showSwiper,
                    })}
                  >
                    {item.label}
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {showSwiper && (
            <div className={classes.navigatorContainer}>
              <button
                ref={prevButtonRef}
                className={clsx(classes.navigatorButton, classes.prevButton)}
              >
                <RightArrowIcon />
              </button>
              <button
                ref={nextButtonRef}
                className={clsx(classes.navigatorButton, classes.nextButton)}
              >
                <RightArrowIcon />
              </button>
            </div>
          )}
        </div>
        <h1
          className={clsx(
            'w-full opacity-90 text-center text-slate-950 text-[72px] font-[700] leading-[80px] max-tablet:max-w-[600px] max-tablet:text-[56px] max-tablet:leading-[68px] max-phone:text-[42px] max-phone:leading-[60px] mt-[0px] mb-[12px] mx-auto',
            {
              'break-all': locale !== LanguageEnum.ENGLISH,
            }
          )}
        >
          <Trans
            t={t}
            i18nKey="title"
            components={[
              <br key="splitter"></br>,
              <span key="blue-text" className="text-blue1"></span>,
            ]}
          />
        </h1>
        <p className="w-full max-w-[900px] text-black2 text-[18px] max-tablet:text-[16px] leading-[26px] max-tablet:leading-[22px] mb-[40px] mx-auto text-center font-mono">
          {t('subTitle')}
        </p>

        <div className="flex justify-center items-center gap-[20px] max-sm:flex-col">
          <CustomButton
            href={GET_START_LINK(locale)}
            size="large"
            classes={{
              root: classes.startButton,
            }}
          >
            {t('buttons.quickStart')}
          </CustomButton>
          <CustomButton
            href={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=homepage_center&utm_content=homepage`}
            size="large"
            variant="outlined"
            classes={{
              root: classes.startButton,
            }}
          >
            {milvusTrans('v3trans.home.banner.tryManaged')}
          </CustomButton>
        </div>
      </div>
    </section>
  );
}
