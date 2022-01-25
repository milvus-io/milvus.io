import React from "react";
import { Link } from "gatsby-plugin-react-i18next";
import * as styles from "./BlogCard.module.less";
import Tags from "../tags";
const BlogCard = ({ title, desc, tags, cover, locale, path, className }) => {
  const to = `/blog/${path}`;

  return (
    <Link to={to} className={`${styles.BlogCardWrapper} ${className}`}>
      <div
        className={styles.coverWrapper}
        style={{ backgroundImage: `url(${cover})` }}
      ></div>
      <div className={styles.descWrapper}>
        <div className={styles.bottomWrapper}>
          <Tags list={tags} tagsClass={styles.tags} />
        </div>
        <h6 className={styles.title}>{title}</h6>
        <p className={styles.desc}>{desc}</p>
      </div>
    </Link>
  );
};

export default BlogCard;
