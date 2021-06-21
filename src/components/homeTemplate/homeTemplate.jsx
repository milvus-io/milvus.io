import React from 'react';
import BlogCard from '../card/blogCard/blogCard';
import StartCard from '../card/startCard/startCard';
import Button from '../button';
import * as styles from './homeTemplate.module.less';

const HomeTemplate = props => {
  const { data } = props;
  const { section1 = {}, section2, section3 = {}, section4 = {} } = data;
  console.log(section1, section2);

  return (
    <section className={styles.docHomeWrapper}>
      <div className={`${styles.section} ${styles.section1}`} style={{ order: section1.order }}>
        <h1>{section1.title}</h1>
        <div className={styles.cardWrapper}>
          {section1.items && section1.items.map(item => (
            <StartCard
              key={item.title}
              data={item}
              wrapperClass={styles.cardItem}
            />
          ))}
        </div>
      </div>

      <div className={`${styles.section} ${styles.section2}`} style={{ order: section2.order }}>
        <h1>{section2.title}</h1>
        <ul>
          {
            section2.desc.map(i => (<p className={styles.desc} key={i}>{i}</p>))
          }
        </ul>
      </div>

      <div className={`${styles.section} ${styles.section3}`}>
        <h1>{section3.title}</h1>
        <div className={styles.itemWrapper}>
          {section3.items && section3.items.map(item => (
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
        <div>
          {section4.items && section4.items.map(item => (
            <BlogCard key={item.title} data={item} />
          ))}
        </div>
        {
          section4.loadBtn && (<Button
            className={styles.loadBtn}
            isExternal={section4.loadBtn.isExternal}
            link={section4.loadBtn.link}
            children={
              <>
                <span className={styles.btnLabel}>{section4.loadBtn.label}</span>
                <i className="fa fa-chevron-right"></i>
              </>
            }
          />)
        }
      </div>
    </section>
  );
};

export default HomeTemplate;
