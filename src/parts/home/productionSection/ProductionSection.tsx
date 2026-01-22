import { useTranslation } from 'react-i18next';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import classes from './index.module.less';
import { useGlobalLocale } from '@/hooks/use-global-locale';

export const ProductionSection = () => {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home', { lng: locale });

  const brands = [
    {
      name: 'Salesforce',
      icon: '/images/home/brands/salesforce.svg',
      class: 'col-span-1 row-span-1',
    },
    {
      name: 'Exa.ai',
      icon: '/images/home/brands/exa-ai.svg',
      class: 'col-start-2 col-end-4 row-start-1 row-end-3',
    },
    {
      name: 'Walmart',
      icon: '/images/home/brands/walmart.svg',
      class: 'col-start-4 col-end-6 row-start-1 row-end-1',
    },
    {
      name: 'Doordash',
      icon: '/images/home/brands/doordash.svg',
      class: 'col-start-6 col-end-8 row-start-1 row-end-1',
    },
    {
      name: 'Reddit',
      icon: '/images/home/brands/reddit.svg',
      class: 'col-start-8 col-end-9 row-span-1',
    },
    {
      name: 'Accenture',
      icon: '/images/home/brands/accenture.svg',
      class: 'col-start-9 col-end-11 row-start-1 row-end-1',
    },
    {
      name: 'Open Evidence',
      icon: '/images/home/brands/open-evidence.svg',
      class: 'col-start-11 col-end-13 row-start-1 row-end-1',
    },
    {
      name: 'Shell',
      icon: '/images/home/brands/shell.svg',
      class: 'col-span-1 row-start-2 row-end-3',
    },
    {
      name: 'Doximity',
      icon: '/images/home/brands/doximity.svg',
      class: 'col-start-10 col-end-12 row-start-2 row-end-3',
    },
    {
      name: 'Fiverr',
      icon: '/images/home/brands/fiverr.svg',
      class: 'col-start-12 col-end-13 row-start-2 row-end-3',
    },
    {
      name: 'Read.ai',
      icon: '/images/home/brands/read-ai.svg',
      class: 'col-start-1 col-end-3 row-start-3 row-end-4',
    },
    {
      name: 'ebay',
      icon: '/images/home/brands/ebay.svg',
      class: 'col-start-3 col-end-4 row-start-3 row-end-4',
    },
    {
      name: 'Notta.ai',
      icon: '/images/home/brands/notta-ai.svg',
      class: 'col-start-10 col-end-11 row-start-3 row-end-4',
    },
    {
      name: 'Bosch',
      icon: '/images/home/brands/bosch.svg',
      class: 'col-start-11 col-end-13 row-start-3 row-end-4',
    },
    {
      name: 'NVIDIA',
      icon: '/images/home/brands/nvidia.svg',
      class: 'col-start-1 col-end-3 row-start-4 row-end-6',
    },
    {
      name: 'Cisco',
      icon: '/images/home/brands/cisco.svg',
      class: 'col-start-3 col-end-4 row-start-4 row-end-5',
    },
    {
      name: 'Filevine',
      icon: '/images/home/brands/filevine.svg',
      class: 'col-start-10 col-end-12 row-start-4 row-end-6',
    },
    {
      name: 'Fanatics',
      icon: '/images/home/brands/fanatics.svg',
      class: 'col-start-12 col-end-13 row-start-4 row-end-5',
    },
    {
      name: 'LINE',
      icon: '/images/home/brands/line.svg',
      class: 'col-start-3 col-end-4 row-start-5 row-end-6',
    },
    {
      name: 'ROBLOX',
      icon: '/images/home/brands/roblox.svg',
      class: 'col-start-4 col-end-6 row-start-5 row-end-6',
    },
    {
      name: 'Airtable',
      icon: '/images/home/brands/airtable.svg',
      class: 'col-start-6 col-end-8 row-start-5 row-end-6',
    },
    {
      name: 'Pluad',
      icon: '/images/home/brands/plaud-ai.svg',
      class: 'col-start-8 col-end-10 row-start-5 row-end-6',
    },
    {
      name: 'IBM',
      icon: '/images/home/brands/ibm.svg',
      class: 'col-start-12 col-end-13 row-start-5 row-end-6',
    },
  ];
  return (
    <section className={clsx(pageClasses.homeContainer, '!my-[80px]')}>
      <ul
        className={clsx(
          'grid grid-cols-12 grid-rows-5 gap-[32px] max-[1022px]:gap-[20px] list-none max-phone:hidden',
          classes.logosWrapper
        )}
      >
        {brands.map(item => {
          return (
            <li
              key={item.name}
              className={clsx(item.class)}
            >
              <span className="inline-block bg-white leading-[0px] rounded-[8px]">
                <img src={item.icon} alt={item.name} className="w-full h-full" />
              </span>
            </li>
          );
        })}
        <li className="col-start-4 col-end-10 row-start-2 row-end-5 flex justify-center items-center">
          <h2 className="text-[32px] font-[600] leading-[44px] text-center max-w-[460px]">
            {t('productionSection.title')}
          </h2>
        </li>
      </ul>

      <div className="hidden max-phone:block">
        <h2 className="text-[32px] font-[600] leading-[44px] text-center mb-[24px]">
          {t('productionSection.title')}
        </h2>
        <div className={classes.usersBgWrapper}></div>
      </div>
    </section>
  );
};
