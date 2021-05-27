import React from 'react';
import { graphql } from 'gatsby';
import BannerCard from '../../components/card/bannerCard';
import LinkCard from '../../components/card/linkCard';
import SolutionCard from '../../components/card/solutionCard';
import banner from '../../images/doc-home/banner.jpg';
import Seo from '../../components/seo';
import * as styles from './index.module.less';

const BootcampTemplat = ({ data, pageContext }) => {
  console.log('data', data);
  console.log('pageContext:', pageContext);

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
  } = data.allBootcampJson.nodes[0].data;

  return (
    <div className={styles.bootcampContainer}>
      <Seo title={title} />
      <BannerCard
        title={title}
        content={description}
        img={banner}
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

      <div className={styles.solutionContainer}>
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
                  img={iconType}
                  href={link}
                />
              );
            })
          }
        </div>
      </div>

      <div className={styles.deploymentContainer}>
        <p className={styles.title}>{deploymentTitle}</p>
        <div className="deploymentsWrapper">
          {
            deployments.map(item => {
              const { id, title, link, iconType, desc } = item;
              return (
                <SolutionCard
                  key={id}
                  title={title}
                  content={desc}
                  img={iconType}
                  href={link}
                />
              );
            })
          }
        </div>
      </div>
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
`;
