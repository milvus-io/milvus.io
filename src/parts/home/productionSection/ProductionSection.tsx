import { useTranslation } from 'react-i18next';
import pageClasses from '@/styles/responsive.module.less';
import Marquee from '@/components/ui/marquee';

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
        <div className="w-full overflow-x-hidden">
          <div className="relative max-w-[660px]">
            <Marquee pauseOnHover className="[--duration:20s]">
              {COMPANY_LIST.map((company, index) => (
                <div
                  key={index}
                  className="w-[150px] h-[84px] bg-white rounded-[12px] border-[1px] border-solid border-black3 box-border"
                >
                  <img src={company.logo} width={150} alt={company.name} />
                </div>
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]">
              {COMPANY_LIST.reverse().map((company, index) => (
                <div
                  key={index}
                  className="w-[150px] h-[84px] bg-white rounded-[12px] border-[1px] border-solid border-black3 box-border"
                >
                  <img src={company.logo} width={150} alt={company.name} />
                </div>
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#FAFAFA]"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#FAFAFA]"></div>
          </div>
        </div>

        {/* <div className="flex flex-wrap justify-center items-center gap-[20px] max-w-[660px]">
          {COMPANY_LIST.map((company, index) => (
            <div
              key={index}
              className="w-[150px] h-[84px] bg-white rounded-[12px] border-[1px] border-solid border-black3 box-border"
            >
              <img src={company.logo} width={150} alt={company.name} />
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
};
