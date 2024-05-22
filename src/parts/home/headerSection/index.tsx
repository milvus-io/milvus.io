import { useTranslation, Trans } from 'react-i18next';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { CopyIcon, GitHubIcon } from '@/components/icons';
import classes from './index.module.less';
import { GITHUB_MILVUS_LINK, MILVUS_PY_MILVUS } from '@/consts/links';

const DownloadIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 10.5H12V11.5H3V10.5ZM8 5.5H11.5L7.5 9.5L3.5 5.5H7V1.5H8V5.5Z"
      fill="#00131A"
    />
  </svg>
);

type HomePageHeaderSectionProps = {
  download: number;
  star: number;
};

export default function HomePageHeaderSection(
  props: HomePageHeaderSectionProps
) {
  const { t } = useTranslation('home');
  const { download = 0, star = 0 } = props;

  const startNum = `${Math.floor(star / 1000)}K`;
  const downloadNum = new Intl.NumberFormat('en-US').format(download);

  return (
    <section
      className={clsx(
        'pt-[98px] pb-[68px] max-phone:pt-[48px] relative bg-white transition-bg bg-no-repeat bg-cover bg-center'
      )}
      style={{
        backgroundImage: 'url(/images/home/header-background-image.png)',
        backgroundColor: '#FAFAFA',
      }}
    >
      <div className={pageClasses.homeContainer}>
        <div className="mb-[12px] flex gap-1 justify-center">
          <a
            href={MILVUS_PY_MILVUS}
            className={clsx(
              classes.downloadButton,
              'flex gap-[4px] basis-[75px] items-center flex-shrink-0 flex-grow-0 px-[8px] py-[3px]  rounded'
            )}
          >
            <DownloadIcon />
            <span className="text-[12px] font-[500] leading-[18px] text-black">
              {downloadNum}
            </span>
          </a>
          <a
            href={GITHUB_MILVUS_LINK}
            className="flex items-center basis-[77px] flex-shrink-0 flex-grow-0 px-[6px] py-[3px] rounded border border-solid border-gray-300"
          >
            <GitHubIcon />
            <span className="text-[12px] leading-[18px] ml-[2px] mr-[4px] text-black">
              {t('buttons.star')}
            </span>
            <span className="text-[12px] font-[500] leading-[18px] text-black">
              {startNum}
            </span>
          </a>
        </div>

        <h1 className="w-full max-w-[700px] opacity-90 text-center text-slate-950 text-[72px] max-tablet:text-[60px] font-[700] leading-[80px] max-tablet:leading-[68px] mt-[0px] mb-[24px] mx-auto">
          <Trans
            t={t}
            i18nKey="title"
            components={[
              <br key="splitter"></br>,
              <span key="blue-text" className="text-sky-500"></span>,
            ]}
          />
        </h1>
        <p className="w-full max-w-[756px] text-black2 text-[18px] max-tablet:text-[16px] leading-[26px] max-tablet:leading-[22px] mb-[60px] mx-auto text-center">
          {t('subTitle')}
        </p>

        <div className="flex flex-col gap-[12px] items-center">
          <div className="w-[280px] flex justify-center items-center border-[1px] border-solid border-gray-300 rounded-[10px] px-[20px] py-[16px]">
            <p className="">{t('buttons.pipInstall')}</p>
            <CopyIcon />
          </div>
          <button className="w-[280px] border-[1px] border-solid border-black rounded-[10px] px-[20px] py-[16px] bg-slate-950 text-white">
            {t('buttons.start')}
          </button>
        </div>
      </div>
    </section>
  );
}
