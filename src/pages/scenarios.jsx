import React, { useState, useMemo } from "react";
import Layout from "../components/layout/layout";
import SEO from "../components/seo";
import LocalizedLink from "../components/localizedLink/localizedLink"
import "../scss/gui.scss";
import GUI01 from '../images/gui-1.png'
import GUI02 from '../images/gui-2.png'
import GUI03 from '../images/gui-3.png'
import GUI04 from '../images/gui-4.png'

const ScenariosPage = ({ data, pageContext }) => {
  const language = data.allFile.edges[0].node.childLayoutJson.layout;
  const { locale } = pageContext;
  const { section1, section2, section3, section4 } = language.scenarios;
  const [current, setCurrent] = useState(0)
  const handlePrev = () => {
    setCurrent(v => v === 0 ? 3 : v - 1)
  }
  const handleNext = () => {
    setCurrent(v => v === 3 ? 0 : v + 1)
  }
  const currentImg = useMemo(() => {
    switch (current) {
      case 0:
        return GUI01
      case 1:
        return GUI02
      case 2:
        return GUI03
      case 3:
        return GUI04
      default:
        return GUI01
    }
  }, [current])
  return (
    <Layout language={language} locale={locale}>
      <SEO title="Milvus GUI" />
      <main className="gui-wrapper">
        <section className="section1">
          <h2>{section1.title}</h2>
        </section>
        <section className="section2">
          <p>{section2.desc1}</p>
          <p>{section2.desc2}</p>
          <p>{section2.desc3}</p>

        </section>

      </main>
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
                why
                gui
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
                tool{
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
                section1{
                  title
                }
                section2{
                  desc1
                  desc2
                  desc3
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
