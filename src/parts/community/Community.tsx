import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/commonLayout';
import { useTranslation } from 'react-i18next';
import { DISCORD_INVITE_URL } from '@/consts';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import classes from '@/styles/community.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { ABSOLUTE_BASE_URL } from '@/consts';
import CustomButton from '@/components/customButton';
import { RightTopArrowIcon } from '@/components/icons/RightTopArrow';
import { LanguageEnum } from '@/types/localization';
import { FC } from 'react';

type Props = {
  locale: LanguageEnum;
};

export const Community: FC<Props> = (props: Props) => {
  const { locale = LanguageEnum.ENGLISH } = props;
  const { t } = useTranslation('community', { lng: locale });

  const socialMediaList = [
    {
      label: 'GitHub',
      imgUrl: '/images/community/socialMedia/github.svg',
      href: 'https://github.com/milvus-io/milvus/discussions',
      catLabel: t('join'),
    },
    {
      label: 'Discord',
      imgUrl: '/images/community/socialMedia/discord.svg',
      href: DISCORD_INVITE_URL,
      catLabel: t('join'),
    },
    {
      label: 'LinkedIn',
      imgUrl: '/images/community/socialMedia/linkedin.svg',
      href: 'https://www.linkedin.com/company/the-milvus-project/',
      catLabel: t('join'),
    },

    {
      label: 'Twitter',
      imgUrl: '/images/community/socialMedia/twitter.svg',
      href: 'https://twitter.com/milvusio',
      catLabel: t('join'),
    },
    {
      label: 'Youtube',
      imgUrl: '/images/community/socialMedia/youtube.svg',
      href: 'https://www.youtube.com/@MilvusVectorDatabase/playlists',
      catLabel: t('join'),
    },
    {
      label: 'Ambassador',
      imgUrl: '/images/community/socialMedia/milvus-ambassador.svg',
      href: 'https://docs.google.com/forms/d/e/1FAIpQLSfkVTYObayOaND8M1ci9eF_YWvoKDb-xQjLJYZ-LhbCdLAt2Q/viewform',
      catLabel: t('apply'),
    },
  ];

  const featureList = [
    {
      label: t('community.features.learn.title'),
      desc: t('community.features.learn.content'),
      icon: '/images/community/icons/learn.svg',
    },
    {
      label: t('community.features.build.title'),
      desc: t('community.features.build.content'),
      icon: '/images/community/icons/build.svg',
    },
    {
      label: t('community.features.share.title'),
      desc: t('community.features.share.content'),
      icon: '/images/community/icons/share.svg',
    },
  ];

  const resourceList = [
    {
      label: t('mail.mailList.meeting.title'),
      desc: t('mail.mailList.meeting.content'),
      icon: '/images/community/icons/meeting.svg',
      href: 'https://milvus.io/discord',
      btnLabel: t('mail.mailList.meeting.cta'),
    },
    {
      label: t('mail.mailList.event.title'),
      desc: t('mail.mailList.event.content'),
      icon: '/images/community/icons/event.svg',
      href: 'https://www.meetup.com/milvus-meetup/',
      btnLabel: t('mail.mailList.event.cta'),
    },
    {
      label: t('mail.mailList.video.title'),
      desc: t('mail.mailList.video.content'),
      icon: '/images/community/icons/video.svg',
      href: 'https://www.youtube.com/c/MilvusVectorDatabase',
      btnLabel: t('mail.mailList.video.cta'),
    },
  ];

  const mailList = [
    {
      label: 'Milvus Technical Discuss',
      href: 'https://lists.lfaidata.foundation/g/milvus-technical-discuss',
    },
    {
      label: 'Milvus TSC',
      href: 'https://lists.lfaidata.foundation/g/milvus-tsc',
    },
    {
      label: 'Milvus Announce',
      href: 'https://lists.lfaidata.foundation/g/milvus-announce',
    },
  ];
  return (
    <main>
      <Layout>
        <Head>
          <title>Welcome to the Milvus Community of AI Developers </title>
          <meta
            name="description"
            content="Join an open-source community of passionate developers and engineers dedicated to GenAI"
          />
        </Head>

        <div className={classes.communityPageContainer}>
          <section
            className={clsx(pageClasses.homeContainer, classes.headSection)}
          >
            <h1 className="">{t('title')}</h1>

            <ul className={classes.mediaWrapper}>
              {socialMediaList.map(v => (
                <li key={v.label}>
                  <img src={v.imgUrl} alt={v.label} />
                  <p className="">{v.label}</p>
                  <CustomButton
                    variant="outlined"
                    href={v.href}
                    className={classes.linkBtn}
                  >
                    {v.catLabel}
                    <RightTopArrowIcon />
                  </CustomButton>
                </li>
              ))}
            </ul>

            <div className={classes.officeHoursContainer}>
              <div className={classes.imgWrapper}></div>
              <div className={classes.contentWrapper}>
                <h2 className={classes.title}>{t('officeHours.title')}</h2>
                <p className={classes.desc}>{t('officeHours.content')}</p>

                <CustomButton
                  variant="contained"
                  className={classes.linkBtn}
                  href="/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"
                  endIcon={<RightTopArrowIcon />}
                >
                  {t('officeHours.button')}
                </CustomButton>
              </div>
            </div>
          </section>

          {/* <section
            className={clsx(pageClasses.homeContainer, classes.contentSection)}
          >
            <h2>{t('community.title')}</h2>
            <h3 className={classes.sectionDesc}>{t('community.content')}</h3>

            <ul className={classes.featureWrapper}>
              {featureList.map(v => (
                <li key={v.label}>
                  <img src={v.icon} alt={v.label} />
                  <p className={classes.label}>{v.label}</p>
                  <p className={classes.desc}>{v.desc}</p>
                </li>
              ))}
            </ul>
          </section> */}

          {/* <section
            className={clsx(pageClasses.homeContainer, classes.mailListSection)}
          >
            <h2>{t('mail.title')}</h2>
            <div className={classes.mailListWrapper}>
              {mailList.map(v => (
                <Link className={classes.linkBtn} href={v.href}>
                  <MailOutlineIcon />
                  <span>{v.label}</span>
                </Link>
              ))}
            </div>
          </section> */}
        </div>
      </Layout>
    </main>
  );
};
