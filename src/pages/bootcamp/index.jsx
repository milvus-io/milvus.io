import React from 'react';
import { graphql } from 'gatsby';
import BannerCard from '../../components/card/bannerCard';
import LinkCard from '../../components/card/linkCard';
import SolutionCard from '../../components/card/solutionCard';
import banner from '../../images/doc-home/banner.jpg';
import Seo from '../../components/seo';
import imageSearch from '../../images/doc-home/image_search.svg';
import audioSearch from '../../images/doc-home/audio-search.svg';
import hybrid from '../../images/doc-home/hybrid.svg';
import molecular from '../../images/doc-home/molecular.svg';
import questionAnswering from '../../images/doc-home/question_answering.svg';
import recommend from '../../images/doc-home/recommend.svg';
import videoSearch from '../../images/doc-home/video-search.svg';
import Header from '../../components/header/v2';
import { useMobileScreen } from '../../hooks';
import * as styles from './index.module.less';

const Icons = {
  IMAGE_SEARCH: imageSearch,
  QUESTION_ANSWER: questionAnswering,
  RECOMMENDATION: recommend,
  VIDEO_SEARCH: videoSearch,
  AUDIO_SEARCH: audioSearch,
  MOLECULAR: molecular,
  HYBRID: hybrid
};

const BootcampTemplat = ({ data, pageContext }) => {
  console.log('data', data);
  console.log('pageContext:', pageContext);

  const { isMobile } = useMobileScreen();

  const { locale } = pageContext;

  const {
    title,
    solutions,
    id,
    solutionTitle,
    description,
    deployments,
    deploymentTitle,
    benchmarks,
    benchmarkTitle,
  } = locale === 'en' ? data.allBootcampJson.nodes[0].data.en : data.allBootcampJson.nodes[0].data.cn;

  return (
    <div className={styles.bootcampContainer}>
      <Header
        type="doc"
        header={{ search: 'search' }}
        isSecondHeader={true}
        className={styles.header}
        locale={locale}
      />
      <Seo title={title} />
      <main className={styles.mainContainer}>
        <BannerCard
          title={title}
          content={description}
          img={banner}
          isMobile={isMobile}
        />
        <div className={styles.benchmarkContainer}>
          <p className={styles.title}>{benchmarkTitle}</p>
          <div className={styles.benchmarksWrapper}>
            {
              benchmarks.map(item => {
                const { id, title, link } = item;
                return (
                  <LinkCard
                    key={id}
                    label={title}
                    href={link}
                    className={styles.linkCardItem}
                  />
                );
              })
            }
          </div>

        </div>

        <div>
          <p className={styles.title}>{solutionTitle}</p>
          <div className={styles.solutionsWrapper}>
            {
              solutions.map(item => {
                const { id, title, link, desc, iconType } = item;
                return (
                  <SolutionCard
                    key={id}
                    title={title}
                    content={desc}
                    img={Icons[iconType]}
                    href={link}
                  />
                );
              })
            }
          </div>
        </div>

        <div>
          <p className={styles.title}>{deploymentTitle}</p>
          <div className={styles.solutionsWrapper}>
            {
              deployments.map(item => {
                const { id, title, link, iconType, desc } = item;
                return (
                  <SolutionCard
                    key={id}
                    title={title}
                    content={desc}
                    img={Icons[iconType]}
                    href={link}
                  />
                );
              })
            }
          </div>
        </div>
      </main>

    </div>
  );
};

export default BootcampTemplat;

export const pageQuery = graphql`
  query bootcampQuery {
    allFile(filter: {absolutePath: {regex: "/(?:bootcamp)/"}}) {
      edges {
        node {
          id
        }
      }
    }
    allBootcampJson {
      nodes {
        data {
          en {
            benchmarkTitle
            benchmarks {
              id
              link
              title
            }
            deploymentTitle
            deployments {
              desc
              id
              link
              title
            }
            description
            id
            solutionTitle
            solutions {
              desc
              iconType
              id
              link
              title
            }
            title
          }
          cn {
            benchmarkTitle
            benchmarks {
              id
              link
              title
            }
            deploymentTitle
            deployments {
              desc
              id
              link
              title
            }
            description
            id
            solutionTitle
            solutions {
              desc
              iconType
              id
              link
              title
            }
            title
          }
        }
      }
    }
  }
`;
