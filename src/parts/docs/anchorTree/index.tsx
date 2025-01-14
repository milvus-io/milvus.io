import classes from './index.module.less';
import Link from 'next/link';
import clsx from 'clsx';
import React, { useState } from 'react';
import { TOCIcon } from '@/components/icons';
import { useTranslation } from 'react-i18next';
import { DocAnchorItemType } from '@/types/docs';
import { LanguageEnum } from '@/types/localization';

export default function AnchorTree(props: {
  list: DocAnchorItemType[];
  activeAnchor: string;
  className?: string;
  lang?: LanguageEnum;
}) {
  const {
    list,
    activeAnchor,
    className: customClassName = '',
    lang = LanguageEnum.ENGLISH,
  } = props;
  const { t } = useTranslation('docs', { lng: lang });

  // label maybe duplicate, we use href as unique key to show active style

  const headingLevelList = Array.from(
    new Set(list.map(item => item.type))
  ).sort();

  return (
    <div className={classes.anchorsWrapper}>
      <h5 className={classes.tocWrapper}>
        <TOCIcon />
        <span className={classes.tocTitle}>{t('anchors.title')}</span>
      </h5>

      <ul className={clsx(classes.anchorsList, customClassName)}>
        {list.map((v, idx) => {
          const { label, href, type } = v;
          return (
            <li
              style={{
                paddingLeft: headingLevelList.findIndex(h => h === type) * 17,
              }}
              className={clsx(classes.anchorItem, {
                [classes.activeAnchorItem]: href === activeAnchor,
              })}
              key={v.label + idx}
            >
              <a href={`#${href}`}>{label}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
