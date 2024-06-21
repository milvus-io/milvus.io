import React, { useState } from 'react';
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
import styles from './index.module.less';
import clsx from 'clsx';
import AnchorTree from '../../parts/docs/anchorTree';
import { DocAnchorItemType } from '@/types/docs';
import { CustomizedContentDialogs } from '@/components/dialog/Dialog';

import FeedbackSection from './feedback';

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

interface DocData {
  editPath: string;
}
interface ApiReferenceData extends DocData {
  slackPath: string;
  discussPath: string;
  reportPath: string;
}

interface AsidePropsType {
  category: 'doc' | 'api';
  version?: string;
  items?: DocAnchorItemType[];
  title?: string;
  isShowBtnGroup?: boolean;
  mdTitle?: string;
  apiReferenceData?: ApiReferenceData;
  docData?: DocData;

  classes?: {
    root?: string;
    btnGroup?: string;
    anchorTree?: string;
  };
}

export interface DialogPropsType {
  open: boolean;
  title: string;
  children: JSX.Element;
  actions?: React.ReactNode;
}

const Aside = (props: AsidePropsType) => {
  const {
    category = 'doc',
    items,
    title,
    isShowBtnGroup = true,
    classes = {},
    docData,
    apiReferenceData,
  } = props;
  const { t } = useTranslation('docs');
  const { root, btnGroup, anchorTree } = classes;

  const [dialogConfig, setDialogConfig] = useState<DialogPropsType>({
    open: false,
    title: '',
    children: <></>,
    actions: undefined,
  });

  const handleCloseDialog = () => {
    setDialogConfig(v => ({
      ...v,
      open: false,
    }));
  };

  const handleUpdateDialog = (params: DialogPropsType) => {
    setDialogConfig(params);
  };

  const btnConfiguration = {
    doc: [
      {
        label: t('docAction.edit'),
        link: `https://github.com/milvus-io/milvus-docs/edit${docData?.editPath}`,
        icon: faPencilAlt,
      },

      {
        label: t('docAction.issue'),
        link: 'https://github.com/milvus-io/milvus-docs/issues/new/choose',
        icon: faGithub,
      },
    ],
    api: [
      {
        label: t('docAction.edit'),
        link: apiReferenceData?.editPath,
        icon: faPencilAlt,
      },
      {
        label: t('docAction.issue'),
        link: 'https://github.com/milvus-io/web-content/issues/new/choose',
        icon: faGithub,
      },
    ],
    // community: ({ locale, editPath, id }) => {
    //   const localePath = locale === 'en' ? 'en' : 'zh-CN';
    //   return [
    //     {
    //       label: commonEditBtnConf.label,
    //       link: `https://github.com/milvus-io/web-content/edit/master/community/site/${localePath}/${editPath}`,
    //       icon: commonEditBtnConf.icon,
    //     },
    //     {
    //       label: bugBtnConf.label,
    //       link: 'https://github.com/milvus-io/web-content/discussions/new',
    //       icon: bugBtnConf.icon,
    //     },
    //     {
    //       label: commonJoinBtnConf.label,
    //       link: 'https://slack.milvus.io',
    //       icon: commonJoinBtnConf.icon,
    //     },
    //   ];
    // },
  };

  const generateBtnGroup = (category: 'doc' | 'api', styles: any) => {
    const actionButtons = btnConfiguration[category];
    return (
      <>
        {actionButtons.map(btn => (
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
        {isShowBtnGroup && (
          <ul
            className={clsx(styles.btnsGroup, btnGroup, {
              [styles.noMarginTop]: category === 'api',
            })}
          >
            {generateBtnGroup(category, styles)}
          </ul>
        )}

        <FeedbackSection handleUpdateDialog={handleUpdateDialog} />
      </>
      <CustomizedContentDialogs
        {...dialogConfig}
        handleClose={handleCloseDialog}
        classes={{
          title: styles.customTitleClass,
          actions: styles.customActionsClass,
          root: styles.customRootClass,
        }}
      />
    </section>
  );
};
export default Aside;
