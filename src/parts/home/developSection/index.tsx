import CustomButton from '@/components/customButton';
import classes from './index.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { RightWholeArrow } from '@/components/icons';
import { MEETUP_UNSTRUCTURED_DATA_URL } from '@/consts/externalLinks';

export default function DevelopSection() {
  const { t } = useTranslation('home');

  const techStacks = [
    {
      id: 'lang chain',
      title: t('developSection.langChain.title'),
      content: t('developSection.langChain.desc'),
      href: '/docs/integrate_with_langchain.md',
      logo: '/images/home/lang-chain-logo.png',
    },
    {
      id: 'llama index',
      title: t('developSection.llamaIndex.title'),
      content: t('developSection.llamaIndex.desc'),
      href: '/docs/integrate_with_llamaindex.md',
      logo: '/images/home/llama-index-logo.png',
    },
    {
      id: 'DSPy',
      title: t('developSection.dspy.title'),
      content: t('developSection.dspy.desc'),
      href: '/docs/integrate_with_dspy.md',
      logo: '/images/home/DSPy-logo.png',
    },
  ];

  return (
    <section
      className={clsx(pageClasses.homeContainer, classes.sectionContainer)}
    >
      <div className={classes.titleWrapper}>
        <h2>{t('home:developSection.title')}</h2>
        <p>{t('home:developSection.subTitle')}</p>
      </div>

      <ul className={classes.stacksList}>
        {techStacks.map(v => (
          <li className={classes.stackItem} key={v.id}>
            <div>
              <span className={classes.logoWrapper}>
                <img src={v.logo} alt={v.id} />
              </span>
              <h3 className={classes.stackTitle}>{v.title}</h3>
            </div>

            <CustomButton
              href={v.href}
              variant="text"
              endIcon={<RightWholeArrow />}
              classes={{
                root: classes.linkButton,
              }}
            >
              {t('buttons.learnMore')}
            </CustomButton>
          </li>
        ))}
      </ul>

      <div className={classes.meetupBgContainer}>
        <div className={classes.meetupWrapper}>
          <div className={classes.contentWrapper}>
            <img
              src="/images/home/meetup-logo.png"
              alt="Unstructured Data Meetups"
            />
            <div>
              <h3>{t('developSection.meetup.title')}</h3>
              <p>{t('developSection.meetup.desc')}</p>
            </div>
          </div>

          <CustomButton
            href={MEETUP_UNSTRUCTURED_DATA_URL}
            endIcon={<RightWholeArrow color="#fff" />}
            variant="contained"
            classes={{
              root: classes.rsvpButton,
              icon: classes.linkButtonIcon,
            }}
          >
            {t('buttons.rsvp')}
          </CustomButton>
        </div>
      </div>
    </section>
  );
}
