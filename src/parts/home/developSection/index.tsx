import CustomButton from '@/components/customButton';
import classes from './index.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { RightWholeArrow, RightArrow } from '@/components/icons';
import {
  DEMO_MULTIMODAL_SEARCH_URL,
  MEETUP_UNSTRUCTURED_DATA_URL,
  DEMO_HYBRID_SEARCH_URL,
} from '@/consts/externalLinks';
import { useState } from 'react';
import { useGlobalLocale } from '@/hooks/use-global-locale';

export default function DevelopSection(props: { showMeetup?: boolean }) {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home', { lng: locale });
  const { showMeetup = true } = props;

  const [moveRightSteps, setMoveRightSteps] = useState(0);

  const techStacks = [
    {
      id: 'rag',
      title: t('developSection.rag'),
      href: '/docs/build-rag-with-milvus.md',
      logo: '/images/home/rag.png',
    },
    {
      id: 'imgSearch',
      title: t('developSection.imgSearch'),
      href: '/docs/image_similarity_search.md',
      logo: '/images/home/image-search.png',
    },
    {
      id: 'multimodal',
      title: t('developSection.multimodal'),
      href: DEMO_MULTIMODAL_SEARCH_URL,
      logo: '/images/home/multimodal-search.png',
    },
    {
      id: 'hybridSearch',
      title: t('developSection.hybridSearch'),
      href: DEMO_HYBRID_SEARCH_URL,
      logo: '/images/home/hybrid-search.png',
    },
    {
      id: 'graph-rag',
      title: t('developSection.graphRag'),
      href: '/docs/graph_rag_with_milvus.md',
      logo: '/images/home/graph-rag.png',
    },
  ];

  const transformRight = (step: 2 | -2) => {
    if (step === -2 && moveRightSteps === 0) {
      return;
    }

    if (step === 2 && moveRightSteps === techStacks.length - 3) {
      return;
    }

    setMoveRightSteps(moveRightSteps + step);
  };

  return (
    <section className={clsx(classes.sectionContainer)}>
      <div className={clsx(pageClasses.homeContainer, classes.titleWrapper)}>
        <h2>{t('home:developSection.title')}</h2>
        <p>{t('home:developSection.subTitle')}</p>
      </div>

      <div className={classes.listViewArea}>
        <div className={pageClasses.homeContainer}>
          <ul
            className={classes.stacksList}
            style={{
              transform: `translateX(-${moveRightSteps * (382 + 12)}px)`,
            }}
          >
            {techStacks.map(v => (
              <li className={classes.stackItem} key={v.id}>
                <div>
                  <span className={classes.logoWrapper}>
                    <img src={v.logo} alt={v.title} />
                  </span>
                  <h3 className={classes.stackTitle}>{v.title}</h3>
                </div>

                <CustomButton
                  href={v.href}
                  variant="outlined"
                  endIcon={<RightWholeArrow />}
                  classes={{
                    root: classes.linkButton,
                  }}
                >
                  {t('buttons.tryNow')}
                </CustomButton>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={classes.ctaButtonWrapper}>
        <button
          className={clsx(classes.ctaButton, classes.leftButton)}
          onClick={() => {
            transformRight(-2);
          }}
          disabled={moveRightSteps === 0}
        >
          <RightArrow />
        </button>
        <button
          className={classes.ctaButton}
          onClick={() => {
            transformRight(2);
          }}
          disabled={moveRightSteps === techStacks.length - 3}
        >
          <RightArrow />
        </button>
      </div>
    </section>
  );
}

export const MeetupsSection = () => {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home', { lng: locale });

  return (
    <section
      className={clsx(classes.sectionContainer, classes.meetupContainer)}
    >
      <div className={clsx(pageClasses.homeContainer)}>
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
      </div>
    </section>
  );
};
