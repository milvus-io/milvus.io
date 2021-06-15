import React, { useMemo } from 'react';
import Button from '../../button';
import qrcode from '../../../images/qrcode.jpeg';
import milvusUserWechat from '../../../images/milvus-user-wechat.png';
import medium from '../../../images/website/community/medium.svg';
import slack from '../../../images/website/community/slack.svg';
import twitter from '../../../images/website/community/twitter.svg';
import wechat from '../../../images/website/community/wechat.svg';

import * as styles from './index.module.less';

const iconSet = {
  medium,
  slack,
  twitter,
  wechat,
};

const V2Footer = ({ footer }) => {
  const {
    list: links,
    licence: {
      // list,
      text1,
      text2,
      text3,
    },
  } = footer;

  return (
    <section className={styles.footerContainer}>
      <ul className={styles.list}>
        {links.map(i => {
          const { title, text, href, label, icons, isExternal } = i;
          return (
            <li className={styles.item} key={title}>
              <p className={styles.title}>{title}</p>
              <p className={styles.content}>{text}</p>
              {href ? (
                <Button
                  link={href}
                  isExternal={isExternal}
                  variant="text"
                  className={styles.btn}
                  children={
                    <>
                      <span>{label}</span>
                      <i className="fa fa-chevron-right"></i>
                    </>
                  }
                />
              ) : (
                <ImageList images={icons} />
              )}
            </li>
          );
        })}
      </ul>
      <div className={styles.licence}>
        <div className={styles.milvus}>
          <span className={styles.text}>{text1.label}</span>
          <p className={styles.textLinkWrapper}>
            <a href={text2.link} className={styles.link}>
              {text2.label}
            </a>
            ,<span className={styles.text}>{text3.label}</span>
          </p>
        </div>
        {/* <div className="licence-policy">
          {
            list.map(i => (
              <a href={i.link} target="_blank" rel="noopener noreferrer" key={i.label}>{i.label}</a>
            ))
          }
        </div> */}
      </div>
    </section>
  );
};

const ImageList = ({ images }) => {
  const handleClick = (e, label) => {
    if (label === 'wechat') {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  };

  return useMemo(() => {
    return (
      <div className={styles.imagesWrapper}>
        {images.map(img => (
          <a
            href={img.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.columnImg} ${img.name === 'wechat' ? styles.hoverBtn : ''
              }`}
            key={img.name}
            onClick={e => handleClick(e, img.name)}
          >
            <img src={iconSet[img.name]} alt={img.name} />
            {img.name === 'wechat' && (
              <p className={styles.qrcodeWrapper}>
                <img src={qrcode} alt="qrcode" />
                <img src={milvusUserWechat} alt="qrcode" />
              </p>
            )}
          </a>
        ))}
      </div>
    );
  }, [images]);
};

export default V2Footer;
