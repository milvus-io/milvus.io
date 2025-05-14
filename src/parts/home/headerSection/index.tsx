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

export default function HomePageHeaderSection(props: {
  label: string;
  link: string;
  locale: LanguageEnum;
}) {
  const { label, link, locale } = props;
  const { t } = useTranslation('home', { lng: locale });
  const { t: milvusTrans } = useTranslation('common', { lng: locale });

  return (
    <section
      className={clsx(
        'pt-[98px] pb-[100px] max-phone:pt-[48px] relative bg-white transition-bg bg-no-repeat bg-cover bg-center flex items-center',
        classes.headerSectionContainer
      )}
    >
      <div className={pageClasses.homeContainer}>
        <div className="flex items-center gap-[8px] justify-center mb-[12px]">
          <p className="px-[8px] py-[2px] box-border border-[1px] rounded-[8px] border-[rgba(0,179,255,0.30)] border-solid bg-[#00B3FF]/[0.15] text-[12px] font-mono font-[500] leading-[18px]">
            {t('news')}
          </p>
          <Link
            className="text-black2 text-[12px] leading-[18px] hover:underline font-mono"
            href={link}
          >
            {label}
          </Link>
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
