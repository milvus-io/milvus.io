import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout/newLayout";
import SEO from "../components/seo";
import LocalizedLink from "../components/localizedLink/localizedLink";
import Notification from "../components/notification";
import "../scss/index.scss";
// import WhatIsMilvus from "../images/what-is-milvus.png";
import availabilityIcon from "../images/availability.png";
import easyIcon from "../images/easy.png";
import heterogeneousIcon from "../images/heterogeneous.png";
import indexIcon from "../images/index.png";
import resourceIcon from "../images/resource.png";
import scalabilityIcon from "../images/scalability.png";
import GithubButton from "react-github-button";
import "react-github-button/assets/style.css";

const icons = {
  availability: availabilityIcon,
  easy: easyIcon,
  heterogeneous: heterogeneousIcon,
  index: indexIcon,
  resource: resourceIcon,
  scalability: scalabilityIcon
};

const IndexPage = ({ data, pageContext }) => {
  const language = data.allFile.edges[0].node.childLayoutJson.layout;
  const { locale } = pageContext;
  const { section1, section2, section3, section5 } = language.home;

  // const [windowWidth, setWindowWidth] = useState("");

  // useEffect(() => {
  //   setWindowWidth(window.innerWidth);
  //   const cb = e => {
  //     setWindowWidth(e.target.innerWidth);
  //   };
  //   window.addEventListener("resize", cb);

  //   return () => {
  //     window.removeEventListener("resize", cb);
  //   };
  // }, []);

  // const milvus = [
  //   true,
  //   true,
  //   true,
  //   true,
  //   true,
  //   true,
  //   true,
  //   true,
  //   true,
  //   true,
  //   true,
  //   true
  // ];
  // const faiss = [
  //   true,
  //   true,
  //   true,
  //   true,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   true,
  //   false,
  //   false
  // ];
  // const sptag = [
  //   false,
  //   false,
  //   false,
  //   true,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   true,
  //   false,
  //   false
  // ];

  // const TableMax = () => (
  //   <div className="content-wrapper">
  //     <ul className="table-name">
  //       <li className="table-header"></li>
  //       {section4.list.map(v => (
  //         <li key={v} className="table-item">
  //           {v}
  //         </li>
  //       ))}
  //     </ul>
  //     <ul className="table-value">
  //       <li className="table-header">Milvus</li>
  //       {milvus.map((v, i) => (
  //         <li key={i} className="table-item">
  //           <div className={`circle ${!v && "dark"}`}></div>
  //         </li>
  //       ))}
  //     </ul>
  //     <ul className="table-value">
  //       <li className="table-header">Faiss</li>
  //       {faiss.map((v, i) => (
  //         <li key={i} className="table-item">
  //           <div className={`circle ${!v && "dark"}`}></div>
  //         </li>
  //       ))}
  //     </ul>
  //     <ul className="table-value">
  //       <li className="table-header">Sptag</li>
  //       {sptag.map((v, i) => (
  //         <li key={i} className="table-item">
  //           <div className={`circle ${!v && "dark"}`}></div>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );

  // const TableMin = () => (
  //   <div className="content-wrapper">
  //     <ul className="table-name">
  //       <li className="table-header">Milvus</li>
  //       {section4.list.map((v, index) => (
  //         <li key={v} className="table-item">
  //           <div className="name">{v}</div>
  //           <span className={`circle ${!milvus[index] && "dark"}`}></span>
  //         </li>
  //       ))}
  //     </ul>

  //     <ul className="table-name">
  //       <li className="table-header">Faiss</li>
  //       {section4.list.map((v, index) => (
  //         <li key={v} className="table-item">
  //           <div className="name">{v}</div>
  //           <span className={`circle ${!faiss[index] && "dark"}`}></span>
  //         </li>
  //       ))}
  //     </ul>

  //     <ul className="table-name">
  //       <li className="table-header">Sptag</li>
  //       {section4.list.map((v, index) => (
  //         <li key={v} className="table-item">
  //           <div className="name">{v}</div>
  //           <span className={`circle ${!sptag[index] && "dark"}`}></span>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );

  return (
    <Layout language={language} locale={locale}>
      <SEO title=" " />
      <Notification></Notification>
      <main className="home-wrapper">
        <section className="section1">
          <h1>{section1.desc1}</h1>
          <h1>{section1.desc2}</h1>
          <div className="btn-wrapper">
            <LocalizedLink
              className="primary primary-color"
              to="/docs/about_milvus/overview.md"
              locale={locale}
            >
              {section1.link}
            </LocalizedLink>
            <div className="githubicon">
              <GithubButton
                type="stargazers"
                size="large"
                namespace="milvus-io"
                repo="milvus"
              />
            </div>
          </div>
        </section>
        <section className="section2">
          <div className="content">
            <div id="whymilvus" className="anchor"></div>
            <h3>{section2.title}</h3>
            <p>{section2.content}</p>
          </div>
        </section>
        <section className="section3">
          {/* <h2>{section3.title}</h2> */}
          <ul className="feature-wrapper">
            {section3.list.map(v => (
              <li className="feature-item" key={v.title}>
                <img src={icons[v.img]} alt="icon"></img>
                <div>
                  <p className="title">{v.title}</p>
                  <p className="content">{v.content}</p>
                </div>
              </li>
            ))}
          </ul>
          <div style={{ textAlign: "center" }}>
            <LocalizedLink
              className="primary primary-color"
              to="/docs/guides/get_started/install_milvus/install_milvus.md"
              locale={locale}
            >
              {section2.link}
            </LocalizedLink>
          </div>
        </section>
        {/* <section className="section4">
          <h2>{section4.title}</h2>
          {windowWidth > 1000 || !windowWidth ? (
            <TableMax></TableMax>
          ) : (
              <TableMin></TableMin>
            )}
        </section> */}
        <section className="section5">
          <div id="solution" className="anchor"></div>
          <h2>{section5.title}</h2>
          {/* <p className="desc">{section5.desc}</p> */}
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
        </section>
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
                  list
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
