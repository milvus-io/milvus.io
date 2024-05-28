import classes from './index.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import CustomButton from '@/components/customButton';
import { CLOUD_SIGNUP_LINK } from '@/consts/links';
import { RightWholeArrow } from '@/components/icons';

const tools = [
  {
    name: 'Llama Index',
    logo: '/images/home/llama-index.png',
    href: 'https://www.llamaindex.ai/',
  },
  {
    name: 'Lang Chain',
    logo: '/images/home/lang-chain.png',
    href: 'https://www.langchain.com/',
  },
  {
    name: 'Haystack',
    logo: '/images/home/hay-stack.png',
    href: 'https://haystack.deepset.ai/',
  },
  {
    name: 'Apache Spark',
    logo: '/images/home/spark.png',
    href: 'https://spark.apache.org/',
  },
  {
    name: 'Hugging face',
    logo: '/images/home/hugging-face.png',
    href: 'https://huggingface.co/',
  },
  {
    name: 'Anyscale',
    logo: '/images/home/any-scale.png',
    href: 'https://www.anyscale.com/',
  },
  {
    name: 'Cohere',
    logo: '/images/home/cohere.png',
    href: 'https://cohere.com/',
  },
  {
    name: 'Open AI',
    logo: '/images/home/open-ai.png',
    href: 'https://openai.com/',
  },
];

export default function TryFreeSection() {
  const { t } = useTranslation('home');

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
          endIcon={<RightWholeArrow color="#fff" />}
          classes={{
            icon: classes.linkButtonIcon,
          }}
        >
          {t('buttons.tryCloud')}
        </CustomButton>

        <div className={classes.backgroundContainer}></div>
      </div>

      <div className={classes.toolsContainer}>
        <p className={classes.subTitle}>{t('trySection.subTitle')}</p>
        <ul className={classes.toolsList}>
          {tools.map(tool => (
            <li className={classes.toolItem} key={tool.name}>
              <a href={tool.href} className={classes.toolButton}>
                <img src={tool.logo} alt={tool.name} />
                <RightWholeArrow />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
