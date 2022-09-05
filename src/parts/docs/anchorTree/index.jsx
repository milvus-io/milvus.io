import classes from './index.module.less';
import Link from 'next/link';
import clsx from 'clsx';
import React, { useState } from 'react';

export default function AnchorTree(props) {
  const { list, t, className: customClasseName = '' } = props;

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
    <ul
      className={clsx(classes.anchorsWrapper, {
        [customClasseName]: customClasseName,
      })}
    >
      <p className={classes.title}>{t('anchorTitle')}</p>
      {list.map((v, idx) => {
        const { label, href, type } = v;

        return (
          <li
            style={{
              paddingLeft: headingLevelList.findIndex(h => h === type) * 20,
            }}
            className={clsx(classes.anchorItem, {
              [classes.activeAnchorItem]: href === activeAnchor,
            })}
            key={v.label + idx}
            onClick={() => handleChooseAnchor(href)}
          >
            <Link href={`#${href}`}>
              <a>{label}</a>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
