import { useTranslation } from 'react-i18next';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import classes from './index.module.less';

export const ProductionSection = () => {
  const { t } = useTranslation('home');

  const brans = [
    {
      name: 'Smart News',
      icon: '/images/home/brands/smart-news.png',
      class: 'col-span-1 row-span-1',
      test: '',
    },
    {
      name: 'New Relic',
      icon: '/images/home/brands/new-relic.png',
      class: 'col-start-2 col-end-4 row-start-1 row-end-3',
      test: '',
    },
    {
      name: 'IKEA',
      icon: '/images/home/brands/ikea.png',
      class: 'col-start-4 col-end-6 row-start-1 row-end-1',
      test: '',
    },
    {
      name: 'Walmart',
      icon: '/images/home/brands/walmart.png',
      class: 'col-start-6 col-end-8 row-start-1 row-end-1',
      test: '',
    },
    {
      name: 'Shopee',
      icon: '/images/home/brands/shopee.png',
      class: 'col-start-8 col-end-9 row-span-1',
      test: '',
    },
    {
      name: 'Tokopedia',
      icon: '/images/home/brands/tokopedia.png',
      class: 'col-start-9 col-end-11 row-start-1 row-end-1',
      test: '',
    },
    {
      name: 'Shutterstock',
      icon: '/images/home/brands/shutter-stock.png',
      class: 'col-start-11 col-end-13 row-start-1 row-end-1',
      test: '',
    },
    {
      name: 'AT&T',
      icon: '/images/home/brands/at&t.png',
      class: 'col-span-1 row-start-2 row-end-3',
      test: '',
    },
    {
      name: 'ZipRecruiter',
      icon: '/images/home/brands/zip-recruiter.png',
      class: 'col-start-10 col-end-12 row-start-2 row-end-3',
      test: '',
    },
    {
      name: 'IBM',
      icon: '/images/home/brands/ibm.png',
      class: 'col-start-12 col-end-13 row-start-2 row-end-3',
      test: '',
    },
    {
      name: 'Bosch',
      icon: '/images/home/brands/bosch.png',
      class: 'col-start-1 col-end-3 row-start-3 row-end-4',
      test: '',
    },
    {
      name: 'ebay',
      icon: '/images/home/brands/ebay.png',
      class: 'col-start-3 col-end-4 row-start-3 row-end-4',
      test: '',
    },
    {
      name: 'Paypal',
      icon: '/images/home/brands/paypal.png',
      class: 'col-start-10 col-end-11 row-start-3 row-end-4',
      test: '',
    },
    {
      name: 'Intuit',
      icon: '/images/home/brands/intuit.png',
      class: 'col-start-11 col-end-13 row-start-3 row-end-4',
      test: '',
    },
    {
      name: 'Inflection',
      icon: '/images/home/brands/inflection.png',
      class: 'col-start-1 col-end-3 row-start-4 row-end-6',
      test: '',
    },
    {
      name: 'Salesforce',
      icon: '/images/home/brands/sales-force.png',
      class: 'col-start-3 col-end-4 row-start-4 row-end-5',
      test: '',
    },
    {
      name: 'NVIDIA',
      icon: '/images/home/brands/nvidia.png',
      class: 'col-start-10 col-end-12 row-start-4 row-end-6',
      test: '',
    },
    {
      name: 'OMERS',
      icon: '/images/home/brands/omers.png',
      class: 'col-start-12 col-end-13 row-start-4 row-end-5',
      test: '',
    },
    {
      name: 'LINE',
      icon: '/images/home/brands/line.png',
      class: 'col-start-3 col-end-4 row-start-5 row-end-6',
      test: '',
    },
    {
      name: 'ROBLOX',
      icon: '/images/home/brands/roblox.png',
      class: 'col-start-4 col-end-6 row-start-5 row-end-6',
      test: '',
    },
    {
      name: 'TREND',
      icon: '/images/home/brands/trend.png',
      class: 'col-start-6 col-end-8 row-start-5 row-end-6',
      test: '',
    },
    {
      name: 'COMPASS',
      icon: '/images/home/brands/compass.png',
      class: 'col-start-8 col-end-10 row-start-5 row-end-6',
      test: '',
    },
    {
      name: 'MOJ',
      icon: '/images/home/brands/moj.png',
      class: 'col-start-12 col-end-13 row-start-5 row-end-6',
      test: '',
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
        {brans.map(item => {
          return (
            <li
              key={item.name}
              className={clsx('bg-white rounded-[8px]', item.class)}
            >
              <img src={item.icon} alt={item.name} className="w-full h-full" />
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
