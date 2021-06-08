import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/seo';
import Header from '../components/header/v2';
import './community.less';
import CommunityHeroCard from '../components/card/communityHeroCard/communityHeroCard';
import Sidebar from '../components/sidebar/sidebar';
import mailIcon from '../images/community/mail.png';
import { useCodeCopy, useFilter } from '../hooks/doc-dom-operation';

export default function CommunityTemplate({ data, pageContext }) {
  console.log(pageContext);
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
    heroSection,
    repoSection,
    contributeSection,
    mailingSection,
    contributorSection,
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
      <Header isSecondHeader={true} locale={locale} />
      <SEO title={title} lang={locale} description={desc} />
      <main>
        <Sidebar
          locale={locale}
          showSearch={true}
          wrapperClass="sidebar"
          menuConfig={menuConfig}
          searchConfig={{ placeholder: 'search' }}
        />
        {isHomePage ? (
          <section className="content home">
            {/* h1 for SEO, not show on page */}
            <h1 className="home-h1">Milvus Community</h1>
            <section className="section hero">
              <h2>{heroSection.title}</h2>
              <ul>
                {heroSection.list.map(item => (
                  <li className="card" key={item.title}>
                    <CommunityHeroCard
                      data={item}
                      githubLabel={github}
                      slackLabel={slack}
                    />
                  </li>
                ))}
              </ul>
            </section>
            <section className="section repo">
              <h2>{repoSection.title}</h2>
              <ul className="row-3">
                {repoSection.list.map(repo => (
                  <li className="card" key={repo.title}>
                    <a href={repo.link} target="_blank" rel="noreferrer">
                      <h3>{repo.title}</h3>
                      <p>{repo.desc}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="section contribute">
              <h2>{contributeSection.title}</h2>
              <p>{contributeSection.desc}</p>
            </section>

            <section className="section mail">
              <h2>{mailingSection.title}</h2>
              <ul className="row-3">
                {mailingSection.list.map(mail => (
                  <li className="card" key={mail.title}>
                    <a href={mail.link} target="_blank" rel="noreferrer">
                      <img src={mailIcon} alt="mail icon" />
                      <p>{mail.title}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="section contributor">
              <h2>{contributorSection.title}</h2>
              <ul>
                {contributorSection.list.map(item => (
                  <li key={item.login}>
                    <a href={item.link} target="_blank" rel="noreferrer">
                      <img src={item.avatar.publicURL} alt="contributor" />
                    </a>
                  </li>
                ))}
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
