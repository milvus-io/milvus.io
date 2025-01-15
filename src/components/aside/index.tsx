import clsx from 'clsx';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CustomizedContentDialogs } from '@/components/dialog/Dialog';
import { LanguageSelector } from '@/components/language-selector';
import { LanguageEnum } from '@/types/localization';
import { DocAnchorItemType } from '@/types/docs';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AnchorTree from '../../parts/docs/anchorTree';
import FeedbackSection from './feedback';
import styles from './index.module.less';
import CloudAdvertisementCard from '../card/advCard';

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
  activeAnchor?: string;
  lang?: LanguageEnum;
  disableLanguageSelector?: boolean;
  disabledLanguages?: LanguageEnum[];

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
    isShowBtnGroup = true,
    classes = {},
    docData,
    apiReferenceData,
    activeAnchor = '',
    lang,
    disableLanguageSelector,
    disabledLanguages = [],
  } = props;
  const { t } = useTranslation('docs', { lng: lang });
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
    <div className={clsx(styles.rightNavWrapper, root)}>
      <LanguageSelector
        value={lang}
        className="mb-[32px]"
        disabled={disableLanguageSelector}
        showDeepLogo={lang !== LanguageEnum.ENGLISH}
        disabledLanguages={disabledLanguages}
      />
      <>
        {category === 'doc' && (
          <AnchorTree
            list={items}
            activeAnchor={activeAnchor}
            className={clsx(anchorTree)}
            lang={lang}
          />
        )}
        <CloudAdvertisementCard
          language={lang}
          className={styles.advContainer}
        />
        {isShowBtnGroup && (
          <ul
            className={clsx(styles.btnsGroup, btnGroup, {
              [styles.noMarginTop]: category === 'api',
            })}
          >
            {generateBtnGroup(category, styles)}
          </ul>
        )}

        <FeedbackSection handleUpdateDialog={handleUpdateDialog} lang={lang} />
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
    </div>
  );
};

export default Aside;
