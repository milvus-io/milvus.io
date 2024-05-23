import CustomLink from '@/components/customLink';
import classes from './index.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { RightWholeArrow } from '@/components/icons';

export default function DevelopSection() {
  const { t } = useTranslation('home');

  const techStacks = [
    {
      id: 'lang chain',
      title: t('developSection.langChain.title'),
      content: t('developSection.langChain.desc'),
      href: '',
      logo: '/images/home/lang-chain-logo.png',
    },
    {
      id: 'llama index',
      title: t('developSection.langChain.title'),
      content: t('developSection.langChain.desc'),
      href: '',
      logo: '/images/home/llama-index-logo.png',
    },
    {
      id: 'DSPy',
      title: t('developSection.dspy.title'),
      content: t('developSection.dspy.desc'),
      href: '',
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
              <p className={classes.stackDesc}>{v.content}</p>
            </div>

            <CustomLink
              href={v.href}
              variant="text"
              endIcon={<RightWholeArrow />}
              classes={{
                root: classes.linkButton,
              }}
            >
              {t('buttons.learnMore')}
            </CustomLink>
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

          <div className={classes.linkButtonWrapper}>
            <CustomLink
              href=""
              endIcon={<RightWholeArrow color="#fff" />}
              variant="contained"
              classes={{
                root: classes.linkButton,
              }}
            >
              {t('buttons.rsvp')}
            </CustomLink>
          </div>
        </div>
      </div>
    </section>
  );
}
