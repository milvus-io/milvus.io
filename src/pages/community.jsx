import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/commonLayout';
import { useTranslation } from 'react-i18next';
import { DISCORD_INVITE_URL } from '@/consts';
import { ArrowRightAltIcon } from '@/components/icons/ArrowRightAltIcon';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import classes from '@/styles/community.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { ABSOLUTE_BASE_URL } from '@/consts';
import CustomButton from '@/components/customButton';

const OFFICE_HOUR_REGISTER_LINK = 'https://discord.com/invite/8uyFbECzPX';

export default function Community() {
  const { t } = useTranslation('community');

  const socialMediaList = [
    {
      label: 'GitHub',
      imgUrl: '/images/community/socialMedia/github.svg',
      href: 'https://github.com/milvus-io/milvus/discussions',
    },
    {
      label: 'Discord',
      imgUrl: '/images/community/socialMedia/discord.svg',
      href: DISCORD_INVITE_URL,
    },
    {
      label: 'Reddit',
      imgUrl: '/images/community/socialMedia/reddit.svg',
      href: 'https://www.reddit.com/r/vectordatabase/',
    },
    {
      label: 'Twitter',
      imgUrl: '/images/community/socialMedia/twitter.svg',
      href: 'https://twitter.com/milvusio',
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
          <link
            rel="alternate"
            href={`${ABSOLUTE_BASE_URL}/community`}
            hrefLang="en"
          />
        </Head>

        <div className={classes.communityPageContainer}>
          <section className={clsx(pageClasses.container, classes.headSection)}>
            <h1 className="">{t('title')}</h1>

            <ul className={classes.mediaWrapper}>
              {socialMediaList.map(v => (
                <li key={v.label}>
                  <img src={v.imgUrl} alt={v.label} />
                  <p className="">{v.label}</p>
                  <CustomButton variant="outlined" href={v.href}>
                    Join now
                  </CustomButton>
                </li>
              ))}
            </ul>

            <div className={classes.officeHoursContainer}>
              <div className={classes.imgWrapper}>
                <img src="/images/community/event-discord.png" alt="Discord" />
              </div>
              <div className={classes.contentWrapper}>
                <h2 className={classes.title}>{t('officeHours.title')}</h2>
                <p className={classes.desc}>{t('officeHours.content')}</p>

                <CustomButton
                  variant="contained"
                  className={classes.linkBtn}
                  href={OFFICE_HOUR_REGISTER_LINK}
                  target="_blank"
                >
                  {t('officeHours.button')}
                </CustomButton>
              </div>
            </div>
          </section>

          <section
            className={clsx(pageClasses.container, classes.contentSection)}
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
          </section>

          <section className={classes.resourceSection}>
            <div className={clsx(pageClasses.container, classes.innerSection)}>
              <h2>{t('resource')}</h2>
              <ul className={classes.resourceList}>
                {resourceList.map(v => (
                  <li key={v.label}>
                    <div className={classes.topContent}>
                      <img src={v.icon} alt={v.label} />
                      <p className={classes.label}>{v.label}</p>
                      <p className={classes.desc}>{v.desc}</p>
                    </div>

                    <CustomButton variant="outlined" href={v.href}>
                      {v.btnLabel} <ArrowRightAltIcon />
                    </CustomButton>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section
            className={clsx(pageClasses.container, classes.mailListSection)}
          >
            <h2>{t('mail.title')}</h2>
            <div className={classes.mailListWrapper}>
              {mailList.map(v => (
                <Link className={classes.linkBtn} href={v.href}>
                  <MailOutlineIcon fontSize="14" />
                  <span>{v.label}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </Layout>
    </main>
  );
}
