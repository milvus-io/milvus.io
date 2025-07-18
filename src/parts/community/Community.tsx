import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/commonLayout';
import { useTranslation } from 'react-i18next';
import { DISCORD_INVITE_URL, MILVUS_BILIBILI_LINK } from '@/consts';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import classes from '@/styles/community.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { ABSOLUTE_BASE_URL } from '@/consts';
import CustomButton from '@/components/customButton';
import { RightTopArrowIcon } from '@/components/icons/RightTopArrow';
import { LanguageEnum } from '@/types/localization';
import { FC, useState } from 'react';
import { MilvusWechatQRCodePopper } from '@/components/socialMedias';

type Props = {
  locale: LanguageEnum;
};

export const Community: FC<Props> = (props: Props) => {
  const { locale = LanguageEnum.ENGLISH } = props;
  const { t } = useTranslation('community', { lng: locale });

  const isCnSite = locale === LanguageEnum.CHINESE;

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popper' : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(previousOpen => !previousOpen);
  };

  const socialMediaList = [
    {
      label: 'GitHub',
      imgUrl: '/images/community/socialMedia/github.svg',
      href: 'https://github.com/milvus-io/milvus/discussions',
      catLabel: t('join'),
      show: true,
    },
    {
      label: 'Discord',
      imgUrl: '/images/community/socialMedia/discord.svg',
      href: DISCORD_INVITE_URL,
      catLabel: t('join'),
      show: !isCnSite,
    },
    {
      label: '微信',
      imgUrl: '/images/community/socialMedia/wechat.png',
      catLabel: t('join'),
      show: isCnSite,
      children: (
        <MilvusWechatQRCodePopper
          image="/images/milvus-wechat-code.png"
          name={'微信'}
          id={id}
          open={open}
          anchorEl={anchorEl}
          placement="top-end"
          offset={[80, 12]}
        />
      ),
    },
    {
      label: 'LinkedIn',
      imgUrl: '/images/community/socialMedia/linkedin.svg',
      href: 'https://www.linkedin.com/company/the-milvus-project/',
      catLabel: t('join'),
      show: true,
    },

    {
      label: 'Twitter',
      imgUrl: '/images/community/socialMedia/twitter.svg',
      href: 'https://twitter.com/milvusio',
      catLabel: t('join'),
      show: true,
    },
    {
      label: 'Youtube',
      imgUrl: '/images/community/socialMedia/youtube.svg',
      href: 'https://www.youtube.com/@MilvusVectorDatabase/playlists',
      catLabel: t('join'),
      show: !isCnSite,
    },
    {
      label: 'Bilibili',
      imgUrl: '/images/community/socialMedia/bilibili.png',
      href: MILVUS_BILIBILI_LINK,
      catLabel: t('join'),
      show: isCnSite,
    },
    {
      label: 'Ambassador',
      imgUrl: '/images/community/socialMedia/milvus-ambassador.svg',
      href: 'https://docs.google.com/forms/d/e/1FAIpQLSfkVTYObayOaND8M1ci9eF_YWvoKDb-xQjLJYZ-LhbCdLAt2Q/viewform',
      catLabel: t('apply'),
      show: !isCnSite,
    },
    {
      label: 'Milvus 北辰大使',
      imgUrl: '/images/community/socialMedia/milvus-ambassador.svg',
      href: 'https://zilliz.com.cn/northstar',
      catLabel: '大使计划',
      show: isCnSite,
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
              {socialMediaList.map(v => {
                if (!v.show) {
                  return null;
                }
                return (
                  <li key={v.label}>
                    <img src={v.imgUrl} alt={v.label} />
                    <p className="">{v.label}</p>
                    {v.href ? (
                      <CustomButton
                        variant="outlined"
                        href={v.href}
                        className={classes.linkBtn}
                      >
                        {v.catLabel}
                        <RightTopArrowIcon />
                      </CustomButton>
                    ) : (
                      <CustomButton
                        variant="outlined"
                        className={classes.linkBtn}
                        onMouseEnter={handleClick}
                        onMouseLeave={handleClick}
                      >
                        {v.catLabel}
                        <RightTopArrowIcon />
                        {v.children && v.children}
                      </CustomButton>
                    )}
                  </li>
                );
              })}
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
