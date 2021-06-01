import React from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/seo';
import Header from '../components/header/v2';
import './community.less';
import CommunityHeroCard from '../components/card/communityHeroCard/communityHeroCard';
import Menu from '../components/community/menu/treeMenu';
import { useState } from 'react';
import mailIcon from '../images/community/mail.png';

export default function CommunityTemplate({ data, pageContext }) {
  // i18n
  const {
    footer: { licence: footerTrans },
  } = data.allFile.edges[0].node.childI18N.v2;

  const {
    footer: { content: anchorTitleTrans },
  } = data.allFile.edges[0].node.childI18N.layout;

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
  const desc = 'Milvus Community';

  const {
    heroSection,
    repoSection,
    contributeSection,
    mailingSection,
    contributorSection,
  } = homeData || {};

  const [hash, setHash] = useState(null);

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

  return (
    <section className="community-wrapper">
      <Header isSecondHeader={true} header={{ search: 'Search' }} />
      <SEO title={title} lang={locale} description={desc} />
      <main>
        <Menu
          wrapperClass="menu"
          menuList={menuList}
          locale={locale}
          activePost={activePost}
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
                    <CommunityHeroCard data={item} locale={locale} />
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
                      <img
                        className="mail-img"
                        src={mailIcon}
                        alt="mail icon"
                      />
                      {mail.title}
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
          </>
        )}
      </main>
      <footer>
        {footerTrans.text1.label}
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
            }
          }
        }
      }
    }
  }
`;
