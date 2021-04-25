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

const icons = {
  autoscaling: autoscalingIcon,
  deployment: deploymentIcon,
  search: searchIcon,
  storage: storageIcon,
  supporting: supportIcon
}


const HomePage = ({ data, pageContext }) => {
  const { banner, content: { title, list, slogan }, footer } = data.allFile.edges[0].node.childLayoutJson.v2;

  return (
    <div className='home-page-container'>
      <div className="banner">
        <div className="banner-left">
          <div className="stars-layout">
            <GithubButton
              className='git-stars'
              type="stargazers"
              size="large"
              namespace="milvus-io"
              repo="milvus"
            />
          </div>
          <p className='title'>{banner.title.toUpperCase()}</p>
          <V2Button type="link" link={banner.startBtn.href} label={banner.startBtn.label} />
        </div>
        <div className="banner-right">

        </div>
      </div>
      <div className="content">
        <p className="title-bar">
          <span className="title">{title}</span>
          <span className="line"></span>
        </p>
        <ul className="feature-section">
          {
            list.map(i => {
              const { img, text, title } = i;
              return (
                <li className='section-item' key={img}>
                  <div className="icon-wrapper">
                    <img src={icons[img]} alt={img} />
                  </div>
                  <p className="title">{title}</p>
                  <p className="text">{text}</p>
                </li>
              )
            })
          }
        </ul>
        <div className="slogan-section">
          <p className="title">{slogan.title}</p>
          <p className="text">{slogan.text1}</p>
          <p className="text">{slogan.text2}</p>
          <V2Button type="link" link={slogan.gitBtn.href} label={slogan.gitBtn.label} />
        </div>
      </div>
      <Footer footer={footer} />
    </div>
  )
}

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

export default HomePage