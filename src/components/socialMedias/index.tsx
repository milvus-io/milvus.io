import {
  DISCORD_INVITE_URL,
  GITHUB_MILVUS_LINK,
  MILVUS_TWITTER_LINK,
  MILVUS_YOUTUBE_CHANNEL_LINK,
  MILVUS_LINKEDIN_URL,
} from '@/consts/links';
import clsx from 'clsx';

import styles from './index.module.less';
import CustomButton from '../customButton';
import {
  MediaGithub,
  MediaX,
  MediaDiscord,
  MediaLinkedIn,
  MediaYoutube,
} from '@/components/icons';

const socialJson = [
  {
    icon: <MediaGithub />,
    name: 'GitHub',
    link: GITHUB_MILVUS_LINK,
  },
  { icon: <MediaX />, name: 'X', link: MILVUS_TWITTER_LINK },
  {
    icon: <MediaDiscord />,
    name: 'Discord',
    link: DISCORD_INVITE_URL,
  },
  {
    icon: <MediaLinkedIn />,
    name: 'LinkedIn',
    link: MILVUS_LINKEDIN_URL,
  },
  {
    icon: <MediaYoutube />,
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
            variant="text"
            key={s.name}
            href={s.link}
            classes={{
              root: clsx(styles.iconButton, link),
            }}
          >
            {/* <span className={clsx(styles.iconWrapper, icon)}></span> */}
            {s.icon}
          </CustomButton>
        );
      })}
    </div>
  );
}
