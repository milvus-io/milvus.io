import { useTranslation, Trans } from 'react-i18next';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import classes from './index.module.less';
import { GET_START_LINK } from '@/consts/links';
import CustomButton from '@/components/customButton';
import CopyCodeButton from '@/components/copyCodeButton';
import Link from 'next/link';

const PIP_INSTALL_TEXT = 'pip install pymilvus';

export default function HomePageHeaderSection(props: {
  label: string;
  link: string;
}) {
  const { t } = useTranslation('home');
  const { label, link } = props;

  return (
    <section
      className={clsx(
        'pt-[98px] pb-[100px] max-phone:pt-[48px] relative bg-white transition-bg bg-no-repeat bg-cover bg-center flex items-center',
        classes.headerSectionContainer
      )}
    >
      <div className={pageClasses.homeContainer}>
        <div className="flex items-center gap-[8px] justify-center mb-[12px]">
          <p className="px-[8px] py-[2px] box-border border-[1px] rounded-[4px] border-[rgba(0,179,255,0.30)] border-solid bg-[#00B3FF]/[0.15] text-[12px] font-[500] leading-[18px]">
            {t('news')}
          </p>
          <Link
            className="text-black2 text-[12px] leading-[18px] hover:underline"
            href={link}
          >
            {label}
          </Link>
        </div>
        <h1 className="w-full max-w-[950px] opacity-90 text-center text-slate-950 text-[72px]  font-[700] leading-[80px] max-tablet:max-w-[600px] max-tablet:text-[60px] max-tablet:leading-[68px] max-phone:text-[52px] max-phone:leading-[60px] mt-[0px] mb-[12px] mx-auto">
          <Trans
            t={t}
            i18nKey="title"
            components={[
              <br key="splitter"></br>,
              <span key="blue-text" className="text-blue1"></span>,
            ]}
          />
        </h1>
        <p className="w-full max-w-[745px] text-black2 text-[18px] max-tablet:text-[16px] leading-[26px] max-tablet:leading-[22px] mb-[40px] mx-auto text-center">
          {t('subTitle')}
        </p>

        <div className="flex justify-center items-center">
          <CustomButton
            href={GET_START_LINK}
            classes={{
              root: classes.startButton,
            }}
          >
            {t('buttons.start')}
          </CustomButton>
        </div>
      </div>
    </section>
  );
}
