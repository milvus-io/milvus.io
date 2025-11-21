import { ListItemTickIcon, RightTopArrowIcon } from '@/components/icons';
import styles from './index.module.less';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import clsx from 'clsx';
import { CLOUD_SIGNUP_LINK } from '@/consts';

export default function ZillizAdv(props: {
  className?: string;
  ctaLink?: string;
}) {
  const { t } = useTranslation('blog');
  const {
    className = '',
    ctaLink = `${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_bottom_banner&utm_content=blog`,
  } = props;
  const features = [
    t('blog:zillizAdv.feature1'),
    t('blog:zillizAdv.feature2'),
    t('blog:zillizAdv.feature3'),
  ];

  const featureItems = features.map(f => (
    <li className={styles['zilliz-adv-features-item']} key={f}>
      <ListItemTickIcon className={styles['zilliz-adv-features-item-icon']} />
      {f}
    </li>
  ));

  return (
    <section className={clsx(styles['zilliz-adv'], className)}>
      <div className={styles['zilliz-adv-main']}>
        <h6 className={styles['zilliz-adv-small-title']}>
          {t('blog:zillizAdv.smallTitle')}
        </h6>
        <h3 className={styles['zilliz-adv-title']}>
          {t('blog:zillizAdv.title')}
        </h3>
        <ul className={styles['zilliz-adv-features']}>{featureItems}</ul>
        <Link
          href={ctaLink}
          target="_blank"
          className={styles['zilliz-adv-btn']}
        >
          {t('blog:zillizAdv.btn')}
          <RightTopArrowIcon color="#FFFFFF" />
        </Link>
      </div>
      <div
        className={styles['zilliz-adv-logo']}
        style={{ backgroundImage: 'url(/images/supported.png)' }}
      />
    </section>
  );
}
