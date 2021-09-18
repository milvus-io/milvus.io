import React from 'react';
import * as styles from './index.module.less';

const BtnGroups = ({
  isBlog,
  isBenchMark,
  isApiReference,
  version,
  locale,
  editPath,
  id,
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
            target="_blank"
            rel="noreferrer"
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
            href={generateDisscussLink({
              isCommunity,
              apiReferenceData,
            })}
            target="_blank"
            rel="noreferrer"
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
            href={generateIssueLink({
              version,
              id,
              isCommunity,
              apiReferenceData,
            })}
            target="_blank"
            rel="noreferrer"
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
            target="_blank"
            rel="noreferrer"
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

const generateIssueLink = ({
  version,
  id,
  isCommunity,
  apiReferenceData: { projName, relativePath, apiVersion, sourceUrl },
}) => {
  if (sourceUrl) {
    const title = `${projName},${version},${relativePath}`;
    return `https://github.com/milvus-io/milvus/issues/new?assignees=&labels=&template=bug_report.md&title=${title}`;
  }
  const title = `${version},${id}`;
  let issueLink = isCommunity
    ? `https://github.com/milvus-io/web-content/issues/new?assignees=&labels=&template=error-report.md&title=${id}`
    : `https://github.com/milvus-io/milvus-docs/issues/new?assignees=&labels=&template=error-report.md&title=${title}`;
  return issueLink;
};

const generateDisscussLink = ({
  isCommunity,
  apiReferenceData: { sourceUrl },
}) => {
  if (sourceUrl) return 'https://github.com/milvus-io/milvus/discussions/new';
  return isCommunity
    ? 'https://github.com/milvus-io/web-content/discussions/new'
    : 'https://github.com/milvus-io/milvus-docs/discussions/new';
};

export default BtnGroups;
