import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../../components/layout/layout';
import Seo from '../../components/seo';
import './scenarios.less';
import AudioBg from '../../images/scenario/audio.png';
import CvBg from '../../images/scenario/cv.png';
import NlpBg from '../../images/scenario/nlp.png';
import MolsearchBg from '../../images/scenario/molsearch.png';

const imgs = {
  audio: AudioBg,
  cv: CvBg,
  nlp: NlpBg,
  molsearch: MolsearchBg,
};

const ScenariosPage = ({ data, pageContext }) => {
  const language = data.allFile.edges[0].node.childLayoutJson.layout;
  const { locale } = pageContext;
  const { section1, section2, section3 } = language.scenarios;

  return (
    <Layout language={language} locale={locale}>
      <Seo title="Milvus Scenarios" />
      <div className="scenarios-wrapper">
        <section className="section1">
          <h2>{section1.title}</h2>
          <p className="desc">{section1.desc}</p>
        </section>
        <section className="section2">
          <p>{section2.desc1}</p>
          <p>{section2.desc2}</p>
          <p>{section2.desc3}</p>
        </section>
        <section className="section3">
          <h2>{section3.title}</h2>
          <div className="demo-wrapper">
            {section3.list.map(v => (
              <div className="item" key={v.img}>
                <div className="img-wrapper">
                  <img src={imgs[v.img]} alt={v.title}></img>
                  {v.href && (
                    <a
                      className="rectangle"
                      href={v.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
                <h3>
                  {v.titleHref ? (
                    <a
                      href={v.titleHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {v.title}
                    </a>
                  ) : (
                    v.title
                  )}
                </h3>
                <p className="desc">{v.desc}</p>
                {v.list.map(item => (
                  <p className="feature" key={item}>
                    {item}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export const Query = graphql`
  query ScenariosQuery($locale: String) {
    allFile(filter: { name: { eq: $locale } }) {
      edges {
        node {
          childLayoutJson {
            layout {
              notFound
              header {
                quick
                benchmarks
                why
                gui
                tutorials
                solution
                about
                doc
                blog
                try
                loading
                noresult
                tutorial
              }
              footer {
                product {
                  title
                  txt1
                  txt2
                }
                doc {
                  title
                  txt1
                  txt2
                  txt3
                }
                tool {
                  title
                  txt1
                }
                resource {
                  title
                  txt1
                  txt2
                  txt3
                  txt4
                }
                contact {
                  title
                  wechat
                }
              }

              scenarios {
                section1 {
                  title
                  desc
                }
                section2 {
                  desc1
                  desc2
                  desc3
                }
                section3 {
                  title
                  list {
                    title
                    desc
                    list
                    img
                    href
                    titleHref
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

export default ScenariosPage;
