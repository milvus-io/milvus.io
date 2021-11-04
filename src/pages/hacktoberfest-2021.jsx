import React from 'react';
import * as styles from './common-layout.module.less';
import Button from '../components/button';
import StepCard from '../components/hackathon/stepCard';
import IssueCard from '../components/hackathon/issueCard';
import { graphql } from 'gatsby';
import Header from '../components/header/v2';
import Footer from '../components/footer/v2';
import Seo from '../components/seo';
import LocalizedLink from '../components/localizedLink/localizedLink';

const DESC = 'hacktoberfest-2021';

const Hackathon = ({ data, pageContext }) => {
  const {
    firstSection,
    secondSection,
    thirdSection,
    forthSection,
    fifthSection,
    sixthSection,
    seventhSection,
    eighthSection,
  } = data.allFile.edges.filter(i => i.node.childI18N)[0].node.childI18N
    .hackathon;
  const { footer } = data.allFile.edges.filter(i => i.node.childI18N)[0].node
    .childI18N.v2;
  const { locale } = pageContext;
  return (
    <>
      <Header locale={locale} showRobot={false} />
      <Seo title="Hacktoberfest-2021" lang={locale} description={DESC} />
      <main className={`${styles.pageContainer} ${styles.hackathonContainer}`}>
        {/* banner section */}
        {firstSection && (
          <section className={styles.firstSection}>
            <div className={styles.innerWrapper}>
              {firstSection.firstBanner && (
                <div
                  className={`${styles.bannerWrapper} ${styles.firstBannerWrapper}`}
                >
                  <div className={styles.leftPart}>
                    <h1>{firstSection.firstBanner.title}</h1>
                    <p
                      className={styles.firstContent}
                      dangerouslySetInnerHTML={{
                        __html: firstSection.firstBanner.content,
                      }}
                    ></p>
                    <Button
                      link={firstSection.firstBanner.btnLink}
                      locale={locale}
                      children={
                        <>
                          <span className={styles.btnLabel}>
                            {firstSection.firstBanner.btnLabel}
                          </span>
                          <i className="fa fa-chevron-down"></i>
                        </>
                      }
                    />
                    <a className={styles.alert} href="#prize">
                      <img
                        src={firstSection.firstBanner.badge.publicURL}
                        alt=""
                      />
                      <p>{firstSection.firstBanner.alert}</p>
                      <i className="far fa-arrow-alt-circle-down"></i>
                    </a>
                  </div>
                  <div className={styles.rightPart}>
                    <img
                      src={firstSection.firstBanner.image.publicURL}
                      alt=""
                    />
                  </div>
                </div>
              )}
              {firstSection.secondBanner && (
                <div
                  className={`${styles.bannerWrapper} ${styles.secondBannerWrapper}`}
                >
                  <div className={styles.leftPart}>
                    <h2>{firstSection.secondBanner.title}</h2>
                    <p className={styles.secondContent}>
                      {firstSection.secondBanner.content}
                    </p>
                  </div>
                  <div className={styles.rightPart}>
                    <img
                      src={firstSection.secondBanner.image.publicURL}
                      alt=""
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* what is mulvus */}
        {secondSection && (
          <section className={styles.secondSection}>
            <div className={styles.innerWrapper}>
              <h2>{secondSection.title}</h2>
              <p>{secondSection.content}</p>
              <Button
                link={secondSection.btnLink}
                locale={locale}
                children={
                  <>
                    <span className={styles.btnLabel}>
                      {secondSection.btnLabel}
                    </span>
                    <i className="fa fa-chevron-right"></i>
                  </>
                }
              />
            </div>
          </section>
        )}

        {/* quick start section */}
        {thirdSection && (
          <section className={styles.thirdSection} id="quick_start">
            <div className={styles.innerWrapper}>
              <h3 className={styles.spliteLine}>
                <span>{thirdSection.title}</span>
                <span className={styles.line}></span>
              </h3>
              <div className={styles.stepContent}>
                {thirdSection.list.map(item => (
                  <StepCard {...item} key={item.title} locale={locale} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How to Contribute section */}
        {forthSection && (
          <section className={styles.forthSection}>
            <div className={styles.innerWrapper}>
              <h2>{forthSection.title}</h2>
              <p dangerouslySetInnerHTML={{ __html: forthSection.content }}></p>
            </div>
          </section>
        )}

        {/* issue list section */}
        {fifthSection && (
          <section className={styles.fifthSection} id="issue_list">
            <div className={styles.innerWrapper}>
              <h3 className={styles.spliteLine}>
                <span>{fifthSection.title}</span>
                <span className={styles.line}></span>
              </h3>
              <div className={styles.issueListWrapper}>
                <div className={styles.listHeader}>
                  {fifthSection.listHeader.map(td => (
                    <p key={td} className={styles.headerItem}>
                      {td}
                    </p>
                  ))}
                </div>
                <ul className={styles.listBody}>
                  {fifthSection.list.map((item, index) => (
                    <li key={item.cate}>
                      <IssueCard
                        icon={item.icon.publicURL}
                        category={item.cate}
                        description={item.desc}
                        issueHref={item.issueHref}
                        guideHref={item.guideHref}
                        locale={locale}
                        className={
                          index === fifthSection.list.length - 1
                            ? styles.lastIssueCard
                            : ''
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Claim your prize section */}
        {sixthSection && (
          <section className={styles.sixthSection} id="prize">
            <div className={styles.innerWrapper}>
              <div className={styles.contentWrapper}>
                <h2>{sixthSection.title}</h2>
                <p>{sixthSection.content}</p>
                <Button
                  link={sixthSection.btnLink}
                  locale={locale}
                  children={
                    <>
                      <span className={styles.btnLabel}>
                        {sixthSection.btnLabel}
                      </span>
                      <i className="fa fa-chevron-right"></i>
                    </>
                  }
                />
                <p className={styles.tip}>
                  <span>{sixthSection.tip}</span>
                  <a
                    href={sixthSection.tipHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {sixthSection.tipLabel}
                  </a>
                </p>
              </div>

              <div className={styles.bigstPrize}>
                <div className={styles.leftPart}>
                  <img src={sixthSection.image.publicURL} alt="" />
                </div>
                <div className={styles.rightPart}>
                  <div className={styles.textWrapper}>
                    <p className={styles.text}>{sixthSection.label1}</p>
                    <p className={styles.text}>{sixthSection.label2}</p>
                  </div>
                </div>
              </div>

              <ul className={styles.prizeList}>
                {sixthSection.list.map(item => (
                  <li className={styles.prizeListItem} key={item.name}>
                    <img src={item.image.publicURL} alt="" />
                    <p className={styles.nameWprapper}>{item.name}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Events and Resources section */}
        {seventhSection && (
          <section className={styles.seventhSection}>
            <div className={styles.innerWrapper}>
              <div className={styles.leftPart}>
                <h3 className={styles.spliteLine}>
                  <span>{seventhSection.title}</span>
                  <span className={styles.line}></span>
                </h3>
                <p className="">{seventhSection.content}</p>
                <Button
                  link={seventhSection.btnLink}
                  locale={locale}
                  children={
                    <>
                      <span className={styles.btnLabel}>
                        {seventhSection.btnLabel}
                      </span>
                      <i className="fa fa-chevron-right"></i>
                    </>
                  }
                />
              </div>
              <div className={styles.rightPart}>
                <img src={seventhSection.image.publicURL} alt="" />
              </div>
            </div>
          </section>
        )}

        {/* contact us section */}
        {eighthSection && (
          <section className={styles.eighthSection}>
            <div className={styles.innerWrapper}>
              <h2>{eighthSection.title}</h2>
              <div className={styles.contactList}>
                {eighthSection.list.map(item => (
                  <LocalizedLink
                    key={item.href}
                    to={item.href}
                    className={styles.contactCard}
                    children={
                      <>
                        <img src={item.icon.publicURL} alt="" />
                        <p>{item.content}</p>
                      </>
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer footer={footer} locale={locale} />
    </>
  );
};

export default Hackathon;

export const Query = graphql`
  query HackathonQuery($locale: String) {
    allFile(filter: { name: { eq: $locale } }) {
      edges {
        node {
          childI18N {
            v2 {
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
            hackathon {
              firstSection {
                firstBanner {
                  title
                  content
                  image {
                    publicURL
                  }
                  alert
                  badge {
                    publicURL
                  }
                  btnLabel
                  btnLink
                }
                secondBanner {
                  title
                  content
                  image {
                    publicURL
                  }
                }
              }
              secondSection {
                title
                content
                btnLabel
                btnLink
              }
              thirdSection {
                title
                list {
                  stepNum
                  title
                  content
                  iconType
                  href
                }
              }
              forthSection {
                title
                content
              }
              fifthSection {
                title
                listHeader
                list {
                  icon {
                    publicURL
                  }
                  cate
                  desc
                  issueHref
                  guideHref
                }
              }
              sixthSection {
                title
                content
                btnLabel
                btnLink
                tip
                tipLabel
                tipHref
                image {
                  publicURL
                }
                label1
                label2
                list {
                  image {
                    publicURL
                  }
                  name
                }
              }
              seventhSection {
                title
                content
                btnLabel
                btnLink
                image {
                  publicURL
                }
              }
              eighthSection {
                title
                list {
                  href
                  icon {
                    publicURL
                  }
                  content
                }
              }
            }
          }
        }
      }
    }
  }
`;
