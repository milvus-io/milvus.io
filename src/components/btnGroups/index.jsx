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
  mdTitle = '',
}) => {
  const { projName, relativePath, apiVersion, sourceUrl } = apiReferenceData;
  const shouldRenderBtns = !isApiReference
    ? !isBlog && !isBenchMark
    : projName && relativePath && apiVersion && sourceUrl;
  const isDocs = !(isBlog || isBenchMark || isApiReference || isCommunity);

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
              editPath,
              version,
              mdTitle,
              isCommunity,
              apiReferenceData,
            })}
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.btnIconWrapper}>
              <i
                className={`${isDocs ? 'fas fa-bug' : 'fab fa-github'} ${
                  styles.btnIcon
                }`}
              ></i>
            </span>
            {language.footer.docIssueBtn[isDocs ? 'docLabel' : 'label']}
          </a>
        ) : null}
        {!!language.footer.issueBtn ? (
          <a
            className={styles.btnAnchor}
            id="btn-bug"
            href={generateIssueLink({
              id,
              version,
              isCommunity,
              apiReferenceData,
            })}
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.btnIconWrapper}>
              <i
                className={`${isDocs ? 'fas fa-lightbulb' : 'fas fa-bug'} ${
                  styles.btnIcon
                }`}
              ></i>
            </span>
            {language.footer.issueBtn[isDocs ? 'docLabel' : 'label']}
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
  id,
  version,
  isCommunity,
  apiReferenceData: { projName, relativePath, apiVersion, sourceUrl },
}) => {
  if (sourceUrl) {
    const title = `${projName},${version},${relativePath}`;
    return `https://github.com/milvus-io/milvus/issues/new?assignees=&labels=&template=bug_report.md&title=${title}`;
  }

  let issueLink = isCommunity
    ? `https://github.com/milvus-io/web-content/issues/new?assignees=&labels=&template=error-report.md&title=${id}`
    : `https://github.com/milvus-io/milvus-docs/issues/new?assignees=&labels=&template=change-request.md&title=New Doc Proposal`;
  return issueLink;
};

const generateDisscussLink = ({
  editPath,
  version,
  mdTitle,
  isCommunity,
  apiReferenceData: { sourceUrl },
}) => {
  if (sourceUrl) return 'https://github.com/milvus-io/milvus/discussions/new';
  const name = editPath.split('/').pop();
  const title = `${version} ${mdTitle} (${name}) Doc Update`;
  return isCommunity
    ? 'https://github.com/milvus-io/web-content/discussions/new'
    : `https://github.com/milvus-io/milvus-docs/issues/new?assignees=&labels=&template=error-report.md&title=${title}`;
};

export default BtnGroups;
