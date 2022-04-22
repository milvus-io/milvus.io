import React from 'react';
import { graphql } from 'gatsby';
import { useI18next } from 'gatsby-plugin-react-i18next';
import Layout from '../components/layout';
import BannerCard from '../components/card/bannerCard';
import SolutionCard from '../components/card/solutionCard';
import Seo from '../components/seo';
import imageSearch from '../images/docs/image_search.svg';
import audioSearch from '../images/docs/audio-search.svg';
import hybrid from '../images/docs/hybrid.svg';
import molecular from '../images/docs/molecular.svg';
import questionAnswering from '../images/docs/question_answering.svg';
import recommend from '../images/docs/recommend.svg';
import videoSearch from '../images/docs/video-search.svg';
import { useCodeCopy, useFilter } from '../hooks/doc-dom-operation';
import './bootcampTemplate.less';
import { useFormatAnchor } from '../hooks/doc-anchor';
import bootcamp from '../pages/docs/versions/master/bootcamp/site/en/bootcampHome/index.json';

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
  const { t } = useI18next();
  const { locale } = pageContext;
  const { banner, title, description, section3, section4 } = bootcamp;

  const SeoTitle = 'Milvus Bootcamp';
  const desc = 'Join Milvus Bootcamp';

  // add hooks used by doc template
  useFilter();
  useCodeCopy({
    copy: t('v3trans.copyBtn.copyLabel'),
    copied: t('v3trans.copyBtn.copiedLabel'),
  });
  useFormatAnchor();

  return (
    <Layout t={t}>
      <div className="bootcamp-wrapper">
        <Seo title={SeoTitle} lang={locale} description={desc} />
        <main className="mainContainer col-4 col-8 col-12">
          <section className="content bootcamp">
            <div className="container">
              <BannerCard
                content={description}
                title={title}
                img={banner.img.publicURL}
              />
            </div>

            <div className="container">
              <h1 className="title">{section3.title}</h1>
              <ul className="solutionsWrapper">
                {section3.content.map(item => {
                  const { title, link, iconType, desc, liveDemo } = item;
                  return (
                    <li key={title}>
                      <SolutionCard
                        title={title}
                        content={desc}
                        img={Icons[iconType]}
                        href={link}
                        liveDemo={liveDemo}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="container">
              <h1 className="title">{section4.title}</h1>
              <ul className="solutionsWrapper">
                {section4.content.map(item => {
                  const { title, link, desc } = item;
                  return (
                    <li key={title}>
                      <SolutionCard title={title} content={desc} href={link} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default BootcampTemplate;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          data
          language
          ns
        }
      }
    }
  }
`;
