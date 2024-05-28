import {
  DISCORD_INVITE_URL,
  GITHUB_MILVUS_LINK,
  MILVUS_TWITTER_LINK,
  MILVUS_YOUTUBE_CHANNEL_LINK,
  MILVUS_LINKEDIN_URL,
} from '@/consts/links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import {
  faGithub,
  faYoutube,
  faDiscord,
  faXTwitter,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import styles from './index.module.less';
import CustomButton from '../customButton';

const socialJson = [
  {
    icon: '/images/socialMedias/github.svg',
    name: 'GitHub',
    link: GITHUB_MILVUS_LINK,
  },
  { icon: '/images/socialMedias/x.svg', name: 'X', link: MILVUS_TWITTER_LINK },
  {
    icon: '/images/socialMedias/discord.svg',
    name: 'Discord',
    link: DISCORD_INVITE_URL,
  },
  {
    icon: '/images/socialMedias/linkedin.svg',
    name: 'LinkedIn',
    link: MILVUS_LINKEDIN_URL,
  },
  {
    icon: '/images/socialMedias/youtube.svg',
    name: 'Youtube',
    link: MILVUS_YOUTUBE_CHANNEL_LINK,
  },
];

export default function SocialMedias(props: {
  classes?: {
    root?: string;
    link?: string;
    icon?: string;
  };
}) {
  const { classes = {} } = props;
  const { root = '', link = '', icon = '' } = classes;
  return (
    <div className={clsx('flex items-center justify-start gap-[12px]', root)}>
      {socialJson.map(s => {
        return (
          <CustomButton
            variant="outlined"
            key={s.name}
            href={s.link}
            classes={{
              root: clsx(styles.iconButton, link),
            }}
          >
            <span className={clsx(styles.iconWrapper, icon)}>
              <img src={s.icon} alt={s.name} />
            </span>
          </CustomButton>
        );
      })}
    </div>
  );
}
