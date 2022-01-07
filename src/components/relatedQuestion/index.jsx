import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { useGetFaq } from "../../http/hooks";
import CustomIconLink from "../customIconLink";
import { CustomizedDialogs } from "../dialog/Dialog";
import FeedbackDialog from "../dialog/FeedbackDialog";
import * as styles from "./relatedQuestion.module.less";
import clsx from "clsx";
import "../../css/variables/main.less";

export default function RelatedQuestion(props) {
  const { title, contact, relatedKey, isMobile, trans } = props;
  const [showModal, setShowModal] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState({});

  const relatedQuestions = useGetFaq(relatedKey);

  const handleClickQuestion = (question) => {
    const [title, content] = question;
    setSelectedQuestion({ q: title, a: content });
    setShowModal(true);
  };

  const handleClickFollowUp = () => {
    setShowFeedbackDialog(true);
  };
  const handleCancelFollowUp = () => {
    setShowFeedbackDialog(false);
  };

  return (
    <>
      <Typography variant="h2" component="h2" className={styles.title}>
        {title}
      </Typography>
      <ul className={styles.container}>
        {relatedQuestions?.map((question) => {
          const [title, content, isLink] = question;
          return (
            // <FaqCard question={question} key={question[0]} />
            <Typography
              key={question[0]}
              variant="li"
              component="li"
              onClick={() => {
                !isLink && handleClickQuestion(question);
              }}
              className={styles.item}
            >
              {isLink ? (
                <CustomIconLink to={content} className={styles.link}>
                  {question[0]}
                </CustomIconLink>
              ) : (
                question[0]
              )}
            </Typography>
          );
        })}
      </ul>
      <div className={clsx(styles.faqLinks, { [styles.isMobile]: isMobile })}>
        <Typography variant="h6" component="h3" className={styles.subTitle}>
          {trans("v3trans.docs.faqBtnGroupTitle")}
        </Typography>
        <div className={styles.btnGroups}>
          <button
            className={clsx("primaryBtnSm", styles.pBtn)}
            onClick={() => {
              handleClickFollowUp();
            }}
          >
            {trans("v3trans.docs.contactFollow")}
          </button>
          <a
            className={clsx("secondaryBtnSm", styles.sBtn)}
            href={contact.slack.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {trans("v3trans.docs.contactSlack")}
          </a>
          <a
            className={clsx("secondaryBtnSm", styles.sBtn)}
            href={contact.github.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {trans("v3trans.docs.contactGithub")}
          </a>
        </div>
        {showFeedbackDialog && (
          <FeedbackDialog
            open={showFeedbackDialog}
            handleCancel={handleCancelFollowUp}
            handleSubmit={handleCancelFollowUp}
            trans={trans}
          />
        )}
      </div>
      <CustomizedDialogs
        open={showModal}
        handleClose={() => {
          setShowModal(false);
        }}
        title={selectedQuestion?.q}
        content={selectedQuestion?.a}
      />
    </>
  );
}
