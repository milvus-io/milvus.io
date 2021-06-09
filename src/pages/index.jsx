import React from 'react';
import { graphql } from 'gatsby';
import V2Layout from '../components/layout/v2Layout';
import Button from '../components/button';
import autoscalingIcon from '../images/v2/autoscaling.svg';
import deploymentIcon from '../images/v2/deployment.svg';
import searchIcon from '../images/v2/searchicon.png';
import storageIcon from '../images/v2/storage.svg';
import supportIcon from '../images/v2/support.svg';
import GithubButton from 'react-github-button';
import './index.less';
import Seo from '../components/seo';

const icons = {
  autoscaling: autoscalingIcon,
  deployment: deploymentIcon,
  search: searchIcon,
  storage: storageIcon,
  supporting: supportIcon,
};

const HomePage = ({ data, pageContext }) => {
  const {
    header,
    banner,
    slogan,
    content: { title, list, community },
    footer,
  } = data.allFile.edges.filter(
    edge => edge.node.childI18N
  )[0].node.childI18N.v2;
  const { locale, versions } = pageContext;

  return (
    <div className="home-page-container">
      <div className="page-content">
        <div className="bg3-container"></div>
        <V2Layout
          header={header}
          footer={footer}
          locale={locale}
          versions={versions}
        >
          <Seo title="Milvus 2.0" />
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
                  type="link"
                  link={banner.startBtn.href}
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
                  type="link"
                  link={banner.contributeBtn.href}
                  children={
                    <>
                      <span className="btn-label">{banner.contributeBtn.label}</span>
                      <i className="fas fa-pencil-alt"></i>
                    </>
                  }
                />
              </div>
            </div>
            <div className="banner-right"></div>
          </div>
          <div className="slogan">
            <p className='text'>{slogan.text}</p>
            <p className="author">{slogan.author}</p>
          </div>
          <div className="content">
            <p className="title-bar">
              <span className="title">{title}</span>
              <span className="line"></span>
            </p>
            <ul className="feature-section">
              {list.map(i => {
                const { img, text, title } = i;
                return (
                  <li className="section-item" key={img}>
                    <div className="icon-wrapper">
                      <img src={icons[img]} alt={img} />
                    </div>
                    <p className="title">{title}</p>
                    <p className="text">{text}</p>
                  </li>
                );
              })}
              <div className="bg-container"></div>
            </ul>
            <div className="community-section">
              <div className="wrapper">
                <div className="text-wrapper">
                  <p className="title">{community.title}</p>
                  <p className="text">{community.text1}</p>
                  <p className="text ">{community.text2}</p>
                </div>

                <Button
                  className="communityBtn"
                  type="link"
                  link={community.gitBtn.href}
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
              slogan {
                text,
                author
              }
              content {
                title
                list {
                  title
                  text
                  img
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
        }
      }
    }
  }
`;

export default HomePage;
