import React from 'react';
import BlogCard from '../card/blogCard/v2';
import StartCard from '../card/startCard/startCard';
import Button from '../button';
import * as styles from './homeTemplate.module.less';

const HomeTemplate = props => {
  const { data, locale, newestBlog = [], homePath = '' } = props;
  const {
    section1 = {},
    section2,
    section3 = {},
    section4 = {},
    section5,
  } = data;

  const generateNewsetBlog = (bloglist, locale) => {
    return (
      <ul className={styles.blogContent}>
        {bloglist.map(item => {
          const { desc, cover, date, tags, id, title } = item;
          return (
            <li key={item.id}>
              <BlogCard
                locale={locale}
                title={title}
                date={date}
                cover={`https://${cover}`}
                desc={desc}
                tags={tags}
                path={id}
              />
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <section className={styles.docHomeWrapper}>
      <div
        className={`${styles.section} ${styles.section1}`}
        style={{ order: section1.order }}
      >
        <h1>{section1.title}</h1>
        <div className={styles.cardWrapper}>
          {section1.items &&
            section1.items.map(item => (
              <StartCard
                key={item.title}
                data={item}
                wrapperClass={styles.cardItem}
                homePath={homePath}
              />
            ))}
        </div>
      </div>

      <div
        className={`${styles.section} ${styles.section2}`}
        style={{ order: section2.order }}
      >
        <h1>{section2.title}</h1>
        <ul>
          {section2.desc.map(i => (
            <p
              className={styles.desc}
              key={i}
              dangerouslySetInnerHTML={{ __html: i }}
            ></p>
          ))}
        </ul>
      </div>

      <div className={`${styles.section} ${styles.section3}`}>
        <h1>{section3.title}</h1>
        <div className={styles.itemWrapper}>
          {section3.items &&
            section3.items.map(item => (
              <div key={item.label}>
                <h4>{item.label}</h4>
                <ul>
                  {item.list.map(link => (
                    <li key={link.link}>
                      {link.link.charAt(0) === '/' ? (
                        <a href={link.link}>{link.text}</a>
                      ) : (
                        <a href={`${homePath}/${link.link}`}>{link.text}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>

      {section5 && section5.title && (
        <div className={`${styles.section} ${styles.section5}`}>
          <h1>{section5.title}</h1>
          <p className={styles.date}>{section5.date}</p>
          <ul>
            {section5.list.map(i => (
              <li key={i} dangerouslySetInnerHTML={{ __html: i }}></li>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.section}>
        <h1>{section4.title}</h1>
        {generateNewsetBlog(newestBlog, locale)}
        {section4.loadBtn && (
          <Button
            className={styles.loadBtn}
            isExternal={section4.loadBtn.isExternal}
            link="/blog"
            children={
              <>
                <span className={styles.btnLabel}>
                  {section4.loadBtn.label}
                </span>
                <i className="fa fa-chevron-right"></i>
              </>
            }
          />
        )}
      </div>
    </section>
  );
};

export default HomeTemplate;
