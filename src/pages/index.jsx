import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import V2Layout from '../components/layout/v2Layout';
import Button from '../components/button';
import GithubButton from 'react-github-button';
import 'react-github-button/assets/style.css';
import './index.less';
import Seo from '../components/seo';
import autoscalingIcon from '../images/v2/autoscaling.svg';
import deploymentIcon from '../images/v2/deployment.svg';
import searchIcon from '../images/v2/searchicon.svg';
import storageIcon from '../images/v2/storage.svg';
import supportIcon from '../images/v2/support.svg';
import bgImg3 from '../images/v2/bgImg3.png';

import line from '../images/v2/line.png';
import compass from '../images/v2/compass.png';
import kuaishou from '../images/v2/kuaishou.png';
import museum from '../images/v2/museum.png';
import aiqiyi from '../images/v2/aiqiyi.png';
import axa from '../images/v2/axa.png';
import dailyhunt from '../images/v2/dailyhunt.png';
import messagebird from '../images/v2/messagebird.png';
import moj from '../images/v2/moj.png';
import smartnew from '../images/v2/smartnew.png';
import trend from '../images/v2/trend.png';
import xiaomi from '../images/v2/xiaomi.png';

const icons = {
  autoscaling: autoscalingIcon,
  deployment: deploymentIcon,
  search: searchIcon,
  storage: storageIcon,
  supporting: supportIcon,
  bgImg3,
  line,
  compass,
  kuaishou,
  museum,
  aiqiyi,
  axa,
  dailyhunt,
  messagebird,
  moj,
  smartnew,
  trend,
  xiaomi,
};

const HomePage = ({ data, pageContext }) => {
  const {
    header,
    banner,
    content: { feature, community },
    footer,
  } = data.allFile.edges.filter(edge => edge.node.childI18N)[0].node.childI18N
    .v2;

  const { slogan, user } = data.allFile.edges.filter(
    edge => edge.node.childUsers
  )[0].node.childUsers;
  const len = slogan.length - 1;
  const { locale, versions } = pageContext;
  const desc =
    'Milvus is an open source vector database for embeddings, it is powered by Faiss, NMSLIB and Annoy, it is easy-to-use, highly reliable, scalable, robust, and blazing fast.';

  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timer = null;
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      setIndex(v => (v < len ? (v += 1) : 0));
    }, 15000);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [len]);

  return (
    <div className="home-page-container">
      <div className="page-content">
        <V2Layout
          header={header}
          footer={footer}
          locale={locale}
          versions={versions}
        >
          <Seo title="Milvus" lang={locale} description={desc} />
          <div className="banner">
            <div className="banner-left">
              <div className="stars-layout">
                <GithubButton
                  className="git-stars"
                  type="stargazers"
                  size="large"
                  namespace="milvus-io"
                  repo="milvus"
                />
              </div>
              <p className="sub-title">{banner.subTitle}</p>
              <div className="title-wrapper">
                {banner.title.map(item => (
                  <p className="title" key={item}>
                    {item.toUpperCase()}
                  </p>
                ))}
              </div>
              <p className="text">{banner.text}</p>
              <div className="banner-btn-wrapper">
                <Button
                  className="banner-btn1"
                  link={banner.startBtn.href}
                  locale={locale}
                  children={
                    <>
                      <span className="btn-label">{banner.startBtn.label}</span>
                      <i className="fa fa-chevron-right"></i>
                    </>
                  }
                />
                <Button
                  className="banner-btn2"
                  variant="outline"
                  link={banner.contributeBtn.href}
                  locale={locale}
                  children={
                    <>
                      <span className="btn-label">
                        {banner.contributeBtn.label}
                      </span>
                      <i className="fas fa-pencil-alt"></i>
                    </>
                  }
                />
              </div>
            </div>
            <div className="banner-right"></div>
          </div>
          <div className="slogan-wrapper">
            <p className="text">{slogan[index].text}</p>
            <p className="author">{slogan[index].author}</p>
          </div>
          <div className="content">
            <h3 className="title-bar">
              <span className="title">{feature.title}</span>
              <span className="line"></span>
            </h3>
            <ul className="feature-section">
              {feature.list.map(i => {
                const { img, text, title } = i;
                return (
                  <li className="section-item" key={img}>
                    <div className="icon-wrapper">
                      <img src={icons[img]} alt={img} />
                    </div>
                    <p className="title">{title}</p>
                    <p
                      className="text"
                      dangerouslySetInnerHTML={{ __html: text }}
                    ></p>
                  </li>
                );
              })}
              <li className="section-item">
                <img className="img" src={icons.bgImg3} alt="icon" />
              </li>
            </ul>
            {!!user.list.length ? (
              <div className="user-section">
                <h3 className="title-bar">
                  <span className="title">{user.title}</span>
                  <span className="line"></span>
                </h3>
                <ul className="users-list">
                  {user.list.map(item => {
                    const { name, alt } = item;
                    return (
                      <li key={name} className="list-item">
                        <img src={icons[name]} alt={alt} />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
            <div className="community-section">
              <div className="wrapper">
                <div className="text-wrapper">
                  <p className="title">{community.title}</p>
                  <p className="text">{community.text1}</p>
                  <p className="text ">{community.text2}</p>
                </div>

                <Button
                  className="communityBtn"
                  link={community.gitBtn.href}
                  locale={locale}
                  children={
                    <>
                      <span>{community.gitBtn.label}</span>
                      <i className="fa fa-chevron-right"></i>
                    </>
                  }
                />
              </div>
            </div>
          </div>
        </V2Layout>
      </div>
    </div>
  );
};

export const Query = graphql`
  query V2HomeQuery($locale: String) {
    allFile(filter: { name: { eq: $locale } }) {
      edges {
        node {
          childI18N {
            v2 {
              banner {
                title
                subTitle
                text
                startBtn {
                  href
                  label
                }
                contributeBtn {
                  href
                  label
                }
              }
              content {
                feature {
                  title
                  list {
                    title
                    text
                    img
                  }
                }
                community {
                  title
                  text1
                  text2
                  gitBtn {
                    href
                    label
                  }
                }
              }
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
          childUsers {
            user {
              title
              list {
                alt
                name
              }
            }
            slogan {
              author
              text
            }
          }
        }
      }
    }
  }
`;

export default HomePage;
