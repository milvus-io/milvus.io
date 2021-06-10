import React, { useEffect, useState } from 'react';
import FaqCard from '../card/faqCard'
import './index.less';
import * as styles from '../card/faqCard/index.module.less';
import { getFaq } from '../../http/http';

const RelatedQuestion = props => {
  const {
    layout,
    relatedKey
  } = props;

  const [relatedQuestions, setRelatedQuestions] = useState();
  const [showModal, setShowModal] = useState(false);
  const [formValid, setFormValid] = useState(true);
  const [email, setEmail] = useState();
  const [quest, setQuest] = useState();
  const toggleModal = (open) => {
    setFormValid(true);
    setEmail();
    setQuest();
    setShowModal(open);
  };

  const { footer: { faq = {} } } = layout;
  const { question = {}, contact = {} } = faq;

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

  const checkValidation = ({ email = "", quest }) => {
    if (!email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) || !quest) {
      setFormValid(false);
      return
    }
    setFormValid(true);
  }

  const onSubmit = () => {

  }

  useEffect(() => {
    if (relatedKey) {
      getFaq({
        params: {
          question: relatedKey,
          version: 1
        }
      }).then(res => {
        if (res?.data?.response) {
          setRelatedQuestions(res.data.response.slice(0, 6));
        }
        console.log("res", res);
        console.log("relatedKey", relatedKey);
      }).catch(err => {
        console.log("err", err);
        setRelatedQuestions();
      })
    } else {
      setRelatedQuestions();
    }
  }, [relatedKey])

  return (
    <>
      {relatedQuestions &&
        <>
          <div className="faq">
            <h2>{question.title}</h2>
            <div className="faq-card-container">
              {relatedQuestions.map(question => <FaqCard question={question} key={question[0]} />)}
            </div>
          </div>
          <div className="faq-links">
            <h2>{contact.title}</h2>
            <div className="faq-links-container">
              <button onClick={() => { toggleModal(true) }}>{contact.follow.label}</button>
              <a href={contact.slack.link} target="_blank" rel="noopener noreferrer">
                {contact.slack.label}
                <i
                  className="fab fa-slack-hash"
                ></i>
              </a>
              <a href={contact.github.link} target="_blank" rel="noopener noreferrer">
                {contact.github.label}
                <i
                  className="fab fa-github"
                ></i>
              </a>
            </div>
            {showModal && (
              <div className={styles.modalMask}>
                <div className={styles.mondalContainer}>
                  <button className={styles.modalClose} onClick={() => { toggleModal(false) }}></button>
                  <p className={styles.modalTitle}>{contact.dialog.title}</p>
                  <p className={styles.modalContent}>{contact.dialog.desc}</p>
                  <form>
                    <input onChange={emailOnChange} placeholder={contact.dialog.placeholder1} required />
                    <textarea onChange={questionOnChange} placeholder={contact.dialog.placeholder2} required rows={6} />
                    {!formValid && (<span>{contact.dialog.invalid}</span>)}
                    <button onClick={() => { toggleModal(false) }} disabled={!formValid || !email}>{contact.dialog.submit}</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </>
      }
    </>
  );
};

export default RelatedQuestion;
