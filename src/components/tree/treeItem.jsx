import classes from './index.module.less';
import Link from 'next/link';
import React, { useMemo } from 'react';
import clsx from 'clsx';
import { OutLinkIcon } from '../../components/icons';

export default function MenuTreeItem(props) {
  const {
    data: { id, label, href, externalLink = '', parentIds, isActive },
    onNodeClick,
    version,
  } = props;

  const linkInfo = useMemo(() => {
    const link = externalLink || `/docs/${version}/${href}`;
    const target = externalLink ? '_blank' : '_self';
    return {
      link,
      target,
    };
  }, [href, externalLink]);

  const layerClassName = useMemo(() => {
    return parentIds.length === 0 ? classes.outerItem : classes.innerItem;
  }, [parentIds]);

  return (
    <div
      className={clsx(classes.menuTreeItemWrapper, layerClassName, {
        [classes.activeItem]: isActive,
        [classes.externalLink]: externalLink,
      })}
      style={{
        paddingLeft: `${20 * parentIds.length}px`,
      }}
      onClick={() => onNodeClick(id, parentIds, true)}
    >
      <Link href={linkInfo.link} scroll={true}>
        <a
          target={linkInfo.target}
          className={clsx({
            [classes.externalLink]: externalLink,
          })}
        >
          {label}
          <span className={classes.iconWrapper}>
            {externalLink && <OutLinkIcon />}
          </span>
        </a>
      </Link>
    </div>
  );
}
