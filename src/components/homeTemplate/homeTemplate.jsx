import React, { useMemo } from 'react';
import BlogCard from '../card/blogCard/blogCard';
import StartCard from '../card/startCard/startCard';
import Button from '../button';
import * as styles from './homeTemplate.module.less';
import * as dayjs from 'dayjs';

const HomeTemplate = props => {
  const { data, locale, newestBlog = {} } = props;
  const { section1 = {}, section2, section3 = {}, section4 = {} } = data;

  const generateNewsetBlog = (blogObj, locale) => {
    const { title, desc, cover, date, id } = blogObj[locale];
    const dateTime = dayjs(date).format('YYYY/MM/DD');
    return (
      <BlogCard
        data={{
          title,
          abstract: desc,
          imgSrc: `https://${cover}`,
          time: dateTime,
          link: `/blog/${id}`,
          locale: locale,
        }}
      />
    );
  };

  const formatSection3Items = useMemo(() => {
    return (section3.items || []).map(v => ({
      ...v,
      list: v.list.map(item => ({
        ...item,
        link: `${window.location.href}/${item.link}`,
      })),
    }));
  }, [section3]);

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
          {formatSection3Items.map(item => (
            <div key={item.label}>
              <h4>{item.label}</h4>
              <ul>
                {item.list.map(link => (
                  <li key={link.text}>
                    <a href={link.link}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h1>{section4.title}</h1>
        {generateNewsetBlog(newestBlog, locale)}
        {section4.loadBtn && (
          <Button
            className={styles.loadBtn}
            isExternal={section4.loadBtn.isExternal}
            link={section4.loadBtn.link}
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
