import React, { useEffect } from 'react';
import { graphql, navigate } from 'gatsby';
import Layout from '../components/layout/layout';
import SEO from '../components/seo';
import LocalizedLink from '../components/localizedLink/localizedLink';
import Notification from '../components/notification';
import '../scss/index.scss';
import availabilityIcon from '../images/features/availability.svg';
import cloudIcon from '../images/features/cloud.svg';
import costIcon from '../images/features/cost.svg';
import crudIcon from '../images/features/crud.svg';
import hybridIcon from '../images/features/hybrid.svg';
import performenceIcon from '../images/features/performence.svg';
import realtimeIcon from '../images/features/realtime.svg';
import scalableIcon from '../images/features/scalable.svg';
import supportIcon from '../images/features/support.svg';
import metricsIcon from '../images/features/metrics.svg';

import LfaiLogo from '../images/logo/lfai.svg';
import GithubLogo from '../images/icon/github-white.svg';
import LearnLogo from '../images/icon/learn.svg';
import adminIcon from '../images/tools/admin.png';
import cIcon from '../images/tools/c++.png';
import goIcon from '../images/tools/go.png';
import javaIcon from '../images/tools/java.png';
import pythonIcon from '../images/tools/python.png';
import sizingIcon from '../images/tools/sizing.png';
import Qcode from '../images/qrcode.jpeg';
import MilvusUserWechat from '../images/milvus-user-wechat.png';
import GithubButton from 'react-github-button';
import {importAllPics} from '../utils/docTemplate.util'
import 'react-github-button/assets/style.css';

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
  metrics: metricsIcon,
};

let users = [];
let resources = [];

importAllPics(
  require.context('../images/website/show-users', false, /\.jpg|.png$/),
  'users',
  users
);
importAllPics(
  require.context('../images/website/community', false, /\.svg$/),
  'resources',
  users,
  resources
);

const getRedirectLanguage = () => {
  if (typeof navigator === `undefined`) {
    return 'en';
  }

  const lang =
    navigator && navigator.language && navigator.language.split('-')[0];
  if (!lang) return 'en';

  switch (lang) {
    case 'zh':
      return 'cn';
    default:
      return 'en';
  }
};

