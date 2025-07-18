import CustomLink from '@/components/customButton';
import classes from './index.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { useTranslation, Trans } from 'react-i18next';
import { SocialMedias } from '@/components/socialMedias';
import SubscribeNewsletter from '@/components/subscribe';

export default function SubscribeSection() {
  const { t } = useTranslation('home');

  return (
    <section
      className={clsx(pageClasses.homeContainer, classes.sectionContainer)}
    >
      <div
        className={classes.milvusWrapper}
        style={{ backgroundImage: 'url(/images/home/milvus-union.svg)' }}
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
      </div>

      <div className={classes.subscribeWrapper}>
        <div className={classes.subscribeInfo}>
          <h2 className={classes.subscribeTitle}>
            {t('subscribeSection.subscribe.title')}
          </h2>
          <p className={classes.subscribeDesc}>
            {t('subscribeSection.subscribe.desc')}
          </p>
        </div>
        <div className={classes.subscribeForm}>
          <SubscribeNewsletter
            withoutTitle={true}
            classes={{
              button: classes['subscribeForm-button'],
              inputContainer: classes['subscribeForm-input-container'],
              input: classes['subscribeForm-input'],
              errorMessage: classes['subscribeForm-input-message'],
            }}
          />
        </div>
      </div>
    </section>
  );
}
