import React, { useState } from 'react';
import { sendQuestion } from '../../http/http';
import * as styles from './index.module.less';

const FeedbackModal = ({ setShowModal = () => {}, contact = {} }) => {
  const [formValid, setFormValid] = useState(true);
  const [email, setEmail] = useState();
  const [quest, setQuest] = useState();

  const toggleModal = open => {
    setFormValid(true);
    setEmail();
    setQuest();
    setShowModal(open);
  };

  const emailOnChange = e => {
    const em = e.target.value;
    checkValidation({ email: em, quest });
    setEmail(em);
  };

  const questionOnChange = e => {
    const q = e.target.value;
    checkValidation({ email, quest: q });
    setQuest(q);
  };

  const checkValidation = ({ email = '', quest }) => {
    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      ) ||
      !quest
    ) {
      setFormValid(false);
      return;
    }
    setFormValid(true);
  };

  const onSubmit = () => {
    toggleModal(false);
    sendQuestion({ email, quest });
  };

  return (
    <div className={styles.modalMask}>
      <div className={styles.mondalContainer}>
        <button
          className={styles.modalClose}
          onClick={() => {
            toggleModal(false);
          }}
        >
          {''}
        </button>
        <p className={styles.modalTitle}>{contact.dialog.title}</p>
        <p className={styles.modalContent}>{contact.dialog.desc}</p>
        <form onSubmit={e => e.preventDefault()}>
          <input
            onChange={emailOnChange}
            placeholder={contact.dialog.placeholder1}
            required
          />
          <textarea
            onChange={questionOnChange}
            placeholder={contact.dialog.placeholder2}
            required
            rows={6}
          />
          {!formValid && <span>{contact.dialog.invalid}</span>}
          <button
            type="submit"
            className={styles.submitButton}
            onClick={onSubmit}
            disabled={!formValid || !email}
          >
            {contact.dialog.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
