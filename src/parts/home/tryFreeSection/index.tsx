import classes from './index.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import CustomLink from '@/components/customLink';
import { CLOUD_SIGNUP_LINK } from '@/consts/links';
import { RightWholeArrow } from '@/components/icons';

const tools = [
  {
    name: 'Llama Index',
    logo: '/images/home/llama-index.png',
    href: '',
  },
  {
    name: 'Lang Chain',
    logo: '/images/home/lang-chain.png',
    href: '',
  },
  {
    name: 'Haystack',
    logo: '/images/home/hay-stack.png',
    href: '',
  },
  {
    name: 'Apache Park',
    logo: '/images/home/spark.png',
    href: '',
  },
  {
    name: 'Hugging face',
    logo: '/images/home/hugging-face.png',
    href: '',
  },
  {
    name: 'Anyscale',
    logo: '/images/home/any-scale.png',
    href: '',
  },
  {
    name: 'Cohere',
    logo: '/images/home/cohere.png',
    href: '',
  },
  {
    name: 'Open AI',
    logo: '/images/home/open-ai.png',
    href: '',
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
          <img src="/images/home/zilliz-logo.png" alt="Zilliz" />
          <h3 className="">{t('trySection.title')}</h3>
        </div>

        <CustomLink href={CLOUD_SIGNUP_LINK} className={classes.linkButton}>
          {t('buttons.tryCloud')}
          <RightWholeArrow color="#fff" />
        </CustomLink>

        <div className={classes.backgroundContainer}></div>
      </div>

      <div className={classes.toolsContainer}>
        <p className={classes.subTitle}>{t('trySection.subTitle')}</p>
        <ul className={classes.toolsList}>
          {tools.map(tool => (
            <li className={classes.toolItem} key={tool.name}>
              <CustomLink href={tool.href} className={classes.toolButton}>
                <img src={tool.logo} alt={tool.name} />
                <RightWholeArrow />
              </CustomLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
