import React from 'react';
import Layout from '../../components/layout';
import SEO from '../../components/seo';
import * as classes from './index.module.less';
import { graphql } from 'gatsby';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { findLatestVersion } from '../../utils';
import githubIcon from '../../images/community/socialMedia/github.svg';
import discordIcon from '../../images/community/socialMedia/discord.svg';
import redditIcon from '../../images/community/socialMedia/reddit.svg';
import twitterIcon from '../../images/community/socialMedia/twitter.svg';
import clsx from 'clsx';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import learnIcon from '../../images/community/icons/learn.svg';
import buildIcon from '../../images/community/icons/build.svg';
import shareIcon from '../../images/community/icons/share.svg';
import meetingIcon from '../../images/community/icons/meeting.svg';
import eventIcon from '../../images/community/icons/event.svg';
import videoIcon from '../../images/community/icons/video.svg';
import CustomLink from '../../components/customLink';
import { DISCORD_INVITE_URL } from '../../consts';

const OFFICE_HOUR_REGISTER_LINK =
  'https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration';

const CalendarIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_5496_5849)">
      <path
        d="M17.5 4.99935V16.666C17.5 17.5827 16.75 18.3327 15.8333 18.3327H4.16667C3.24167 18.3327 2.5 17.5827 2.5 16.666L2.50833 4.99935C2.50833 4.08268 3.24167 3.33268 4.16667 3.33268H5V1.66602H6.66667V3.33268H13.3333V1.66602H15V3.33268H15.8333C16.75 3.33268 17.5 4.08268 17.5 4.99935ZM4.16667 6.66602H15.8333V4.99935H4.16667V6.66602ZM15.8333 16.666V8.33268H4.16667V16.666H15.8333Z"
        fill="#4FC4F9"
      />
    </g>
    <defs>
      <clipPath id="clip0_5496_5849">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function CommunityPage({ data, pageContext }) {
  const { language } = pageContext;
  const { allVersion } = data;
  const { t } = useI18next();
  const version = findLatestVersion(allVersion.nodes);

  const socialMediaList = [
    {
      label: 'GitHub',
      imgUrl: githubIcon,
      href: 'https://github.com/milvus-io/milvus/discussions',
    },
    {
      label: 'Discord',
      imgUrl: discordIcon,
      href: DISCORD_INVITE_URL,
    },
    {
      label: 'Reddit',
      imgUrl: redditIcon,
      href: 'https://www.reddit.com/r/vectordatabase/',
    },
    {
      label: 'Twitter',
      imgUrl: twitterIcon,
      href: 'https://twitter.com/milvusio',
    },
  ];

  const featureList = [
    {
      label: 'Learn',
      desc: 'Expand your knowledge and skills in vector database technologies.',
      icon: learnIcon,
    },
    {
      label: 'Build',
      desc: 'Contribute to the development of Milvus through open source collaboration.',
      icon: buildIcon,
    },
    {
      label: 'Share',
      desc: 'Share best practices and lessons learned with the community at large.',
      icon: shareIcon,
    },
  ];

  const resourceList = [
    {
      label: 'Milvus Technical Meeting',
      desc: 'Join our next meeting to be involved in the discussion and decision making of Milvus‘ latest features and development timeline.',
      icon: meetingIcon,
      href: 'https://wiki.lfaidata.foundation/pages/viewpage.action?pageId=43287098',
      btnLabel: 'Learn more',
    },
    {
      label: 'Event',
      desc: 'We host events, often. Click to find out the upcoming events near you.',
      icon: eventIcon,
      href: 'https://www.meetup.com/milvus-meetup/',
      btnLabel: 'More Events',
    },
    {
      label: 'Video',
      desc: 'We upload videos, often. Click to watch the video tutorials，webinar replays and other video contents.',
      icon: videoIcon,
      href: 'https://www.youtube.com/c/MilvusVectorDatabase',
      btnLabel: 'More Videos',
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
    <Layout darkMode={false} t={t} version={version}>
      <SEO
        title="Milvus Community"
        lang={language}
        description="Milvus Community · Vector Database built for scalable similarity search"
      />
      <main className={classes.communityPageContainer}>
        <section className={clsx(classes.headSection, 'col-12 col-8 col-4')}>
          <h1 className="">Join the Community</h1>

          <ul className={classes.mediaWrapper}>
            {socialMediaList.map(v => (
              <li key={v.label}>
                <img src={v.imgUrl} alt={v.label} />
                <p className="">{v.label}</p>
                <CustomLink href={v.href}>Join now</CustomLink>
              </li>
            ))}
          </ul>

          <div className={classes.officeHourWrapper}>
            <div className={classes.leftPart}>
              <div className={classes.bgWrapper}></div>
            </div>
            <div className={classes.rightPart}>
              <h2>Milvus Community Office Hours</h2>
              <p className={classes.desc}>
                Share your latest Milvus project with the community, hosted by
                the Zilliz team.
              </p>
              <p className={classes.date}>
                <CalendarIcon />
                Every Tuesday 1:30 Pacific Time
              </p>
              <CustomLink
                className={classes.registerBtn}
                href={OFFICE_HOUR_REGISTER_LINK}
              >
                Register now
                <ArrowRightAltIcon />
              </CustomLink>
            </div>
          </div>
        </section>

        <section className={clsx(classes.contentSection, 'col-12 col-8 col-4')}>
          <h2>Welcome to the Milvus Community</h2>
          <h3 className={classes.sectionDesc}>
            The Milvus community is comprised of users and open source
            contributors that share new ideas, collaborate on projects, and
            promote learning. Our open-source community members contribute code,
            attend events, advocate for greater adoption of Milvus, and make
            many other valuable contributions. Read on to learn how you can get
            involved and become part of this amazing community.
          </h3>

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
          <div className={clsx(classes.innerSection, 'col-12 col-8 col-4')}>
            <h2>Resources</h2>
            <ul className={classes.resourceList}>
              {resourceList.map(v => (
                <li key={v.label}>
                  <div className={classes.topContent}>
                    <img src={v.icon} alt={v.label} />
                    <p className={classes.label}>{v.label}</p>
                    <p className={classes.desc}>{v.desc}</p>
                  </div>

                  <CustomLink href={v.href} className={classes.linkBtn}>
                    {v.btnLabel}
                    <ArrowRightAltIcon />
                  </CustomLink>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className={clsx(classes.mailListSection, 'col-12 col-8 col-4')}
        >
          <h2>Mailing Lists</h2>
          <div className={classes.mailListWrapper}>
            {mailList.map(v => (
              <CustomLink className={classes.linkBtn} href={v.href}>
                <MailOutlineIcon />
                <span>{v.label}</span>
              </CustomLink>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          data
          language
          ns
        }
      }
    }
    allVersion(filter: { released: { eq: "yes" } }) {
      nodes {
        version
      }
    }
  }
`;
