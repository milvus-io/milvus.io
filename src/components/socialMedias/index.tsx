import {
  DISCORD_INVITE_URL,
  MILVUS_VIDEO_LINK,
  GITHUB_ATTU_LINK,
  GITHUB_MILVUS_CLI_LINK,
  GITHUB_MILVUS_LINK,
  MILVUS_TWITTER_LINK,
  MILVUS_YOUTUBE_CHANNEL_LINK,
  CLOUD_SIGNUP_LINK,
  GITHUB_MILVUS_BACKUP_LINK,
} from '@/consts/links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import {
  faGithub,
  faYoutube,
  faDiscord,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import styles from './index.module.less';
import CustomLink from '../customLink';

const socialJson = [
  { icon: faXTwitter, link: MILVUS_TWITTER_LINK },
  { icon: faGithub, link: GITHUB_MILVUS_LINK },
  { icon: faDiscord, link: DISCORD_INVITE_URL },
  { icon: faYoutube, link: MILVUS_YOUTUBE_CHANNEL_LINK },
];

export default function SocialMedias(props: { className?: string }) {
  const { className = '' } = props;
  return (
    <div className="flex items-center justify-between gap-[12px]">
      {socialJson.map(s => {
        return (
          <CustomLink
            variant="outlined"
            key={s.link}
            href={s.link}
            classes={{
              root: clsx(styles.iconButton, className),
            }}
          >
            <FontAwesomeIcon className={styles.iconWrapper} icon={s.icon} />
          </CustomLink>
        );
      })}
    </div>
  );
}
