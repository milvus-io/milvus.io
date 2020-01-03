import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout/layout";
import SEO from "../components/seo";
import LocalizedLink from "../components/localizedLink/localizedLink";
import Notification from "../components/notification";
import "../scss/index.scss";
import WhatIsMilvus from "../images/what-is-milvus.png";
import Icon1 from "../images/icon-1.png";
import Icon2 from "../images/icon-2.png";
import Icon3 from "../images/icon-3.png";
import Icon4 from "../images/icon-4.png";
import Icon5 from "../images/icon-5.png";
import Icon6 from "../images/icon-6.png";
import GithubButton from "react-github-button";
import "react-github-button/assets/style.css";

const icons = [Icon1, Icon2, Icon3, Icon4, Icon5, Icon6];

const IndexPage = ({ data, pageContext }) => {
  const language = data.allFile.edges[0].node.childLayoutJson.layout;
  const { locale } = pageContext;
  const { section1, section2, section3, section4 } = language.home;

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : ""
  );
  useEffect(() => {
    const cb = e => {
      setWindowWidth(e.target.innerWidth);
    };
    window.addEventListener("resize", cb);
    return () => {
      window.removeEventListener("resize", cb);
    };
  }, []);
  const milvus = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true
  ];
  const faiss = [
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    false
  ];
  const sptag = [
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    false
  ];

  const TableMax = () => (
    <div className="content-wrapper">
      <ul className="table-name">
        <li className="table-header"></li>
        {section4.list.map(v => (
          <li key={v} className="table-item">
            {v}
          </li>
        ))}
      </ul>
      <ul className="table-value">
        <li className="table-header">Milvus</li>
        {milvus.map((v, i) => (
          <li key={i} className="table-item">
            <span className={`circle ${!v && "dark"}`}></span>
          </li>
        ))}
      </ul>
      <ul className="table-value">
        <li className="table-header">Faiss</li>
        {faiss.map((v, i) => (
          <li key={i} className="table-item">
            <span className={`circle ${!v && "dark"}`}></span>
          </li>
        ))}
      </ul>
      <ul className="table-value">
        <li className="table-header">Sptag</li>
        {sptag.map((v, i) => (
          <li key={i} className="table-item">
            <div className={`circle ${!v && "dark"}`}></div>
          </li>
        ))}
      </ul>
    </div>
  );

  const TableMin = () => (
    <div className="content-wrapper">
      <ul className="table-name">
        <li className="table-header">Milvus</li>
        {section4.list.map((v, index) => (
          <li key={v} className="table-item">
            <div className="name">{v}</div>
            <span className={`circle ${!milvus[index] && "dark"}`}></span>
          </li>
        ))}
      </ul>

      <ul className="table-name">
        <li className="table-header">Faiss</li>
        {section4.list.map((v, index) => (
          <li key={v} className="table-item">
            <div className="name">{v}</div>
            <span className={`circle ${!faiss[index] && "dark"}`}></span>
          </li>
        ))}
      </ul>

      <ul className="table-name">
        <li className="table-header">Sptag</li>
        {section4.list.map((v, index) => (
          <li key={v} className="table-item">
            <div className="name">{v}</div>
            <span className={`circle ${!sptag[index] && "dark"}`}></span>
          </li>
        ))}
      </ul>
    </div>
  );

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
          <img src={WhatIsMilvus} alt="what is milvus"></img>
          <div className="content">
            <h3>{section2.title}</h3>
            <p>{section2.content}</p>
            <LocalizedLink
              className="primary primary-color"
              to="/docs/about_milvus/overview.md"
              locale={locale}
            >
              {section2.link}
            </LocalizedLink>
          </div>
        </section>
        <section className="section3">
          <h2>{section3.title}</h2>
          <ul className="feature-wrapper">
            {section3.list.map((v, index) => (
              <li className="feature-item" key={v.title}>
                <img src={icons[index]} alt="icon"></img>
                <div>
                  <p className="title">{v.title}</p>
                  <p className="content">{v.content}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="section4">
          <h2>{section4.title}</h2>
          {windowWidth > 1000 || !windowWidth ? (
            <TableMax></TableMax>
          ) : (
            <TableMin></TableMin>
          )}
        </section>
      </main>
    </Layout>
  );
};

export const Query = graphql`
  query BiQuery($locale: String) {
    allFile(filter: { name: { eq: $locale } }) {
      edges {
        node {
          childLayoutJson {
            layout {
              header {
                about
                doc
                blog
                try
                loading
                noresult
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
                resource {
                  title
                  txt1
                  txt2
                  txt3
                  txt4
                }
                contact {
                  title
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
                  }
                }
                section4 {
                  title
                  list
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
