import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout/layout";
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
import LfaiLogo from '../images/logo/lfai-color.png';

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

const users = []
const resources = []
function importAllPics(r, type) {
  r.keys().forEach((key) => {
    const m = r(key);
    const matchs = key.match(/.\/(\S*).svg/)
    let href = ''
    if (type === 'resources' && matchs.length) {
      switch (matchs[1]) {
        case 'bilibili':
          href = "bilibli"
          break
        case 'medium':
          href = "https://medium.com/@milvusio"
          break
        case 'slack':
          href = "https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk"
          break
        case 'twitter':
          href = "https://twitter.com/milvusio"
          break
        case 'zhihui':
          href = "zhihui"
          break
        case "wechat":
          href = "wechat"
          break
        default:
          href = ""
          break
      }
    }
    type === "users"
      ? users.push(m)
      : resources.push({ src: m, name: matchs && matchs[1], href })
  });
}
importAllPics(require.context('../images/website/users', false, /\.jpg$/), "users");
importAllPics(require.context('../images/website/community', false, /\.svg$/), "resources");

const IndexPage = ({ data, pageContext }) => {
  const language = data.allFile.edges[0].node.childLayoutJson.layout;
  const { locale } = pageContext;
  const { section1, section2, section3, section4, section5, section6, section7 } = language.home;

  const [screenWidth, setScreenWidth] = useState(null);
  useEffect(() => {
    const cb = () => {
      setScreenWidth(document.body.clientWidth);
    };
    cb();
    window.addEventListener("resize", cb);
    return () => {
      window.removeEventListener("resize", cb);
    };
  }, []);
  return (
    <Layout language={language} locale={locale}>
      <SEO title="Milvus Home" />
      {screenWidth > 1000 && <Notification></Notification>}
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
        <section className="section5">
          <img src={LfaiLogo} alt="lfai logo"></img>
          <p>{section5.desc}</p>
        </section>
        <section className="section6">
          <h2>{section6.title}</h2>
          <ul>
            {
              users.map((v, i) => (
                <li key={i}>
                  <img src={v} alt="customer"></img>
                </li>
              ))
            }
          </ul>
        </section>
        <section className="section7">
          <h2>{section7.title}</h2>
          <p>{section7.desc}</p>
          <ul>
            {
              resources.map((v, i) => (
                <li key={v.name}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">
                    <img src={v.src} alt="resouce"></img>
                  </a>
                  <p>{v.name}</p>
                </li>
              ))
            }
          </ul>
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
                  desc
                }
                section6 {
                  title
                }
                section7{
                  title
                  desc
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
