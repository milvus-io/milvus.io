import React from 'react';
import TocTreeView from '../treeView/TocTreeView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt,
  faBug,
  faHashtag,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';
import * as styles from './index.module.less';
import clsx from 'clsx';
import AnchorTree from '../../parts/docs/anchorTree';

// const result = {
//   doc: {},
//   api: {},
//   community: {
//     edit: {
//       icon: "pencil",
//       label: "edit this page",
//       href: "https://github.com/milvus-io/web-content/edit/master/community/site/en/communityArticles/about/why_contributing.md",
//     },
//     bug: {
//       icon: "bug",
//       label: "report a bug",
//       link: "https://github.com/milvus-io/web-content/issues/new?assignees=&labels=&template=error-report.md&title=why_contributing.md",
//     },
//     join: {
//       icon: "tag",
//       label: "join slack channel",
//       link: "https://milvusio.slack.com/ssb/redirect",
//     },
//   },
// };

const Aside = props => {
  const {
    category = 'doc',
    items,
    title,
    isShowBtnGroup = 'true',
    classes = {},
  } = props;
  const { t } = useTranslation('common');
  const { root, btnGroup, anchorTree } = classes;
  // editBtn issueBtn; bugBtn; suggestBtn; joinBtn
  const [
    commonEditBtnConf,
    bugBtnConf,
    suggestBtnConf,
    discussBtnConf,
    commonJoinBtnConf,
  ] = [
    {
      label: t('v3trans.docs.btnGroup.editBtn'),
      icon: faPencilAlt,
    },
    {
      label: t('v3trans.docs.btnGroup.bugBtn'),
      icon: faBug,
    },
    {
      label: t('v3trans.docs.btnGroup.suggestBtn'),
      icon: faLightbulb,
    },
    {
      label: t('v3trans.docs.btnGroup.discussBtn'),
      icon: faGithub,
    },
    {
      label: t('v3trans.docs.btnGroup.joinBtn'),
      icon: faHashtag,
    },
  ];

  const btnConfiguration = {
    doc: ({ locale, version = '', editPath }) => {
      const localePath = locale === 'en' ? 'en' : 'zh-CN';
      return [
        {
          label: commonEditBtnConf.label,
          link: `https://github.com/milvus-io/milvus-docs/edit/${version}/site/${localePath}/${editPath}`,
          icon: commonEditBtnConf.icon,
        },
        {
          label: bugBtnConf.label,
          link: `https://github.com/milvus-io/milvus/issues/new?assignees=yanliang567&labels=kind%2Fbug%2Cneeds-triage&template=bug_report.yaml&title=[Bug]%3A+`,
          icon: bugBtnConf.icon,
        },
        {
          label: suggestBtnConf.label,
          link: 'https://github.com/milvus-io/milvus-docs/issues/new/choose',
          icon: suggestBtnConf.icon,
        },
      ];
    },
    api: ({ apiReferenceData }) => {
      const { sourceUrl } = apiReferenceData;
      return [
        {
          label: commonEditBtnConf.label,
          link: sourceUrl,
          icon: commonEditBtnConf.icon,
        },
        {
          label: discussBtnConf.label,
          link: 'https://github.com/milvus-io/milvus/discussions/new',
          icon: discussBtnConf.icon,
        },
        {
          label: bugBtnConf.label,
          link: `https://github.com/milvus-io/milvus/issues/new?assignees=yanliang567&labels=kind%2Fbug%2Cneeds-triage&template=bug_report.yaml&title=[Bug]%3A+`,
          icon: bugBtnConf.icon,
        },
        {
          label: commonJoinBtnConf.label,
          link: 'https://slack.milvus.io',
          icon: commonJoinBtnConf.icon,
        },
      ];
    },
    community: ({ locale, editPath, id }) => {
      const localePath = locale === 'en' ? 'en' : 'zh-CN';
      return [
        {
          label: commonEditBtnConf.label,
          link: `https://github.com/milvus-io/web-content/edit/master/community/site/${localePath}/${editPath}`,
          icon: commonEditBtnConf.icon,
        },
        {
          label: bugBtnConf.label,
          link: 'https://github.com/milvus-io/web-content/discussions/new',
          icon: bugBtnConf.icon,
        },
        {
          label: commonJoinBtnConf.label,
          link: 'https://slack.milvus.io',
          icon: commonJoinBtnConf.icon,
        },
      ];
    },
  };

  const generateBtnGroup = (category, props, styles) => {
    const btns = btnConfiguration[category](props) || [];
    return (
      <>
        {btns.map(btn => (
          <li key={btn.label}>
            <a
              href={btn.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <span className={styles.iconWrapper}>
                <FontAwesomeIcon className={styles.global} icon={btn.icon} />
              </span>
              <span className={styles.label}>{btn.label}</span>
            </a>
          </li>
        ))}
      </>
    );
  };
  return (
    <section className={clsx(styles.rightNavWrapper, root)}>
      <>
        {isShowBtnGroup && (
          <ul
            className={clsx(styles.btnsGroup, {
              [btnGroup]: btnGroup,
            })}
          >
            {generateBtnGroup(category, props, styles)}
          </ul>
        )}
        {category === 'doc' && (
          <AnchorTree
            list={items}
            t={t}
            className={
              (styles.anchor,
              {
                [anchorTree]: anchorTree,
              })
            }
          />
        )}
      </>
    </section>
  );
};
export default Aside;
