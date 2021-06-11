import React, { useState } from 'react';
import * as styles from './index.module.less';

const FaqCard = ({ question = [] }) => {
  const [title, content, isLink] = question;
  const [showModal, setShowModal] = useState(false);
  const toggleModal = (open) => setShowModal(open);
  return (
    <div key={title} className={styles.faqCard}>
      <span className={styles.title}>{title}</span>
      {isLink ? (
        <a className={styles.answer} href={content} target="_blank" rel="noopener noreferrer">
          See on Github
          <i
            className={`fab fa-github ${styles.btnIcon}`}
          ></i>
        </a>
      ) : (
        <button className={styles.answer} onClick={() => { toggleModal(true) }}>
          See Answers
          <i
            className={`fas fa-eye ${styles.btnIcon}`}
          ></i>
        </button>
      )}
      {showModal && (
        <div className={styles.modalMask}>
          <div className={styles.mondalContainer}>
            <button className={styles.modalClose} onClick={() => { toggleModal(false) }}></button>
            <p className={styles.modalTitle}>{`Q: ${title}`}</p>
            <p className={styles.modalContent}>{content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqCard;