const IndexPage = ({ data, pageContext }) => {
  const language = data.allFile.edges[0].node.childLayoutJson.layout;

  const { locale, newestVersion } = pageContext;
  const {
    section1,
    section3,
    section4,
    section5,
    section6,
    section7,
  } = language.home;

  let currentResources = [...resources];
  if (locale === 'en') {
    currentResources = resources.filter(
      r => r.name !== 'bilibili' && r.name !== 'zhihu'
    );
  }

  useEffect(() => {
    const urlLang = getRedirectLanguage();
    const set = window.localStorage.getItem('milvus.io.setlanguage');

    if (!set && urlLang !== locale) {
      navigate(`/${urlLang}/`);
    }
  }, [locale]);

  return (
    <Layout language={language} locale={locale}>
      <SEO title="Milvus" />
      <Notification
        version={newestVersion}
        language={language.home.notification}
        locale={locale}
      ></Notification>
      <main className="home-wrapper">
        <section className="section1">
          <div className="githubicon">
            <GithubButton
              type="stargazers"
              size="large"
              namespace="milvus-io"
              repo="milvus"
            />

            {locale === 'cn' && (
              <a
                className="giteeicon"
                href="https://gitee.com/milvus-io/milvus/stargazers"
              >
                <img
                  src="https://gitee.com/milvus-io/milvus/badge/star.svg?theme=dark"
                  alt="star"
                ></img>
              </a>
            )}
          </div>
          <h1>{section1.desc1}</h1>
          <h3 dangerouslySetInnerHTML={{ __html: section1.desc2 }}></h3>
          <div className="btn-wrapper">
            <LocalizedLink
              className="primary white-color"
              to="/docs/install_milvus.md"
              locale={locale}
            >
              {section1.link2}
            </LocalizedLink>
            <LocalizedLink
              className="primary white-color"
              to="/docs/overview.md"
              locale={locale}
            >
              {section1.link}
            </LocalizedLink>
          </div>
        </section>
        <section className="section5">
          <a
            href="https://lfai.foundation"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={LfaiLogo} alt="lfai logo"></img>
          </a>
          <p>{section5.desc}</p>
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
                <p
                  className="content"
                  dangerouslySetInnerHTML={{ __html: v.content }}
                ></p>
              </li>
            ))}
          </ul>
        </section>
        <section className="section4">
          <h2>{section4.title}</h2>
          <p>{section4.desc1}</p>
          <p>{section4.desc2}</p>
          <div className="btn-wrapper">
            <a
              className="primary primary-color with-icon"
              href="https://github.com/milvus-io"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={GithubLogo} alt="github"></img>
              <span>{section4.contribute}</span>
            </a>
            <a
              className="primary with-icon"
              href="https://github.com/milvus-io/bootcamp"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#4eb8f0' }}
            >
              <img src={LearnLogo} alt="learn more"></img>
              <span>{section4.bootcamp}</span>
            </a>
          </div>
        </section>

        <section className="sdk-tools">
          <h2>Tools & SDK</h2>
          <ul>
            <li>
              <a
                href="https://zilliz.com/products/em"
                rel="noreferrer"
                target="_blank"
              >
                <img src={adminIcon} alt="Milvus EM"></img>
              </a>

              <p>Milvus EM</p>
            </li>
            <li>
              {/* <a target="_blank" rel="noopener noreferrer" href="/tools/sizing"> */}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://zilliz.com/sizing-tool"
              >
                <img src={sizingIcon} alt="Milvus Sizing Tools"></img>
              </a>
              <p>Milvus Sizing Tools</p>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/milvus-io/milvus/tree/master/sdk"
              >
                <img src={cIcon} alt="C++ SDK"></img>
              </a>
              <p>C++ SDK</p>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/milvus-io/pymilvus"
              >
                <img src={pythonIcon} alt="Python SDK"></img>
              </a>
              <p>Python SDK</p>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/milvus-io/milvus-sdk-java"
              >
                <img src={javaIcon} alt="Java SDK"></img>
              </a>
              <p>Java SDK</p>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/milvus-io/milvus-sdk-go"
              >
                <img src={goIcon} alt="Golang SDK"></img>
              </a>
              <p>Golang SDK</p>
            </li>
          </ul>
        </section>
        <section className="section6">
          <h2>
            <LocalizedLink to="/users">{section6.title}</LocalizedLink>
          </h2>
          <ul>
            {users.map((v, i) => (
              <li key={i}>
                <img src={v.default} alt="customer"></img>
              </li>
            ))}
          </ul>
        </section>
        <section className="section7">
          <h2>{section7.title}</h2>
          <ul className="column-wrapper">
            {section7.list.map(v => (
              <div key={v.type} className="column">
                <h3>{v.title}</h3>
                {v.desc && <p className="column-desc">{v.desc}</p>}
                {v.type === 'follow' ? (
                  <div className="column-img-wrapper">
                    {currentResources.map((v, i) => (
                      <div key={v.name} className={v.name}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={v.href}
                          className="column-img-container"
                        >
                          <img
                            className="column-img"
                            src={v.src.default}
                            alt="resouce"
                          ></img>
                        </a>
                        {/* <p>{v.name}</p> */}
                        {v.name === 'wechat' && (
                          <div className="wechatqr">
                            <img
                              style={{ maxWidth: 'initial' }}
                              width="150"
                              height="150"
                              src={MilvusUserWechat}
                              alt="二维码"
                            />
                            <img
                              style={{ maxWidth: 'initial' }}
                              width="150"
                              height="150"
                              src={Qcode}
                              alt="二维码"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}

                {v.urlList.map((link, i) => (
                  <a
                    key={i}
                    className="column-link"
                    target={v.type === 'milvus' ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    href={link.url}
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            ))}
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
                search
                bootcamp
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
              home {
                notification {
                  version
                  available
                  more
                  join
                  interact
                }
                section1 {
                  desc1
                  desc2
                  link
                  link2
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
                section7 {
                  title
                  list {
                    title
                    desc
                    type
                    urlList {
                      title
                      url
                    }
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

export default IndexPage;
