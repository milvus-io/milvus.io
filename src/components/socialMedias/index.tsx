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
  { icon: faGithub, link: GITHUB_MILVUS_LINK },
  { icon: faXTwitter, link: MILVUS_TWITTER_LINK },
  { icon: faDiscord, link: DISCORD_INVITE_URL },
  { icon: faLinkedinIn, link: MILVUS_LINKEDIN_URL },
  { icon: faYoutube, link: MILVUS_YOUTUBE_CHANNEL_LINK },
];

export default function SocialMedias(props: {
  classes?: {
    root?: string;
    link?: string;
  };
}) {
  const { classes = {} } = props;
  const { root = '', link = '' } = classes;
  return (
    <div className={clsx('flex items-center justify-start gap-[12px]', root)}>
      {socialJson.map(s => {
        return (
          <CustomButton
            variant="outlined"
            key={s.link}
            href={s.link}
            classes={{
              root: clsx(styles.iconButton, link),
            }}
          >
            <FontAwesomeIcon className={styles.iconWrapper} icon={s.icon} />
          </CustomButton>
        );
      })}
    </div>
  );
}
