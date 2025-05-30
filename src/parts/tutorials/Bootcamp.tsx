import Head from 'next/head';
import Layout from '@/components/layout/commonLayout';
import SolutionCard from '@/components/card/solutionCard';
import classes from '@/styles/bootcamp.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { ABSOLUTE_BASE_URL } from '@/consts';

export function Bootcamp(props) {
  const { bootcampData } = props;

  const { title, description, section3, section4 } = bootcampData;

  const Icons = {
    IMAGE_SEARCH: '/images/bootcamp/image-search.svg',
    QUESTION_ANSWER: '/images/bootcamp/question-answering.svg',
    RECOMMENDATION: '/images/bootcamp/recommend.svg',
    VIDEO_SEARCH: '/images/bootcamp/video-search.svg',
    AUDIO_SEARCH: '/images/bootcamp/audio-search.svg',
    MOLECULAR: '/images/bootcamp/molecular.svg',
    DNA_CLASS: '/images/bootcamp/hybrid.svg',
  };

  return (
    <main>
      <Layout>
        <Head>
          <title>Milvus Bootcamp</title>
          <meta name="description" content="Join Milvus Bootcamp" />
        </Head>

        <div
          className={clsx(pageClasses.homeContainer, classes.bootcampContainer)}
        >
          <section className={classes.sectionContainer}>
            <h1 className={classes.seoTitle}>Milvus Bootcamp</h1>
            <h2 className={classes.title}>{title}</h2>
            <p
              className={classes.desc}
              dangerouslySetInnerHTML={{ __html: description }}
            ></p>
          </section>

          <section className={classes.sectionContainer}>
            <h2 className={classes.title}>{section3.title}</h2>
            <ul className={classes.cardsWrapper}>
              {section3.content.map(item => {
                const { title, link, iconType, desc, liveDemo, ctaLabel } =
                  item;
                return (
                  <li key={title}>
                    <SolutionCard
                      title={title}
                      content={desc}
                      href={link}
                      liveDemo={liveDemo}
                      ctaLabel={ctaLabel}
                    />
                  </li>
                );
              })}
            </ul>
          </section>

          {section4.content.length > 0 && (
            <section className={classes.sectionContainer}>
              <h2 className={classes.title}>{section4.title}</h2>
              <ul className={classes.cardsWrapper}>
                {section4.content.map(item => {
                  const { title, link, desc } = item;
                  return (
                    <li key={title}>
                      <SolutionCard title={title} content={desc} href={link} />
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </Layout>
    </main>
  );
}
