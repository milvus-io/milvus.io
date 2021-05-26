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
import AnimatedSvg from '../components/animatedSvg/animatedSvg';
import { HOME_ANIMATION as HomeAnimation } from '../../static/anime/common/home';
import SEO from '../components/seo';

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
    content: { title, list, slogan },
    footer,
  } = data.allFile.edges[0].node.childLayoutJson.v2;
  const { locale, versions } = pageContext;

  return (
    <div className="home-page-container">
      <div className="content">
        <div className="bg3-container"></div>
        <V2Layout
          header={header}
          footer={footer}
          locale={locale}
          versions={versions}
        >
          <SEO title="Milvus 2.0" />
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
                      <span>{banner.startBtn.label}</span>
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
                      <span>{banner.contributeBtn.label}</span>
                      <i className="fas fa-pencil-alt"></i>
                    </>
                  }
                />
              </div>
            </div>
            <div className="banner-right">
              <AnimatedSvg data={HomeAnimation} className="banner-right-anime" />
            </div>

            <div className="banner-bg-container"></div>
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
            <div className="slogan-section">
              <div className="wrapper">
                <div className="text-wrapper">
                  <p className="title">{slogan.title}</p>
                  <p className="text">{slogan.text1}</p>
                  <p className="text ">{slogan.text2}</p>
                </div>

                <Button
                  className="sloganBtn"
                  type="link"
                  link={slogan.gitBtn.href}
                  children={
                    <>
                      <span>{slogan.gitBtn.label}</span>
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
          childLayoutJson {
            v2 {
              header {
                navlist {
                  label
                  href
                }
              }
              banner {
                title
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
                title
                list {
                  title
                  text
                  img
                }
                slogan {
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
