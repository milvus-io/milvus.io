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
  category = 'docs', // docs | api | community
}) => {
  const [commonEditBtn, commonDocIssueBtn, commonIssueBtn] = [
    {
      label: language.footer.editBtn.label,
      icon: 'fas fa-pencil-alt',
    },
    {
      label: isCommunity ? null : language.footer.docIssueBtn.label,
      icon: 'fab fa-github',
    },
    {
      label: language.footer.issueBtn.label,
      icon: 'fas fa-bug',
    },
  ];
  const btnConfiguration = {
    docs: ({ locale, version, editPath, mdTitle }) => {
      const name = editPath.split('/').pop();
      const title = `${version} ${mdTitle} (${name}) Doc Update`;
      return {
        editBtn: {
          label: commonEditBtn.label,
          link: `https://github.com/milvus-io/milvus-docs/edit/${version}/site/${
            locale === 'en' ? 'en' : 'zh-CN'
          }/${editPath}`,
          icon: commonEditBtn.icon,
        },
        docIssueBtn: {
          label: language.footer.docIssueBtn.docLabel,
          link: `https://github.com/milvus-io/milvus-docs/issues/new?assignees=&labels=&template=error-report.md&title=${title}`,
          icon: 'fas fa-bug',
        },
        issueBtn: {
          label: language.footer.issueBtn.docLabel,
          link: 'https://github.com/milvus-io/milvus-docs/issues/new?assignees=&labels=&template=change-request.md&title=New Doc Proposal',
          icon: 'fas fa-lightbulb',
        },
      };
    },
    api: ({ apiReferenceData }) => {
      const { projName, relativePath, sourceUrl } = apiReferenceData;
      const title = `${projName},${version},${relativePath}`;
      return {
        editBtn: {
          label: commonEditBtn.label,
          link: sourceUrl,
          icon: commonEditBtn.icon,
        },
        docIssueBtn: {
          label: commonDocIssueBtn.label,
          link: 'https://github.com/milvus-io/milvus/discussions/new',
          icon: commonDocIssueBtn.icon,
        },
        issueBtn: {
          label: commonIssueBtn.label,
          link: `https://github.com/milvus-io/milvus/issues/new?assignees=&labels=&template=bug_report.md&title=${title}`,
          icon: commonIssueBtn.icon,
        },
      };
    },
    community: ({ locale, editPath, id }) => ({
      editBtn: {
        label: commonEditBtn.label,
        link: `https://github.com/milvus-io/web-content/edit/master/community/site/${
          locale === 'en' ? 'en' : 'zh-CN'
        }/${editPath}`,
        icon: commonEditBtn.icon,
      },
      docIssueBtn: {
        label: commonDocIssueBtn.label,
        link: 'https://github.com/milvus-io/web-content/discussions/new',
        icon: commonDocIssueBtn.icon,
      },
      issueBtn: {
        label: commonIssueBtn.label,
        link: `https://github.com/milvus-io/web-content/issues/new?assignees=&labels=&template=error-report.md&title=${id}`,
        icon: commonIssueBtn.icon,
      },
    }),
  };

  const { editBtn, docIssueBtn, issueBtn } = btnConfiguration[category]({
    locale,
    version,
    editPath,
    mdTitle,
    id,
    apiReferenceData,
  });
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
            href={editBtn.link}
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.btnIconWrapper}>
              <i className={`${editBtn.icon} ${styles.btnIcon}`}></i>
            </span>

            {editBtn.label}
          </a>
        )}
        {!!language.footer.docIssueBtn ? (
          <a
            className={styles.btnAnchor}
            href={docIssueBtn.link}
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.btnIconWrapper}>
              <i className={`${docIssueBtn.icon} ${styles.btnIcon}`}></i>
            </span>
            {docIssueBtn.label}
          </a>
        ) : null}
        {!!language.footer.issueBtn ? (
          <a
            className={styles.btnAnchor}
            id="btn-bug"
            href={issueBtn.link}
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.btnIconWrapper}>
              <i className={`${issueBtn.icon} ${styles.btnIcon}`}></i>
            </span>
            {issueBtn.label}
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

export default BtnGroups;
