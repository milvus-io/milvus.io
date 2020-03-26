import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout/newLayout";
import SEO from "../components/seo";
import LocalizedLink from "../components/localizedLink/localizedLink";
import Notification from "../components/notification";
import "../scss/index.scss";
import availabilityIcon from "../images/features/availability.svg";
import cloudIcon from "../images/features/cloud.svg";
import costIcon from "../images/features/cost.svg";
import crudIcon from "../images/features/crud.svg";
import hybridIcon from "../images/features/hybrid.svg";
import performenceIcon from "../images/features/performence.svg";
import realtimeIcon from "../images/features/realtime.svg";
import scalableIcon from "../images/features/scalable.svg";
import supportIcon from "../images/features/support.svg";

import GithubButton from "react-github-button";
import "react-github-button/assets/style.css";

const icons = {
  availability: availabilityIcon,
  cloud: cloudIcon,
  support: supportIcon,
  scalable: scalableIcon,
  realtime: realtimeIcon,
  performence: performenceIcon,
  hybrid: hybridIcon,
  crud: crudIcon,
  cost: costIcon,
};

const IndexPage = ({ data, pageContext }) => {
  const language = data.allFile.edges[0].node.childLayoutJson.layout;
  const { locale } = pageContext;
  const { section1, section2, section3, section4, section5 } = language.home;



  return (
    <Layout language={language} locale={locale}>
      <SEO title="Milvus Home" />
      <Notification></Notification>
      <main className="home-wrapper">
        <section className="section1">
          <div className="githubicon">
            <GithubButton
              type="stargazers"
              size="large"
              namespace="milvus-io"
              repo="milvus"
            />
          </div>
          <h1>{section1.desc1}</h1>
          <h3>{section1.desc2}</h3>
          <div className="btn-wrapper">
            <LocalizedLink
              className="primary white-color"
              to="/docs/about_milvus/overview.md"
              locale={locale}
            >
              {section1.link}
            </LocalizedLink>
            <LocalizedLink
              className="primary white-color"
              to="/docs/about_milvus/overview.md"
              locale={locale}
            >
              {section1.community}
            </LocalizedLink>

          </div>
        </section>
        <section className="section3">
          {/* <h2>{section3.title}</h2> */}
          <ul className="feature-wrapper">
            {section3.list.map(v => (
              <li className="feature-item" key={v.title}>
                <div className="title-wrapper">
                  <img src={icons[v.img]} alt="icon"></img>
                  <p className="title">{v.title}</p>
                </div>
                <p className="content">{v.content}</p>

              </li>
            ))}
          </ul>
        </section>
        <section className="section4">
          <h2>{section4.title}</h2>
          <p>{section4.desc1}</p>
          <p>{section4.desc2}</p>
          <div className="btn-wrapper">
            <a className="primary primary-color">{section4.contribute}</a>
            <a className="primary white-color">{section4.bootcamp}</a>

          </div>
        </section>
        {/* <section className="section5">
          <div id="solution" className="anchor"></div>
          <h2>{section5.title}</h2>
          <div className="content">
            <section className="search card">
              <div className="detail">
                <p className="title">{section5.img1.title}</p>
                <p className="content">{section5.img1.content}</p>

                <a
                  className="rectangle"
                  href="http://40.73.38.81"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {section5.button}
                  <i className={`fas fa-chevron-right triangle `}></i>
                </a>
              </div>
              <a
                className="mask"
                href={
                  locale === "en"
                    ? "https://github.com/milvus-io/bootcamp/blob/master/EN_solutions/pic_search/README.md"
                    : "https://github.com/milvus-io/bootcamp/blob/master/solutions/pic_search/README.md"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <span></span>
              </a>
            </section>
            <section className="recommend card">
              <div className="detail">
                <p className="title">{section5.img2.title}</p>
                <p className="content">{section5.img2.content}</p>
              </div>
              <a
                className="mask"
                href={
                  locale === "en"
                    ? "https://github.com/milvus-io/bootcamp/blob/master/EN_solutions/recommender_system/README.md"
                    : "https://github.com/milvus-io/bootcamp/blob/master/solutions/recommender_system/README.md"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <span></span>
              </a>
            </section>
            <section className="molecular card">
              <div className="detail">
                <p className="title">{section5.img3.title}</p>
                <p className="content">{section5.img3.content}</p>

                <a
                  className="rectangle"
                  href="http://40.73.24.85"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {section5.button}
                  <i className={`fas fa-chevron-right triangle `}></i>
                </a>
              </div>
              <a
                className="mask"
                href={
                  locale === "en"
                    ? "https://github.com/milvus-io/bootcamp/blob/master/EN_solutions/mols_search/README.md"
                    : "https://github.com/milvus-io/bootcamp/blob/master/solutions/mols_search/README.md"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <span></span>
              </a>
            </section>
          </div>
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <a
              className="primary primary-color"
              href="https://github.com/milvus-io/bootcamp/tree/master/EN_solutions"
              target="_blank"
              rel="noopener noreferrer"
            >
              {section5.viewall}
            </a>
          </div>
        </section> */}
      </main>
    </Layout>
  );
};

export const Query = graphql`
  query HomeQuery($locale: String) {
    allFile(filter: { name: { eq: $locale } }) {
      edges {
        node {
          childLayoutJson {
            layout {
              header {
                quick
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
              home {
                section1 {
                  desc1
                  desc2
                  link
                  community
                }
                section2 {
                  title
                  content
                  link
                }
                section3 {
                  title
                  list {
                    title
                    content
                    img
                  }
                }
                section4 {
                  title
                  desc1
                  desc2
                  contribute
                  bootcamp
                }
                section5 {
                  title
                  desc
                  button
                  viewall
                  img1 {
                    title
                    content
                  }
                  img2 {
                    title
                    content
                  }
                  img3 {
                    title
                    content
                  }
                }
                section6 {
                  title
                  button
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
