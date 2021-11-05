import React from 'react';
import { graphql } from 'gatsby';
import Header from '../../components/header/v2';
import Footer from '../../components/footer/v2';
import Seo from '../../components/seo';
import LocalizedLink from '../../components/localizedLink/localizedLink';
import { DEMOS } from './constants';
import DemoCard from '../../components/card/demoCard';
import * as styles from './index.module.less';

const TITLE =
  'Milvus Reverse Image Search - Open-Source Vector Similarity Application Demo';
const DESC =
  'With Milvus, you can search by image in a few easy steps. Just click the “Upload Image” button and choose an image to see vector similarity search in action.';

const MilvusDemos = ({ data, pageContext }) => {
  const { footer } = data.allFile.edges.filter(i => i.node.childI18N)[0].node
    .childI18N.v2;
  const { locale } = pageContext;
  return (
    <>
      <Header locale={locale} showRobot={false} />
      <Seo title={TITLE} lang={locale} description={DESC} />
      <main className={styles.container}>
        <div className={styles.demoCardWrapper}>
          {DEMOS.map(demo => {
            return (
              <DemoCard
                key={demo.name}
                name={demo.name}
                desc={demo.desc}
                coverImg={demo.coverImg}
                href={demo.href}
                videoLink={demo.videoLink}
              />
            );
          })}
        </div>
      </main>
      <Footer footer={footer} locale={locale} />
    </>
  );
};

export default MilvusDemos;

export const Query = graphql`
  query LandingPageQuery($locale: String) {
    allFile(filter: { name: { eq: $locale } }) {
      edges {
        node {
          childI18N {
            v2 {
              footer {
                list {
                  title
                  text
                  href
                  label
                  icons {
                    href
                    name
                  }
                }
                licence {
                  text1 {
                    label
                    link
                  }
                  text2 {
                    label
                    link
                  }
                  text3 {
                    label
                    link
                  }
                  list {
                    label
                    link
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
