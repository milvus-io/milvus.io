import React from 'react';
import PropTypes from 'prop-types';
// import LocalizeLink from "../localizedLink/localizedLink"
// import { globalHistory } from "@reach/router";
// import GithubIcon from "../../images/icon/github-normal.svg";
import * as styles from './footer.module.less';
import wechat from '../../images/doc-home/wechat.svg';
import zhihu from '../../images/doc-home/zhihu.svg';
import slack from '../../images/doc-home/slack.svg';
import twitter from '../../images/doc-home/twitter.svg';
import medium from '../../images/doc-home/medium.svg';
import github from '../../images/doc-home/github.svg';
import qrcode from '../../images/doc-home/qr.png';

const Footer = ({ locale, style }) => {
  // const l = locale === "cn" ? "en" : "cn";
  // const to = globalHistory.location.pathname
  //   .replace("/en/", "/")
  //   .replace("/cn/", "/");

  return (
    <footer className={styles.footerWrapper} style={style}>
      <div className={styles.iconsWrapper}>
        {locale === 'en' ? (
          <ul className={styles.listWrapper}>
            <li className={styles.listItem}>
              <a
                href="https://github.com/milvus-io"
                target="_blank"
                rel="noreferrer"
              >
                <img src={github} alt="GitHub" />
              </a>
            </li>
            <li className={styles.listItem}>
              <a
                href="https://twitter.com/milvusio"
                target="_blank"
                rel="noreferrer"
              >
                <img src={twitter} alt="Twitter" />
              </a>
            </li>
            <li className={styles.listItem}>
              <a
                href="https://milvusio.slack.com/"
                target="_blank"
                rel="noreferrer"
              >
                <img src={slack} alt="Slack" />
              </a>
            </li>

            <li className={styles.listItem}>
              <a
                href="https://medium.com/@milvusio"
                target="_blank"
                rel="noreferrer"
              >
                <img src={medium} alt="Medium" />
              </a>
            </li>
          </ul>
        ) : (
          <ul className={styles.listWrapper}>
            <li className={styles.listItem}>
              <a
                href="https://github.com/milvus-io"
                target="_blank"
                rel="noreferrer"
              >
                <img src={github} alt="GitHub" />
              </a>
            </li>
            <li className={`${styles.listItem} ${styles.wechatWrapper}`}>
              <img src={wechat} alt="微信" className={styles.wechat} />
              <img
                src={qrcode}
                alt="Zilliz 技术交流微信群"
                className={styles.qrcode}
              />
            </li>
            <li className={styles.listItem}>
              <a
                href="https://www.zhihu.com/column/ai-search"
                target="_blank"
                rel="noreferrer"
              >
                <img src={zhihu} alt="知乎" />
              </a>
            </li>
          </ul>
        )}
      </div>
      <div className={styles.copyRight}>
        <span>
          © 2019 - {new Date().getFullYear()} Milvus. All rights reserved.
        </span>
      </div>
      {/* <LocalizeLink locale={l} to={to}>
        {locale === "cn" ? "English" : "中"}
      </LocalizeLink> */}
    </footer>
  );
};

Footer.propTypes = {
  language: PropTypes.object,
  locale: PropTypes.string.isRequired,
};

export default Footer;
