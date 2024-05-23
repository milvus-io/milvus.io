import classes from './index.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { useTranslation, Trans } from 'react-i18next';
import { CopyIcon } from '@/components/icons';
import Link from 'next/link';

export default function VectorDatabaseSection() {
  const { t } = useTranslation('home');

  const handleCopyCode = () => {
    navigator.clipboard.writeText('pip install pymilvus');
  };

  return (
    <section
      className={clsx(pageClasses.homeContainer, classes.sectionContainer)}
    >
      <h2 className={classes.sectionTitle}>{t('vdbSection.title')}</h2>
      <ul className={classes.featuresList}>
        <li className={clsx(classes.featureItem, classes.setup)}>
          <div className={classes.topPart}>
            {/* code typing when hover */}
            <div className={classes.codeWrapper}>
              <span className="">pip install pymilvus|</span>
              <button className={classes.copyButton} onClick={handleCopyCode}>
                <CopyIcon color="#00131A" />
              </button>
            </div>
          </div>
          <div className={classes.descriptionWrapper}>
            <h4 className="">{t('vdbSection.features.setup.title')}</h4>
            <p className="">{t('vdbSection.features.setup.desc')}</p>
          </div>
        </li>
        <li className={clsx(classes.featureItem, classes.reusable)}>
          {/* hover to roll */}
          <div className="">
            <img src="/images/home/reusable-code.png" alt="" />
          </div>
          <div className={classes.descriptionWrapper}>
            <h4 className="">{t('vdbSection.features.reusable.title')}</h4>
            <p className="">{t('vdbSection.features.reusable.desc')}</p>
          </div>
        </li>
        <li className={clsx(classes.featureItem, classes.integration)}>
          <div className="">
            <img src="/images/home/integrations.png" alt="" />
          </div>
          <div className={classes.descriptionWrapper}>
            <h4 className="">{t('vdbSection.features.integration.title')}</h4>
            <p className="">{t('vdbSection.features.integration.desc')}</p>
          </div>
        </li>
        <li className={clsx(classes.featureItem, classes.featureRich)}>
          <div className="">
            <img src="/images/home/feature-rich.png" alt="" />
          </div>
          <div className={classes.descriptionWrapper}>
            <h4 className="">{t('vdbSection.features.featureRich.title')}</h4>
            <p className="">{t('vdbSection.features.featureRich.desc')}</p>
          </div>
        </li>
        <li className={clsx(classes.featureItem, classes.community)}>
          <div className="">
            <img src="/images/home/vibrant-community.png" alt="" />
          </div>
          <div className={classes.descriptionWrapper}>
            <h4 className="">{t('vdbSection.features.community.title')}</h4>
            <p className="">{t('vdbSection.features.community.desc')}</p>
          </div>
        </li>
      </ul>
      <p className={classes.docPrompt}>
        <Trans
          t={t}
          i18nKey="vdbSection.prompt"
          components={[<Link href="/docs"></Link>]}
        />
      </p>
    </section>
  );
}
