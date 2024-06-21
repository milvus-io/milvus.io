import classes from './index.module.less';
import Link from 'next/link';
import clsx from 'clsx';
import React, { useState } from 'react';
import { TOCIcon } from '@/components/icons';

export default function AnchorTree(props) {
  const { list, t, className: customClassName = '' } = props;

  // label maybe duplicate, we use href as unique key to show active style
  const [activeAnchor, setActiveAnchor] = useState('');

  const headingLevelList = Array.from(
    new Set(list.map(item => item.type))
  ).sort();

  const handleChooseAnchor = href => {
    if (!href) {
      return;
    }
    setActiveAnchor(href);
  };

  return (
    <div className={classes.anchorsWrapper}>
      <h4 className={classes.tocWrapper}>
        <TOCIcon />
        <span className={classes.tocTitle}>Table of contents</span>
      </h4>

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
              onClick={() => handleChooseAnchor(href)}
            >
              <a href={`#${href}`}>{label}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
