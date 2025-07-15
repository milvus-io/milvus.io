import classes from './index.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import CustomButton from '@/components/customButton';
import { RightWholeArrow } from '@/components/icons';
import {
  CLOUD_SIGNUP_LINK,
  MILVUS_INTEGRATION_LANGCHAIN_LINK,
  MILVUS_INTEGRATION_DSPY_LINK,
  MILVUS_INTEGRATION_HAYSTACK_LINK,
  MILVUS_INTEGRATION_HUGGING_FACE_LINK,
  MILVUS_INTEGRATION_LLAMA_INDEX_LINK,
  MILVUS_INTEGRATION_MEMGPT_LINK,
  MILVUS_INTEGRATION_OPENAI_LINK,
  MILVUS_INTEGRATION_RAGAS_LINK,
} from '@/consts/links';
import { useGlobalLocale } from '@/hooks/use-global-locale';

const tools = [
  {
    name: 'LangChain',
    logo: '/images/home/lang-chain.png',
    href: MILVUS_INTEGRATION_LANGCHAIN_LINK,
  },
  {
    name: 'LlamaIndex',
    logo: '/images/home/llama-index.png',
    href: MILVUS_INTEGRATION_LLAMA_INDEX_LINK,
  },
  {
    name: 'OpenAI',
    logo: '/images/home/open-ai.png',
    href: MILVUS_INTEGRATION_OPENAI_LINK,
  },
  {
    name: 'Hugging Face',
    logo: '/images/home/hugging-face.png',
    href: MILVUS_INTEGRATION_HUGGING_FACE_LINK,
  },
  {
    name: 'DSPy',
    logo: '/images/home/dspy.png',
    href: MILVUS_INTEGRATION_DSPY_LINK,
  },
  {
    name: 'Haystack',
    logo: '/images/home/hay-stack.png',
    href: MILVUS_INTEGRATION_HAYSTACK_LINK,
  },
  {
    name: 'Ragas',
    logo: '/images/home/ragas.png',
    href: MILVUS_INTEGRATION_RAGAS_LINK,
  },
  {
    name: 'MemGPT',
    logo: '/images/home/mem-gpt.png',
    href: MILVUS_INTEGRATION_MEMGPT_LINK,
  },
];

export default function TryFreeSection() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home', { lng: locale });

  return (
    <section
      className={clsx(pageClasses.homeContainer, classes.sectionContainer)}
    >
      <div className={classes.tryCloudContainer}>
        <div className={classes.leftPart}>
          <span className={classes.logoWrapper}>
            <img src="/images/home/zilliz-logo.png" alt="Zilliz" />
          </span>
          <h3 className="">{t('trySection.title')}</h3>
        </div>

        <CustomButton
          href={CLOUD_SIGNUP_LINK}
          className={classes.linkButton}
          endIcon={<RightWholeArrow color="#fff" size={18} />}
          classes={{
            icon: classes.linkButtonIcon,
          }}
        >
          {t('buttons.tryCloud')}
        </CustomButton>

        <div className={classes.backgroundContainer}></div>
      </div>
    </section>
  );
}

export const AIToolsSection = () => {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home', { lng: locale });
  return (
    <section
      className={clsx(pageClasses.homeContainer, classes.sectionContainer)}
    >
      <div className={classes.toolsContainer}>
        <p className={classes.subTitle}>{t('trySection.subTitle')}</p>
        <ul className={classes.toolsList}>
          {tools.map(tool => (
            <li className={classes.toolItem} key={tool.name}>
              <a
                href={tool.href}
                target="_blank"
                className={clsx(classes.toolButton, 'group')}
              >
                <img src={tool.logo} alt={tool.name} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
