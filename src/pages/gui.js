import React, { useState, useMemo } from "react";
import Layout from "../components/layout/guiLayout";
import SEO from "../components/seo";
import LocalizedLink from "../components/localizedLink/localizedLink"
import "../scss/gui.scss";
import GUI01 from '../images/gui-1.png'
import GUI02 from '../images/gui-2.png'
import GUI03 from '../images/gui-3.png'
import GUI04 from '../images/gui-4.png'

const GuiPage = ({ data, pageContext }) => {
  const language = data.allFile.edges[0].node.childLayoutJson.layout;
  const { locale } = pageContext;
  const { section1, section2, section3, section4 } = language.gui;
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
          <p>{section1.desc}</p>
        </section>
        {/* <section className="section2">
          {
            section2.list.map(v => (
              <p>
                <i class={`fas ${v.img}`}></i>
                {v.content}
              </p>
            ))
          }

        </section> */}
        <section className="section3">
          <h2>{section3.title}</h2>
          <div className="docker-code">
            <p>docker pull milvusdb/milvus-admin:latest</p>
            <p> docker run -p 3000:80 milvusdb/milvus-admin:latest</p>
          </div>
          <p>{section3.desc} http://localhost:3000/</p>
          <LocalizedLink
            className="primary primary-color btn"
            to="/docs/Milvus%20Admin/admin_operations.md"
            locale={locale}
          >
            {section3.help}
          </LocalizedLink>
        </section>
        <section className="section4">
          <h2>{section4.title}</h2>
          <div className="img-wrapper">
            <i class="fas fa-chevron-left" role="button" onClick={handlePrev}></i>
            <img src={currentImg} alt="gui desc" className="img"></img>
            <i class="fas fa-chevron-right" role="button" onClick={handleNext}></i>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export const Query = graphql`
  query GuiQuery($locale: String) {
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

              gui {
                section1{
                  title
                  desc
                }
                section2{
                  list {
                    content
                    img
                  }
                }
                section3{
                  title
                  desc
                  help
                }
                section4{
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default GuiPage;
