import React, { useEffect, useState } from 'react';
import FaqCard from '../card/faqCard';
import FeedbackModal from '../feedbackModal';
import './index.less';
import { getFaq } from '../../http/http';

const RelatedQuestion = props => {
  const { layout, relatedKey } = props;

  const [relatedQuestions, setRelatedQuestions] = useState();
  const [showModal, setShowModal] = useState(false);

  const {
    footer: { faq = {} },
  } = layout;
  const { question = {}, contact = {} } = faq;

  useEffect(() => {
    if (relatedKey) {
      getFaq({
        params: {
          question: relatedKey,
          version: 1,
        },
      })
        .then(res => {
          if (res?.data?.response) {
            setRelatedQuestions(res.data.response.slice(0, 6));
          }
        })
        .catch(err => {
          console.log('err', err);
          setRelatedQuestions();
        });
    } else {
      setRelatedQuestions();
    }
  }, [relatedKey]);

  return (
    <>
      {relatedQuestions && (
        <>
          <div className="faq">
            <h2>{question.title}</h2>
            <div className="faq-card-container">
              {relatedQuestions.map(question => (
                <FaqCard question={question} key={question[0]} />
              ))}
            </div>
          </div>
          <div className="faq-links">
            <h2>{contact.title}</h2>
            <div className="faq-links-container">
              <button
                onClick={() => {
                  setShowModal(true);
                }}
              >
                {contact.follow.label}
              </button>
              <a
                href={contact.slack.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contact.slack.label}
                <i className="fab fa-slack-hash"></i>
              </a>
              <a
                href={contact.github.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contact.github.label}
                <i className="fab fa-github"></i>
              </a>
            </div>
            {showModal && (
              <FeedbackModal setShowModal={setShowModal} contact={contact} />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default RelatedQuestion;
