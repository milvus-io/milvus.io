import React from 'react';
import * as styles from './index.module.less';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { useI18next } from 'gatsby-plugin-react-i18next';

export default function SizingConfigCard(props) {
  const { bookie, broker, proxy, zookeeper, title } = props;
  const { t } = useI18next();

  return (
    <div className={clsx(styles.toolCardWrapper, styles.configCard)}>
      <Typography component="h4" className={styles.title}>
        {title}
      </Typography>

      <div className={styles.componentsWrapper}>
        {bookie && (
          <div className={styles.component}>
            <Typography component="h5" className={styles.title}>
              component: {t('v3trans.sizingTool.setups.bookie')}
            </Typography>
            {Object.entries(bookie).map(([key, value]) => (
              <div key={key} className={styles.cardLine}>
                <Typography component="span" className={styles.key}>
                  {key}:
                </Typography>
                <Typography component="span" className={styles.value}>
                  {' '}
                  {value}
                </Typography>
              </div>
            ))}
          </div>
        )}

        {broker && (
          <div className={styles.component}>
            <Typography component="h5" className={styles.title}>
              component: {t('v3trans.sizingTool.setups.broker')}
            </Typography>
            {Object.entries(broker).map(([key, value]) => (
              <div key={key} className={styles.cardLine}>
                <Typography component="span" className={styles.key}>
                  {key}:
                </Typography>
                <Typography component="span" className={styles.value}>
                  {' '}
                  {value}
                </Typography>
              </div>
            ))}
          </div>
        )}

        {proxy && (
          <div className={styles.component}>
            <Typography component="h5" className={styles.title}>
              component: {t('v3trans.sizingTool.setups.proxyLabel')}
            </Typography>
            {Object.entries(proxy).map(([key, value]) => (
              <div key={key} className={styles.cardLine}>
                <Typography component="span" className={styles.key}>
                  {key}:
                </Typography>
                <Typography component="span" className={styles.value}>
                  {' '}
                  {value}
                </Typography>
              </div>
            ))}
          </div>
        )}

        {zookeeper && (
          <div className={styles.component}>
            <Typography component="h5" className={styles.title}>
              component: {t('v3trans.sizingTool.setups.zookeeper')}
            </Typography>
            {Object.entries(zookeeper).map(([key, value]) => (
              <div key={key} className={styles.cardLine}>
                <Typography component="span" className={styles.key}>
                  {key}:
                </Typography>
                <Typography component="span" className={styles.value}>
                  {' '}
                  {value}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
