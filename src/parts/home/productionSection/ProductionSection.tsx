import { useTranslation } from 'react-i18next';
import pageClasses from '@/styles/responsive.module.less';

const COMPANY_LIST = [
  {
    name: 'NVIDIA',
    logo: '/images/home/nvidia.png',
  },
  {
    name: 'PayPal',
    logo: '/images/home/paypal.png',
  },
  {
    name: 'Intuit',
    logo: '/images/home/intuit.png',
  },
  {
    name: 'Walmart',
    logo: '/images/home/walmart.png',
  },
  {
    name: 'Compass',
    logo: '/images/home/compass.png',
  },
  {
    name: 'Salesforce',
    logo: '/images/home/salesforce.png',
  },
  {
    name: 'Roblox',
    logo: '/images/home/roblox.png',
  },
  {
    name: 'New Relic',
    logo: '/images/home/new-relic.png',
  },
];

export const ProductionSection = () => {
  const { t } = useTranslation('home');
  return (
    <section className={pageClasses.homeContainer}>
      <div className="py-[60px] flex items-center justify-between max-tablet:flex-col gap-[50px]">
        <h2 className="text-[42px] font-[600] max-w-[480px] leading-[54px] max-tablet:text-center max-tablet:text-[38px] max-tablet:leading-[46px]">
          {t('productionSection.title')}
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-[20px] max-w-[660px]">
          {COMPANY_LIST.map((company, index) => (
            <div
              key={index}
              className="w-[150px] h-[84px] bg-white rounded-[12px] border-[1px] border-solid border-black3 box-border"
            >
              <img src={company.logo} width={150} alt={company.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
