import {
  DISCORD_INVITE_URL,
  GITHUB_MILVUS_LINK,
  MILVUS_TWITTER_LINK,
  MILVUS_YOUTUBE_CHANNEL_LINK,
  MILVUS_LINKEDIN_URL,
} from '@/consts/links';
import clsx from 'clsx';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import styles from './index.module.less';
import CustomButton from '../customButton';
import {
  MediaGithub,
  MediaX,
  MediaDiscord,
  MediaLinkedIn,
  MediaYoutube,
  MediaWechat,
  MediaBilibili,
  MediaGit,
} from '@/components/icons';
import { useRef, useState } from 'react';

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

export function SocialMedias(props: {
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

export const SocialMediasCN = (props: {
  classes?: {
    root?: string;
    link?: string;
    icon?: string;
  };
}) => {
  const { classes = {} } = props;

  const { root = '', link = '', icon = '' } = classes;

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popper' : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(previousOpen => !previousOpen);
  };

  const CNSocialJson = [
    {
      icon: <MediaWechat />,
      name: '微信',
      image: '/images/milvus-wechat-code.png',
      anchor: anchorEl,
    },
    {
      icon: <MediaBilibili />,
      name: 'BiliBili',
      link: 'https://space.bilibili.com/1058892339/upload/video',
    },
    {
      icon: <MediaGit />,
      name: 'GitHub',
      link: GITHUB_MILVUS_LINK,
    },
  ];

  return (
    <div
      className={clsx(
        'flex items-center justify-start gap-[12px] relative z-0',
        root
      )}
    >
      {CNSocialJson.map(s => {
        if (s.image) {
          return (
            <CustomButton
              variant="text"
              key={s.name}
              classes={{
                root: clsx(styles.cnIconButton, link),
              }}
              onMouseEnter={handleClick}
              onMouseLeave={handleClick}
            >
              {s.icon}
              <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                placement="top"
                modifiers={[
                  {
                    name: 'offset',
                    options: { offset: [0, 12] },
                  },
                ]}
              >
                <MilvusWechatQRCode image={s.image} name={s.name} />
              </Popper>
            </CustomButton>
          );
        }
        return (
          <CustomButton
            variant="text"
            key={s.name}
            href={s.link}
            classes={{
              root: clsx(styles.cnIconButton, link),
            }}
          >
            {s.icon}
          </CustomButton>
        );
      })}
    </div>
  );
};

export const MilvusWechatQRCode = (props: { image: string; name: string }) => (
  <div className={clsx(styles.popperContainer)}>
    <div className="bg-white p-[20px] rounded-[11px] flex flex-col items-center justify-center gap-[20px]">
      <img src={props.image} alt={props.name} className="w-[200px] h-[200px]" />
      <p className="text-[14px] leading-[20px] text-black1 font-[600]">
        扫一扫，加入 Milvus 交流群
      </p>
    </div>
  </div>
);
