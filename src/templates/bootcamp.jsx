import React from 'react';
import BannerCard from '../components/card/bannerCard';
import LinkCard from '../components/card/linkCard';
import SolutionCard from '../components/card/solutionCard';
import banner from '../images/doc-home/banner.jpg';
import Seo from '../components/seo';
import imageSearch from '../images/doc-home/image_search.svg';
import audioSearch from '../images/doc-home/audio-search.svg';
import hybrid from '../images/doc-home/hybrid.svg';
import molecular from '../images/doc-home/molecular.svg';
import questionAnswering from '../images/doc-home/question_answering.svg';
import recommend from '../images/doc-home/recommend.svg';
import videoSearch from '../images/doc-home/video-search.svg';
import Header from '../components/header/v2';
import { useMobileScreen } from '../hooks/index';
import SideBar from '../components/sidebar/sidebar';
import * as styles from './bootcampTemplate.module.less';

const Icons = {
  IMAGE_SEARCH: imageSearch,
  QUESTION_ANSWER: questionAnswering,
  RECOMMENDATION: recommend,
  VIDEO_SEARCH: videoSearch,
  AUDIO_SEARCH: audioSearch,
  MOLECULAR: molecular,
  HYBRID: hybrid,
};

const BootcampTemplate = ({ pageContext }) => {
  const {
    bootcampData: { title, description, section1, section2, section3 },
    locale,
    menuList
  } = pageContext;

  const menuConfig = {
    menuList,
    activePost: null,
    pageType: 'bootcamp'
  };

  const [title1, content1] = [section1.title, section1.content];
  const [title2, content2] = [section2.title, section2.content];
  const [title3, content3] = [section3.title, section3.content];
  const { isMobile } = useMobileScreen();
  return (
    <div className={styles.bootcampContainer}>
      <Header type="doc" locale={locale} />
      <Seo title={title} lang={locale} />
      <main className={styles.mainContainer}>

        <SideBar
          locale={locale}
          showSearch={false}
          wrapperClass={styles.sidebar}
          menuConfig={menuConfig}
        />

        <section className={styles.content}>
          <div className={styles.container}>
            <BannerCard
              content={description}
              title={title}
              img={banner}
              isMobile={isMobile}
            />
          </div>

          <div className={styles.container}>
            <h1 className={styles.title}>{title1}</h1>
            <ul className={styles.solutionsWrapper}>
              {content1.map(item => {
                const { title, link } = item;
                return (
                  <li key={title}>
                    <LinkCard label={title} href={link} />
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.container}>
            <h1 className={styles.title}>{title2}</h1>
            <ul className={styles.solutionsWrapper}>
              {content2.map(item => {
                const { title, link, desc, iconType } = item;
                return (
                  <li key={title}>
                    <SolutionCard
                      title={title}
                      content={desc}
                      img={Icons[iconType]}
                      href={link}
                    />
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.container}>
            <h1 className={styles.title}>{title3}</h1>
            <ul className={styles.solutionsWrapper}>
              {content3.map(item => {
                const { title, link, iconType, desc } = item;
                return (
                  <li key={title}>
                    <SolutionCard
                      title={title}
                      content={desc}
                      img={Icons[iconType]}
                      href={link}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

      </main>
    </div>
  );
};

export default BootcampTemplate;
