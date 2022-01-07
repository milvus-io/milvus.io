import React from "react";
import * as styles from "./index.module.less";
import LinkIcon from "../../../images/docs/link.svg";

const LinkCard = ({ label, href, className = "" }) => {
  return (
    <a
      className={`${styles.linkCard} ${className}`}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <span className={styles.label}>{label}</span>
      <img src={LinkIcon} alt="link-icon" className={styles.icon} />
    </a>
  );
};

export default LinkCard;
