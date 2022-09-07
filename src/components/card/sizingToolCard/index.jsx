import React from 'react';
import * as styles from './index.module.less';
import Tooltip from '@mui/material/Tooltip';
import clsx from 'clsx';
import { ToolTipFilled } from '../../icons';

export default function SizingToolCard(props) {
  const {
    title,
    content,
    subTitle = '',
    classes = {},
    showTooltip = false,
    tooltip = '',
    id,
  } = props;

  const { root, titleClassName, subTitleClassName, contentClassName } = classes;

  return (
    <div
      className={clsx(styles.toolCardWrapper, {
        [root]: root,
      })}
    >
      <div className={styles.titleWrapper}>
        <h4
          className={clsx(styles.title, {
            [titleClassName]: titleClassName,
          })}
        >
          <span>{title}</span>

          {showTooltip && (
            <div className={styles.iconWrapper}>
              <Tooltip
                title={tooltip}
                placement="top"
                disableFocusListener
                disableTouchListener
                arrow
                classes={{
                  tooltip: styles.tooltip,
                }}
              >
                <span>
                  <ToolTipFilled />
                </span>
              </Tooltip>
            </div>
          )}
        </h4>
        {subTitle && (
          <h5
            className={clsx(styles.subTitle, {
              [subTitleClassName]: subTitleClassName,
            })}
          >
            {subTitle}
          </h5>
        )}
      </div>

      <p
        className={clsx(styles.content, {
          [contentClassName]: contentClassName,
        })}
      >
        {content}
      </p>
    </div>
  );
}
