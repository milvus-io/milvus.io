import React from 'react';
import * as styles from './index.module.less';

const BtnGroups = ({
  isBlog,
  isBenchMark,
  isApiReference,
  version,
  locale,
  editPath,
  language,
  isCommunity = false,
  apiReferenceData,
}) => {
  const { projName, relativePath, apiVersion, sourceUrl } = apiReferenceData;
  const shouldRenderBtns = !isApiReference
    ? !isBlog && !isBenchMark
    : projName && relativePath && apiVersion && sourceUrl;

  return (
    <>
      <div className={styles.buttonContainer}>
        {shouldRenderBtns && (
          <a
            className={styles.btnAnchor}
            href={generateEditLink({
              version,
              locale,
              editPath,
              isCommunity,
              apiReferenceData,
            })}
          >
            <span className={styles.btnIconWrapper}>
              <i className={`fas fa-pencil-alt ${styles.btnIcon}`}></i>
            </span>

            {language.footer.editBtn.label}
          </a>
        )}
        {!!language.footer.docIssueBtn ? (
          <a
            className={styles.btnAnchor}
            href={language.footer.docIssueBtn.link}
          >
            <span className={styles.btnIconWrapper}>
              <i className={`fab fa-github ${styles.btnIcon}`}></i>
            </span>
            {language.footer.docIssueBtn.label}
          </a>
        ) : null}
        {!!language.footer.issueBtn ? (
          <a
            className={styles.btnAnchor}
            id="btn-bug"
            href={
              language.footer.issueBtn.link
                ? language.footer.issueBtn.link
                : language.footer.issueBtn.communityLink
            }
          >
            <span className={styles.btnIconWrapper}>
              <i className={`fas fa-bug ${styles.btnIcon}`}></i>
            </span>

            {language.footer.issueBtn.label}
          </a>
        ) : null}
        {!!language.footer.questionBtn ? (
          <a
            className={styles.btnAnchor}
            id="btn-question"
            href={language.footer.questionBtn.link}
          >
            <span className={styles.btnIconWrapper}>
              <i className={`fab fa-slack-hash ${styles.btnIcon}`}></i>
            </span>

            {language.footer.questionBtn.label}
          </a>
        ) : null}
      </div>
    </>
  );
};

const generateEditLink = ({
  version,
  locale,
  editPath,
  isCommunity,
  apiReferenceData: { projName, relativePath, apiVersion, sourceUrl },
}) => {
  if (sourceUrl) return sourceUrl;
  let editLink = isCommunity
    ? `https://github.com/milvus-io/web-content/edit/master/community/site/${
        locale === 'en' ? 'en' : 'zh-CN'
      }/${editPath}`
    : `https://github.com/milvus-io/milvus-docs/edit/${version}/site/${
        locale === 'en' ? 'en' : 'zh-CN'
      }/${editPath}`;
  return editLink;
};

export default BtnGroups;
