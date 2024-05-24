import CustomLink from '@/components/customButton';
import classes from './index.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { useTranslation, Trans } from 'react-i18next';
import SocialMedias from '@/components/socialMedias';
import SubscribeNewsletter from '@/components/subscribe';

export default function SubscribeSection() {
  const { t } = useTranslation('home');

  return (
    <section
      className={clsx(pageClasses.homeContainer, classes.sectionContainer)}
    >
      <h2 className={classes.title}>
        <Trans
          t={t}
          i18nKey="subscribeSection.title"
          components={[<span key="blue-text"></span>]}
        />
      </h2>

      <SocialMedias
        classes={{
          link: classes.customIconButton,
          root: classes.socialMediasContainer,
        }}
      />

      <SubscribeNewsletter />
    </section>
  );
}
