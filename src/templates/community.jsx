import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import Seo from '../components/seo';
import Header from '../components/header/v2';
import './community.less';
import Sidebar from '../components/sidebar/sidebar';
import mailIcon from '../images/community/mail.png';
import { useCodeCopy, useFilter } from '../hooks/doc-dom-operation';
import banner from '../images/community/banner.png';
import ambassador from '../images/community/ambassador.png';
import build from '../images/community/build.svg';
import event from '../images/community/event.svg';
import github from '../images/community/github-2.png';
import grow from '../images/community/grow.svg';
import learn from '../images/community/learn.svg';
import share from '../images/community/share.svg';
import slack from '../images/community/slack-2.png';
import twitter from '../images/community/twitter.png';
import video from '../images/community/video.svg';
import zoom from '../images/community/zoom.png';
import kubesphere from '../images/community/kubesphere.png';
import juice from '../images/community/juice.png';
import pulsar from '../images/community/pulsar.png';
import haystack from '../images/community/haystack.png';
import paddle from '../images/community/paddle.png';
import onnx from '../images/community/onnx.png';
import CommunityCard from '../components/card/communityCard';
import Button from '../components/button';

const iconMap = {
  build,
  event,
  github,
  grow,
  learn,
  share,
  slack,
  twitter,
  video,
  zoom,
  kubesphere,
  juice,
  pulsar,
  haystack,
  paddle,
  onnx
};

