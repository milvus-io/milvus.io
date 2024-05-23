import CustomLink from '@/components/customLink';
import classes from './index.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { useTranslation, Trans } from 'react-i18next';
import SocialMedias from '@/components/socialMedias';

export default function SubscribeSection() {
  const { t } = useTranslation('home');

  return (
    <section className="">
      <h2 className="">
        <Trans
          t={t}
          i18nKey="subscribeSection.title"
          components={[<span key="blue-text"></span>]}
        />
      </h2>

      <SocialMedias className={classes.customIconButton} />
    </section>
  );
}
