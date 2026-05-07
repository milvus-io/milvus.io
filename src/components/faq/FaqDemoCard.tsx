import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import faqClasses from '@/styles/faq.module.css';
import CustomButton from '@/components/customButton';
import { DemoTypeEnum } from '@/types/faq';
import {
  DEMO_HYBRID_SEARCH_URL,
  DEMO_MULTIMODAL_SEARCH_URL,
} from '@/consts/externalLinks';

const RightWholeArrow = ({
  color,
  size = 14,
}: {
  color?: string;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 7L12.7244 7M12.7244 7L7.57669 12.1477M12.7244 7L7.5767 1.85228"
      stroke={color || '#00131A'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

export default function FaqDemoCard({
  demo,
  demoDescription,
}: {
  demo?: DemoTypeEnum;
  demoDescription?: string;
}) {
  const { t } = useTranslation('demo');

  const demoCardData = useMemo(() => {
    const demos = [
      {
        name: t('demos.askAi.title'),
        desc: t('demos.askAi.desc'),
        cover: '/images/demos/ask-ai.png',
        renderButton1: () => (
          <CustomButton
            className=""
            variant="outlined"
            onClick={() =>
              document.getElementById('inkeep-chat-button')?.click()
            }
          >
            {t('demos.askAi.ctaLabel1')}
          </CustomButton>
        ),
        renderButton2: () => (
          <CustomButton
            href="https://zilliz.com/blog/how-inkeep-and-milvus-built-rag-driven-ai-assisstant-for-smarter-interaction"
            variant="text"
            endIcon={<RightWholeArrow />}
          >
            {t('demos.askAi.ctaLabel2')}
          </CustomButton>
        ),
        lowerCaseName: 'ask-ai',
        id: DemoTypeEnum.Rag,
      },
      {
        name: t('demos.multimodal.title'),
        desc: t('demos.multimodal.desc'),
        href: DEMO_MULTIMODAL_SEARCH_URL,
        cover: '/images/demos/multimodal-image-search.png',
        lowerCaseName: 'multimodal image search',
        id: DemoTypeEnum.imageSearch,
      },
      {
        name: t('demos.hybridSearch.title'),
        desc: t('demos.hybridSearch.desc'),
        href: DEMO_HYBRID_SEARCH_URL,
        cover: '/images/demos/hybrid-search.png',
        lowerCaseName: 'hybrid search',
        id: DemoTypeEnum.HybridSearch,
      },
    ];

    return demos.find(item => item.id === demo);
  }, [demo, t]);

  if (!demo || !demoCardData) {
    return null;
  }

  return (
    <div>
      <p className="mb-[24px] text-black2">{demoDescription}</p>
      <div className={faqClasses.demoCardRoot}>
        <div>
          <h3 className={faqClasses.demoCardName}>{demoCardData.name}</h3>
          <p className={faqClasses.demoCardDesc}>{demoCardData.desc}</p>
          <div className="flex flex-wrap gap-[12px] mt-[24px]">
            {demoCardData.href ? (
              <CustomButton
                className={faqClasses.demoCardButton}
                variant="outlined"
                href={demoCardData.href}
              >
                {t('tryDemo')}
              </CustomButton>
            ) : null}
            {demoCardData.renderButton1?.()}
            {demoCardData.renderButton2?.()}
          </div>
        </div>
      </div>
    </div>
  );
}