export default function CommunityTemplate({ data, pageContext }) {
  // i18n
  const {
    footer: { licence: footerTrans },
  } = data.allFile.edges.filter(
    edge => edge.node.childI18N
  )[0].node.childI18N.v2;

  const {
    footer: { content: anchorTitleTrans },
    community: { slack, github },
  } = data.allFile.edges.filter(
    edge => edge.node.childI18N
  )[0].node.childI18N.layout;
  console.log(pageContext);
  const {
    locale,
    html,
    menuList,
    homeData,
    activePost,
    headings,
  } = pageContext;
  const isHomePage = homeData !== null;

  const title = 'Milvus Community';
  const desc = 'Join Milvus Community';

  const {
    aboutSection,
    joinSection,
    partnerSection,
    recommendSection,
    resourceSection,
    mailingSection
  } = homeData || {};

  // add hooks used by doc template
  useFilter();
  useCodeCopy(locale);

  const [hash, setHash] = useState(null);
  const [showToTopButton, setShowToTopButton] = useState(false);

  useEffect(() => {
    let currentPos = 0;

    const cb = function () {
      const container = document.querySelector('html');
      const direction = container.scrollTop - currentPos > 0 ? 'down' : 'up';
      currentPos = container.scrollTop;
      const showButton = direction === 'up' && currentPos;

      setShowToTopButton(showButton);
    };
    window.addEventListener('scroll', cb);

    return () => {
      window.removeEventListener('scroll', cb);
    };
  }, []);

  const formatHeadings =
    headings &&
    headings.reduce((pre, cur) => {
      const copyCur = JSON.parse(JSON.stringify(cur));
      const preHead = pre[pre.length - 1];
      if (preHead && preHead.depth < cur.depth) {
        pre[pre.length - 1].children.push(cur);
      } else {
        copyCur.children = [];
        pre = [...pre, copyCur];
      }
      return pre;
    }, []);

  const generateAnchorMenu = (headings, className) => {
    return headings.map(v => {
      const normalVal = v.value.replace(/[.｜,｜/｜'｜?｜？｜、|，]/g, '');
      const anchor = normalVal.split(' ').join('-');
      let childDom = null;
      if (v.children && v.children.length) {
        childDom = generateAnchorMenu(v.children, 'child-item');
      }
      return (
        <div className={`item ${className}`} key={v.value}>
          <a
            href={`#${anchor}`}
            title={v.value}
            className={`anchor ${anchor === hash ? 'active' : ''}`}
            onClick={() => setHash(anchor)}
          >
            {v.value}
          </a>
          {childDom}
        </div>
      );
    });
  };

  const onToTopClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const menuConfig = {
    menuList,
    activePost,
    pageType: 'community',
  };

  return (
    <section className="community-wrapper">
      <Header locale={locale} />
      <Seo title={title} lang={locale} description={desc} />
      <main>
        <Sidebar
          locale={locale}
          showSearch={false}
          wrapperClass="sidebar"
          menuConfig={menuConfig}
          searchConfig={{ placeholder: 'search' }}
        />
        {isHomePage ? (
          <section className="content home">
            {/* banner */}
            <section className="banner-section">
              <img src={banner} alt="milvus community" />
            </section>
            {/* about */}
            <section className="about-section">
              <h2>{aboutSection.title}</h2>
              <p className="about-content">{aboutSection.content}</p>
              <ul className="about-list">
                {
                  aboutSection.list.map(item => {
                    console.log(item.iconType);
                    return (
                      <li>
                        <CommunityCard
                          icon={iconMap[item.iconType]}
                          {...item}
                        />
                      </li>
                    );
                  })
                }
              </ul>
            </section>
            {/* recommend */}
            <section className="recommend-section">
              <h2>{recommendSection.title}</h2>
              <div className="list-wrapper">
                <div>
                  <h3>{recommendSection.start.title}</h3>
                  <ul className="recommend-list">
                    {
                      recommendSection.start.list.map(item => (
                        <li>
                          <a href={item.link}>{item.label}</a>
                        </li>
                      ))
                    }
                  </ul>
                </div>
                <div>
                  <h3>{recommendSection.deploy.title}</h3>
                  <ul className="recommend-list">
                    {
                      recommendSection.deploy.list.map(item => (
                        <li>
                          <a href={item.link}>{item.label}</a>
                        </li>
                      ))
                    }
                  </ul>
                </div>
                <div>
                  <h3>{recommendSection.develop.title}</h3>
                  <ul className="recommend-list">
                    {
                      recommendSection.develop.list.map(item => (
                        <li>
                          <a href={item.link}>{item.label}</a>
                        </li>
                      ))
                    }
                  </ul>
                </div>
                <div>
                  <h3>{recommendSection.test.title}</h3>
                  <ul className="recommend-list">
                    {
                      recommendSection.test.list.map(item => (
                        <li>
                          <a href={item.link}>{item.label}</a>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>

              <div className="ambassador-wrapper">
                <img className="ambassadorImg" src={ambassador} alt="Milvus Ambassador" />
                <h1 className="ambassador-title">{recommendSection.ambassador.title}</h1>
                <p className="ambassador-content">{recommendSection.ambassador.desc}</p>
                <Button
                  className="ambassador-btn join-button"
                  link={recommendSection.ambassador.joinBtn.link}
                >
                  {recommendSection.ambassador.joinBtn.label}
                </Button>
                <Button
                  className="ambassador-btn introduction-button"
                  link={recommendSection.ambassador.introBtn.label}
                  variant="text"
                  children={
                    <>
                      <span className="label">{recommendSection.ambassador.introBtn.label}</span>
                      <i class="fas fa-arrow-right"></i>
                    </>
                  } />
              </div>
            </section>
            {/* maile */}
            <section className="maile-section">
              <h2>{mailingSection.title}</h2>
              <ul className="maile-list">
                {mailingSection.list.map(mail => (
                  <li className="card" key={mail.title}>
                    <a className="maile-wrapper" href={mail.link} target="_blank" rel="noreferrer">
                      <img src={mailIcon} alt="mail icon" />
                      <p>{mail.title}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
            {/* join the community */}
            <section className="community-section">
              <h2>{joinSection.title}</h2>
              <ul className="community-list">
                {
                  joinSection.list.map(item => {
                    const { iconType, label, link } = item;
                    return (
                      <li >
                        <img src={iconMap[iconType]} alt={iconType} />
                        <a href={link} >{label}</a>
                      </li>
                    );

                  })
                }
              </ul>
            </section>
            {/* resources */}
            <section className="resource-section">
              <h2>{resourceSection.title}</h2>
              <ul className="resource-list">
                {
                  resourceSection.list.map(item => (
                    <li>
                      <CommunityCard icon={iconMap[item.iconType]} {...item} />
                    </li>
                  ))
                }
              </ul>
            </section>
            {/* community patner */}
            <section className="patner-section">
              <h2>{partnerSection.title}</h2>
              <ul className="patner-list">
                {
                  partnerSection.list.map(item => (
                    <li>
                      <img src={iconMap[item.name]} alt={item.alt} />
                    </li>
                  ))
                }
              </ul>
            </section>
          </section>
        ) : (
          <>
            <section className="content articles doc-post">
              {html && (
                <section
                  className="doc-post-container articles-container"
                  dangerouslySetInnerHTML={{ __html: html }}
                ></section>
              )}
            </section>
            {formatHeadings.length > 0 && (
              <div className="anchors-wrapper">
                <div className="anchors">
                  <h4 className="anchor-title">{anchorTitleTrans}</h4>
                  {generateAnchorMenu(formatHeadings, 'parent-item')}
                </div>
              </div>
            )}
            {showToTopButton ? (
              <div
                className="btn-to-top"
                role="button"
                onClick={onToTopClick}
                onKeyDown={onToTopClick}
                tabIndex={0}
              >
                <svg
                  width="32"
                  height="32"
                  focusable="false"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  className="svg-inline--fa fa-arrow-to-top fa-w-12 fa-2x"
                >
                  <path
                    fill="currentColor"
                    d="M24 32h336c13.3 0 24 10.7 24 24v24c0 13.3-10.7 24-24 24H24C10.7 104 0 93.3 0 80V56c0-13.3 10.7-24 24-24zm66.4 280.5l65.6-65.6V456c0 13.3 10.7 24 24 24h24c13.3 0 24-10.7 24-24V246.9l65.6 65.6c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L209 126.1c-9.4-9.4-24.6-9.4-33.9 0L39.5 261.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0z"
                  ></path>
                </svg>
              </div>
            ) : null}
          </>
        )}
      </main>
      <footer>
        <span>{footerTrans.text1.label}</span>
        <a className="link" href={footerTrans.text2.link}>
          {footerTrans.text2.label}
        </a>
        {`, ${footerTrans.text3.label}`}
      </footer>
    </section>
  );
}

export const Query = graphql`
  query communityQuery($locale: String) {
    allFile(filter: { name: { eq: $locale } }) {
      edges {
        node {
          childI18N {
            v2 {
              footer {
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
            layout {
              footer {
                content
              }
              community {
                slack
                github
              }
            }
          }
        }
      }
    }
  }
`;
