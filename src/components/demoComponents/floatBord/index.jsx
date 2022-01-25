import React from "react";
import * as styles from "./index.module.less";
import github from "../../../images/demos/github.svg";
import Button from "../button";
import { Forum } from "../item/searchIcon";

const FloatBord = ({ className = "" }) => {
  return (
    <div className={`${styles.floatBordContainer} ${className}`}>
      <div className={styles.linkItem}>
        <p className={styles.desc}>Dive into the source code.</p>
        <Button
          link="https://bit.ly/3Ct2dKo"
          variant="outline"
          className={`${styles.linkBtn} ${styles.whiteBtn}`}
          target="_blank"
          children={
            <div className={styles.content}>
              <img src={github} alt="github" />
              <span>Github</span>
              <i className="fas fa-chevron-right"></i>
            </div>
          }
        />
      </div>

      <div className={styles.linkItem}>
        <p className={styles.desc}>Primary technical support channel.</p>
        <Button
          link="https://bit.ly/3H7KOuu"
          className={styles.linkBtn}
          target="_blank"
          variant="contained"
          children={
            <div className={styles.content}>
              <Forum />
              <span>Forum</span>
              <i className="fas fa-chevron-right"></i>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default FloatBord;
