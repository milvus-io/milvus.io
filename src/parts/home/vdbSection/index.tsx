import classes from './index.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { useTranslation, Trans } from 'react-i18next';
import Link from 'next/link';
import { useGlobalLocale } from '@/hooks/use-global-locale';

export default function VectorDatabaseSection() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home', { lng: locale });

  const featureList = [
    {
      src: '/images/home/scale-as-needed.png',
      title: t('vdbSection.features.scale.title'),
      desc: t('vdbSection.features.scale.desc'),
      class: classes.scale,
    },
    {
      src: '/images/home/blazing-fast.png',
      title: t('vdbSection.features.fast.title'),
      desc: t('vdbSection.features.fast.desc'),
      class: classes.fast,
    },
    {
      src: '/images/home/reusable-code.png',
      title: t('vdbSection.features.reusable.title'),
      desc: t('vdbSection.features.reusable.desc'),
      class: classes.reusable,
    },
    {
      src: '/images/home/vibrant-community.png',
      title: t('vdbSection.features.community.title'),
      desc: t('vdbSection.features.community.desc'),
      class: classes.community,
    },
    {
      src: '/images/home/feature-rich.png',
      title: t('vdbSection.features.featureRich.title'),
      desc: t('vdbSection.features.featureRich.desc'),
      class: classes.featureRich,
    },
  ];

  return (
    <section
      className={clsx(pageClasses.homeContainer, classes.sectionContainer)}
    >
      <h2 className={classes.sectionTitle}>{t('vdbSection.title')}</h2>
      <ul className={classes.featuresList}>
        {featureList.map(feature => (
          <li
            key={feature.title}
            className={clsx(classes.featureItem, feature.class)}
          >
            <div>
              <img src={feature.src} alt={feature.title} />
            </div>
            <div className={classes.descriptionWrapper}>
              <h4>{feature.title}</h4>
              <p>{feature.desc}</p>
            </div>
          </li>
        ))}
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
