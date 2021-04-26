import React from 'react';
import { graphql } from 'gatsby';
import Footer from '../../components/footer/v2';
import V2Button from '../../components/V2Button';
import autoscalingIcon from '../../images/v2/autoscaling.svg';
import deploymentIcon from '../../images/v2/deployment.svg';
import searchIcon from '../../images/v2/search.svg';
import storageIcon from '../../images/v2/storage.svg';
import supportIcon from '../../images/v2/support.svg';
import GithubButton from 'react-github-button';
import './index.scss';
import { Spline } from 'react-spline';
import { MILVUS_INDEX_SCENE } from '../../../static/anime/spline/scene';
import AnimatedSvg from '../../components/animatedSvg/animatedSvg';
import HomeAnimation from '../../../static/anime/common/home';
import pencilBlue from '../../images/v2/pencil-blue.svg'

const icons = {
  autoscaling: autoscalingIcon,
  deployment: deploymentIcon,
  search: searchIcon,
  storage: storageIcon,
  supporting: supportIcon,
};

const HomePage = ({ data, pageContext }) => {
  const {
    banner,
    content: { title, list, slogan },
    footer,
  } = data.allFile.edges[0].node.childLayoutJson.v2;

  return (
    <div className="home-page-container">
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
          <p className="title">{banner.title.toUpperCase()}</p>
          <div className='banner-btn-wrapper'>
            <V2Button
              className='banner-btn1'
              type="link"
              link={banner.startBtn.href}
              children={
                <>
                  <span>{banner.startBtn.label}</span>
                  <i className="fa fa-chevron-right"></i>
                </>
              }
            />
            <V2Button
              className='banner-btn2'
              variant='outline'
              type="link"
              link={banner.contributeBtn.href}
              children={
                <>
                  <span>{banner.contributeBtn.label}</span>
                  <img src={pencilBlue} alt="pencil-icon" />
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
          {/* To see more props: https://github.com/utkarshdubey/react-spline */}
          <Spline scene={MILVUS_INDEX_SCENE} className="spline-wrapper" />
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

            <V2Button
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
      <Footer footer={footer} />
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
              banner {
                title
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
