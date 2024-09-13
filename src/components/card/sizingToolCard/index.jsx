import React from 'react';
import * as styles from './index.module.less';
import Tooltip from '@mui/material/Tooltip';
import clsx from 'clsx';
import { ToolTipFilled } from '../../icons';
import { Typography } from '@mui/material';

export default function SizingToolCard(props) {
  const {
    title,
    content,
    subTitle = '',
    classes = {},
    showTooltip = false,
    tooltip = '',
    extraData,
    disk,
  } = props;
  const { root, titleClassName, subTitleClassName, contentClassName } = classes;

  return (
    <div
      className={clsx(styles.toolCardWrapper, {
        [root]: root,
      })}
    >
      <div>
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
                PopperProps={{
                  offset: [0, -10],
                }}
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

      {extraData && (
        <div className={styles.extraDataWrapper}>
          <Typography component="span" className={styles.key}>
            {extraData.key}:
          </Typography>
          <Typography component="span" className={styles.value}>
            &nbsp;&nbsp;{extraData.value}
          </Typography>
        </div>
      )}

      <p
        className={clsx(styles.content, {
          [contentClassName]: contentClassName,
        })}
      >
        {showTooltip && <span>x&nbsp;&nbsp;</span>}
        {content}
      </p>
    </div>
  );
}
