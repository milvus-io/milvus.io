import React, { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { getGithubStatis } from "../../http";
import * as styles from "./index.module.less";

const GitHubButton = ({
  type = "star", // star or fork
  href,
  className = "",
  children,
}) => {
  const isStar = type === "star";
  const iconClass = isStar ? faGithub : faCodeBranch;
  const link = isStar ? href : `${href}/fork`;
  const sublink = isStar ? `${href}/stargazers` : `${href}/network/members`;
  const [stat, setStat] = useState({
    star: 0,
    forks: 0,
  });

  useEffect(() => {
    (async function getData() {
      try {
        const { forks_count, stargazers_count } = await getGithubStatis();
        setStat({
          star: stargazers_count,
          forks: forks_count,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className={`${styles.gitBtnWrapper} ${className}`}>
      <a
        href={link}
        className={styles.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon className={styles.iconWrapper} icon={iconClass} />
        <span className={styles.stat}>{children}</span>
      </a>
      <Divider orientation="vertical" variant="middle" flexItem />
      <a
        href={sublink}
        className={`${styles.link} ${styles.num}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.stat}>{isStar ? stat.star : stat.forks}</span>
      </a>
    </div>
  );
};

export default GitHubButton;
