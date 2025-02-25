export * from './RightTopArrow';
export * from './DownArrow';
export * from './SocialMedia';
import { FC, HTMLAttributes } from 'react';

// theme: 'colorful' | 'white' | 'black'
export const NewZilliz = ({
  id,
  theme = 'colorful',
  className,
}: {
  id: string;
  theme: 'colorful' | 'white' | 'black';
  className?: string;
}) => {
  const backgroundColor = 'transparent';
  const color = theme === 'white' ? '#fff' : '#000';
  const fill =
    theme === 'colorful' ? `url(#${id})` : theme === 'white' ? '#fff' : '#000';
  return (
    <svg
      width="97"
      height="40"
      viewBox="0 0 97 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_4874_3768)">
        <rect width="97" height="40" fill={backgroundColor} />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.6541 27.0547V39.7949H21.1413V24.5393L27.7546 35.9938C28.503 35.6278 29.2221 35.2111 29.9074 34.7483L22.6675 22.2084L30.641 25.1105C31.0007 24.3705 31.2862 23.5877 31.4879 22.7719L27.007 21.141H39.7949V18.6538H24.5381L35.9936 12.04C35.6276 11.2916 35.2109 10.5725 34.748 9.8872L22.2832 17.0838L25.1605 9.1786C24.4221 8.81536 23.6406 8.52618 22.8259 8.32075L21.1413 12.9492V0H18.6541V15.257L12.04 3.80101C11.2916 4.16702 10.5725 4.58369 9.88716 5.04654L17.0968 17.534L9.17163 14.6495C8.80943 15.3884 8.52133 16.1702 8.31702 16.9852L12.9015 18.6538H1.08717e-07L0 21.141H15.2559L3.80081 27.7546C4.16682 28.503 4.58348 29.2221 5.04633 29.9074L17.6089 22.6545L14.6995 30.6478C15.44 31.0066 16.2231 31.291 17.0392 31.4915L18.6541 27.0547Z"
          fill={fill}
        />
        <rect
          x="46.0625"
          y="12.4359"
          width="11.3415"
          height="2.48718"
          fill={color}
        />
        <rect
          x="85.3599"
          y="12.4359"
          width="11.3415"
          height="2.48718"
          fill={color}
        />
        <rect
          x="67.0542"
          y="6.66563"
          width="2.68615"
          height="20.6933"
          fill={color}
        />
        <rect
          x="61.085"
          y="12.4359"
          width="2.68615"
          height="14.9231"
          fill={color}
        />
        <rect
          width="2.68615"
          height="2.68615"
          transform="matrix(1 0 0 -1 61.085 9.35179)"
          fill={color}
        />
        <rect
          x="45.7642"
          y="24.8718"
          width="11.9385"
          height="2.48718"
          fill={color}
        />
        <path
          d="M45.7642 24.8718L54.2216 14.9231L57.4042 14.9231L48.9467 24.8718L45.7642 24.8718Z"
          fill={color}
        />
        <path
          d="M85.0615 24.8718L93.519 14.9231L96.7015 14.9231L88.2441 24.8718L85.0615 24.8718Z"
          fill={color}
        />
        <rect
          x="73.0234"
          y="6.66563"
          width="2.68615"
          height="20.6933"
          fill={color}
        />
        <rect
          x="85.0615"
          y="24.8718"
          width="11.9385"
          height="2.48718"
          fill={color}
        />
        <rect
          x="78.9927"
          y="12.4359"
          width="2.68615"
          height="14.9231"
          fill={color}
        />
        <rect
          width="2.68615"
          height="2.68615"
          transform="matrix(1 0 0 -1 78.9927 9.35179)"
          fill={color}
        />
      </g>
      <defs>
        <linearGradient
          id={id}
          x1="8.45641"
          y1="4.2282"
          x2="29.0503"
          y2="37.6061"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9D41FF" />
          <stop offset="0.468794" stopColor="#2858FF" />
          <stop offset="0.770884" stopColor="#29B8FF" />
          <stop offset="1" stopColor="#00F0FF" />
        </linearGradient>
        <clipPath id="clip0_4874_3768">
          <rect width="97" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const Triangle = () => (
  <svg
    width="6"
    height="8"
    viewBox="0 0 6 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.95543 3.71583C5.21224 3.91602 5.21224 4.30434 4.95543 4.50452L1.41022 7.26808C1.21321 7.42165 0.925781 7.28127 0.925781 7.03147L0.925781 1.18888C0.925781 0.939083 1.21321 0.798698 1.41022 0.952271L4.95543 3.71583Z"
      fill="#D0D6DF"
    />
  </svg>
);

export const OutLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      fill="#647489"
      d="M8,12a1,1,0,0,0,1,1h6a1,1,0,0,0,0-2H9A1,1,0,0,0,8,12Zm2,3H7A3,3,0,0,1,7,9h3a1,1,0,0,0,0-2H7A5,5,0,0,0,7,17h3a1,1,0,0,0,0-2Zm7-8H14a1,1,0,0,0,0,2h3a3,3,0,0,1,0,6H14a1,1,0,0,0,0,2h3A5,5,0,0,0,17,7Z"
    />
  </svg>
);

export const InfoFilled = (props?: { color?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12.0006"
      cy="12.0001"
      r="10.2857"
      fill={props.color || '#4FC4F9'}
    />
    <path
      d="M11.1431 9.42704H12.8574L12.8574 7.71275H11.1431L11.1431 9.42704Z"
      fill="white"
    />
    <path d="M11.1431 16.2842H12.8574V11.1413H11.1431V16.2842Z" fill="white" />
  </svg>
);

export const ToolTipFilled = () => (
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10.1194" r="9" fill="#D0D7DC" />
    <path d="M9.30005 9.1194H10.7V14.1194H9.30005V9.1194Z" fill="#00131A" />
    <path
      d="M9.30006 6.51939H10.7001V7.91939H9.30006V6.51939Z"
      fill="#00131A"
    />
  </svg>
);

export const DownloadIcon = () => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.33333 10.9879V10.9307L4.86193 8.45934L5.80474 7.51653L7.33333 9.04513V2.6546H8.66667V9.04513L10.1953 7.51653L11.1381 8.45934L8.66667 10.9307V10.9879H8.60948L8 11.5974L7.39052 10.9879H7.33333Z"
      fill="#000"
    />
    <path
      d="M2 8.6546V12.6546C2 13.7592 2.89543 14.6546 4 14.6546H12C13.1046 14.6546 14 13.7592 14 12.6546V8.6546H12.6667V12.6546C12.6667 13.0228 12.3682 13.3213 12 13.3213H4C3.63181 13.3213 3.33333 13.0228 3.33333 12.6546V8.6546H2Z"
      fill="#000"
    />
  </svg>
);

export const Fork = () => (
  <svg
    aria-hidden="true"
    height="16"
    viewBox="0 0 16 16"
    version="1.1"
    width="16"
    data-view-component="true"
  >
    <path
      fillRule="evenodd"
      d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
    ></path>
  </svg>
);

export const Star = () => (
  <svg
    aria-hidden="true"
    height="16"
    viewBox="0 0 16 16"
    version="1.1"
    width="16"
    data-view-component="true"
  >
    <path
      fillRule="evenodd"
      d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"
    ></path>
  </svg>
);

export const checkIconTpl = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path 
      fill="#000000" 
      d="M18.71,7.21a1,1,0,0,0-1.42,0L9.84,14.67,6.71,11.53A1,1,0,1,0,5.29,13l3.84,3.84a1,1,0,0,0,1.42,0l8.16-8.16A1,1,0,0,0,18.71,7.21Z"
    />
  </svg>
`;

// copy icon of code block
export const copyIconTpl = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3.33301 4V13.3333C3.33301 13.5101 3.40325 13.6797 3.52827 13.8047C3.65329 13.9298 3.82286 14 3.99967 14H10.6663M12.6663 4V11.3333H5.99967V2H10.6663L12.6663 4Z" stroke="#667176" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

export const linkIconTpl = `
  <svg
    aria-hidden="true"
    focusable="false"
    height="20"
    version="1.1"
    viewBox="0 0 16 16"
    width="16"
  >
    <path
      fill="#0092E4"
      fillRule="evenodd"
      d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
    ></path>
  </svg>
`;

export const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="2" fill="black"></rect>
    <rect x="2" y="11" width="20" height="2" fill="black"></rect>
    <rect x="2" y="17" width="20" height="2" fill="black"></rect>
  </svg>
);

export const CloseIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.77917 9.19349L0.00210416 16.9706L1.41632 18.3848L9.19339 10.6077L16.9706 18.3849L18.3848 16.9707L10.6076 9.19349L18.3869 1.41421L16.9727 0L9.19339 7.77928L1.41421 0.000103474L0 1.41432L7.77917 9.19349Z"
      fill="black"
    />
  </svg>
);

export const ExternalDocLinkIcon = () => (
  <svg
    width="24"
    height="24"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 11.9976C14 9.5059 11.683 7 8.85714 7C8.52241 7 7.41904 7.00001 7.14286 7.00001C4.30254 7.00001 2 9.23752 2 11.9976C2 14.376 3.70973 16.3664 6 16.8714C6.36756 16.9525 6.75006 16.9952 7.14286 16.9952"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 11.9976C10 14.4893 12.317 16.9952 15.1429 16.9952C15.4776 16.9952 16.581 16.9952 16.8571 16.9952C19.6975 16.9952 22 14.7577 22 11.9976C22 9.6192 20.2903 7.62884 18 7.12383C17.6324 7.04278 17.2499 6.99999 16.8571 6.99999"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const RightArrow = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.15234 1.9999L9.15234 6.9999L4.15234 11.9999L5.00087 12.8484L10.8494 6.9999L5.00087 1.15137L4.15234 1.9999Z"
      fill="black"
    />
  </svg>
);

export const CopyIcon: React.FC<{ color?: string }> = ({ color }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.55 15H7.2C6.95147 15 6.75 14.7985 6.75 14.55V7.2C6.75 6.95147 6.95147 6.75 7.2 6.75H14.55C14.7985 6.75 15 6.95147 15 7.2V14.55C15 14.7985 14.7985 15 14.55 15Z"
      stroke={color || '#667176'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.25 6.75V3.45C11.25 3.20147 11.0485 3 10.8 3H3.45C3.20147 3 3 3.20147 3 3.45V10.8C3 11.0485 3.20147 11.25 3.45 11.25H6.75"
      stroke={color || '#667176'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CheckIcon: React.FC<{ color?: string }> = ({ color }) => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 14 14">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.5496 4.02068L5.52 11.591L1.46967 7.54067L2.53033 6.48001L5.47999 9.42967L11.4504 3L12.5496 4.02068Z"
      fill={color || '#1D2939'}
    ></path>
  </svg>
);

export const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="currentColor"
  >
    <g clipPath="url(#clip0_3441_111)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 0C3.1325 0 0 3.1325 0 7C0 10.0975 2.00375 12.7137 4.78625 13.6413C5.13625 13.7025 5.2675 13.4925 5.2675 13.3088C5.2675 13.1425 5.25875 12.5913 5.25875 12.005C3.5 12.3288 3.045 11.5763 2.905 11.1825C2.82625 10.9812 2.485 10.36 2.1875 10.1937C1.9425 10.0625 1.5925 9.73875 2.17875 9.73C2.73 9.72125 3.12375 10.2375 3.255 10.4475C3.885 11.5062 4.89125 11.2088 5.29375 11.025C5.355 10.57 5.53875 10.2638 5.74 10.0887C4.1825 9.91375 2.555 9.31 2.555 6.6325C2.555 5.87125 2.82625 5.24125 3.2725 4.75125C3.2025 4.57625 2.9575 3.85875 3.3425 2.89625C3.3425 2.89625 3.92875 2.7125 5.2675 3.61375C5.8275 3.45625 6.4225 3.3775 7.0175 3.3775C7.6125 3.3775 8.2075 3.45625 8.7675 3.61375C10.1063 2.70375 10.6925 2.89625 10.6925 2.89625C11.0775 3.85875 10.8325 4.57625 10.7625 4.75125C11.2087 5.24125 11.48 5.8625 11.48 6.6325C11.48 9.31875 9.84375 9.91375 8.28625 10.0887C8.54 10.3075 8.75875 10.7275 8.75875 11.3837C8.75875 12.32 8.75 13.0725 8.75 13.3088C8.75 13.4925 8.88125 13.7113 9.23125 13.6413C11.9963 12.7137 14 10.0887 14 7C14 3.1325 10.8675 0 7 0Z"
      />
    </g>
    <defs>
      <clipPath id="clip0_3441_111">
        <rect width="14" height="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const RightWholeArrow: React.FC<{ color?: string; size?: number }> = ({
  color,
  size = 14,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 7L12.7244 7M12.7244 7L7.57669 12.1477M12.7244 7L7.5767 1.85228"
      stroke={color || '#00131A'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

export const LoadingIcon = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24">
    <path
      d="M18.861 16.1166C17.4619 18.4433 14.9127 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12H22C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C15.6409 22 18.8274 20.0542 20.5762 17.1457L18.861 16.1166Z"
      fill="#1D2939"
    ></path>
  </svg>
);

export const TOCIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 13H12" stroke="black" strokeWidth="1.5" />
    <path d="M0 9H6" stroke="black" strokeWidth="1.5" />
    <path d="M0 5H12" stroke="black" strokeWidth="1.5" />
  </svg>
);

export const ThumbUpIcon: FC<{ color?: string }> = ({ color = '#4C5A67' }) => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.1519 14.4027L13.9744 7.95428C14.003 7.85327 14.0077 7.74701 13.9882 7.64386C13.9688 7.54071 13.9257 7.44348 13.8623 7.3598C13.7989 7.27613 13.717 7.20829 13.623 7.16163C13.5289 7.11497 13.4254 7.09074 13.3204 7.09087H9.42419C9.36833 7.09087 9.3132 7.07827 9.26289 7.05401C9.21258 7.02974 9.16839 6.99444 9.13362 6.95073C9.09884 6.90702 9.07438 6.85602 9.06205 6.80155C9.04972 6.74707 9.04984 6.69051 9.0624 6.63609L9.23209 5.90164C9.38753 5.22795 9.43742 4.5339 9.38007 3.84493L9.34884 3.47058C9.31539 3.06898 9.14067 2.69223 8.85571 2.40727C8.59505 2.14655 8.2415 2.00006 7.87283 2H7.79138C7.5684 2 7.36306 2.12082 7.25514 2.31563L6.3527 3.93962C5.94813 4.66796 5.34506 5.26644 4.61365 5.66543L2.35365 6.89742C2.2465 6.95589 2.1571 7.04216 2.09486 7.14716C2.03263 7.25217 1.99986 7.37201 2 7.49407V14.2181C2 14.3981 2.07151 14.5708 2.19881 14.6981C2.32611 14.8254 2.49876 14.8969 2.67878 14.8969H11.4985C11.6463 14.8968 11.7901 14.8485 11.908 14.7594C12.0258 14.6702 12.1117 14.5449 12.1519 14.4027Z"
      stroke={color}
      strokeWidth="1.14286"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ThumbDownIcon: FC<{ color?: string }> = ({
  color = '#4C5A67',
}) => (
  <svg
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.2945 2.04591L14.117 8.49435C14.1455 8.59536 14.1503 8.70162 14.1308 8.80477C14.1114 8.90792 14.0683 9.00515 14.0049 9.08883C13.9415 9.1725 13.8596 9.24034 13.7655 9.287C13.6715 9.33367 13.5679 9.35789 13.463 9.35776H9.56677C9.32783 9.35776 9.15135 9.57972 9.20497 9.81254L9.37467 10.547C9.53011 11.2207 9.58 11.9147 9.52264 12.6037L9.49142 12.978C9.45797 13.3797 9.28325 13.7564 8.99828 14.0414C8.73762 14.3021 8.38408 14.4486 8.01541 14.4486H7.93395C7.82456 14.4486 7.71716 14.4193 7.62289 14.3638C7.52861 14.3083 7.45087 14.2286 7.39771 14.133L6.49527 12.509C6.09066 11.7808 5.48759 11.1824 4.75623 10.7835L2.49622 9.55053C2.38928 9.49218 2.30001 9.40611 2.23779 9.30137C2.17556 9.19663 2.14268 9.07707 2.14258 8.95524V2.23054C2.14258 2.05052 2.21409 1.87787 2.34139 1.75057C2.46869 1.62327 2.64134 1.55176 2.82136 1.55176H11.6411C11.7889 1.5518 11.9327 1.60009 12.0505 1.68927C12.1684 1.77846 12.2543 1.90368 12.2945 2.04591Z"
      stroke={color}
      strokeWidth="1.14286"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ExternalLinkIcon: FC<{ color?: string }> = ({ color }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.99805 2.12061C8.75642 2.12061 8.56055 2.31648 8.56055 2.55811C8.56055 2.79973 8.75642 2.99561 8.99805 2.99561L11.5987 2.99561L7.80765 6.93926C7.6402 7.11345 7.64566 7.39041 7.81985 7.55786C7.99404 7.72531 8.27099 7.71985 8.43845 7.54566L12.1887 3.6445V5.92995C12.1887 6.17157 12.3846 6.36745 12.6262 6.36745C12.8678 6.36745 13.0637 6.17157 13.0637 5.92995V2.55811C13.0637 2.31648 12.8678 2.12061 12.6262 2.12061H8.99805Z"
      fill="#1D2939"
    />
    <path
      d="M3.74805 12.9706L10.748 12.9706C11.4729 12.9706 12.0605 12.383 12.0605 11.6581V8.11746C12.0605 7.87584 11.8647 7.67996 11.623 7.67996C11.3814 7.67996 11.1855 7.87584 11.1855 8.11746V11.6581C11.1855 11.8997 10.9897 12.0956 10.748 12.0956L3.74805 12.0956C3.50642 12.0956 3.31055 11.8997 3.31055 11.6581L3.31055 4.17996C3.31055 3.93834 3.50642 3.74246 3.74805 3.74246L6.81055 3.74246C7.05217 3.74246 7.24805 3.54658 7.24805 3.30496C7.24805 3.06334 7.05217 2.86746 6.81055 2.86746L3.74805 2.86746C3.02317 2.86746 2.43555 3.45509 2.43555 4.17996V11.6581C2.43555 12.383 3.02317 12.9706 3.74805 12.9706Z"
      fill="#1D2939"
    />
  </svg>
);

export const ArrowTop = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.18568 6.48628C8.42512 6.29038 8.76945 6.29038 9.00889 6.48628L14.5089 10.9863C14.7867 11.2136 14.8277 11.6231 14.6004 11.901C14.373 12.1788 13.9635 12.2198 13.6857 11.9924L8.59729 7.82919L3.50889 11.9924C3.23105 12.2198 2.82154 12.1788 2.59421 11.901C2.36689 11.6231 2.40784 11.2136 2.68568 10.9863L8.18568 6.48628Z"
      fill="#1D2939"
    />
  </svg>
);
export const TrendingIcon: FC<HTMLAttributes<SVGViewElement>> = props => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14 4.66675L9.47333 9.19341C9.41136 9.2559 9.33762 9.3055 9.25638 9.33934C9.17515 9.37319 9.08801 9.39061 9 9.39061C8.91199 9.39061 8.82486 9.37319 8.74362 9.33934C8.66238 9.3055 8.58864 9.2559 8.52667 9.19341L6.80667 7.47341C6.74469 7.41093 6.67096 7.36133 6.58972 7.32749C6.50848 7.29364 6.42134 7.27622 6.33333 7.27622C6.24533 7.27622 6.15819 7.29364 6.07695 7.32749C5.99571 7.36133 5.92198 7.41093 5.86 7.47341L2 11.3334"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.9997 7.33341V4.66675H11.333"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ClockIcon: FC<HTMLAttributes<SVGViewElement>> = props => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 2.5C11.4834 2.5 12.9334 2.93987 14.1668 3.76398C15.4001 4.58809 16.3614 5.75943 16.9291 7.12987C17.4968 8.50032 17.6453 10.0083 17.3559 11.4632C17.0665 12.918 16.3522 14.2544 15.3033 15.3033C14.2544 16.3522 12.918 17.0665 11.4632 17.3559C10.0083 17.6453 8.50032 17.4968 7.12987 16.9291C5.75943 16.3614 4.58809 15.4001 3.76398 14.1668C2.93987 12.9334 2.5 11.4834 2.5 10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66699 10.0002H10.0003V5.8335"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const RocketIcon: FC<HTMLAttributes<SVGViewElement>> = props => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.1997 11.8167C13.6188 12.7758 13.722 13.8434 13.4942 14.8651C13.2665 15.8868 12.7198 16.8096 11.933 17.5L9.58301 15.15"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.18333 6.79992C7.22416 6.38081 6.15654 6.27765 5.13486 6.50535C4.11319 6.73306 3.19042 7.27983 2.5 8.06659L4.85 10.4166"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.90828 15.6584C15.5749 10.8167 17.1416 5.6584 17.4916 3.4584C17.5129 3.32848 17.5031 3.19535 17.4631 3.06994C17.423 2.94453 17.3538 2.83039 17.2611 2.73689C17.1684 2.64339 17.0549 2.57318 16.9298 2.53201C16.8048 2.49085 16.6717 2.4799 16.5416 2.50007C14.3666 2.8584 9.16661 4.39174 4.34161 11.0917L8.90828 15.6584ZM7.24161 16.3251L8.42494 15.1417L4.85828 11.6001L3.67494 12.7834C3.51974 12.9395 3.43262 13.1507 3.43262 13.3709C3.43262 13.5911 3.51974 13.8023 3.67494 13.9584L6.04161 16.3251C6.19775 16.4803 6.40896 16.5674 6.62911 16.5674C6.84927 16.5674 7.06048 16.4803 7.21661 16.3251H7.24161Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SearchIcon: FC<HTMLAttributes<SVGViewElement>> = props => {
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.917 13.4165L15.8337 16.3332"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.16699 9.6665C4.16699 12.4279 6.40557 14.6665 9.16699 14.6665C10.5501 14.6665 11.8021 14.1049 12.7072 13.1973C13.6093 12.2929 14.167 11.0448 14.167 9.6665C14.167 6.90508 11.9284 4.6665 9.16699 4.6665C6.40557 4.6665 4.16699 6.90508 4.16699 9.6665Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const AirplaneArrowIcon: FC<HTMLAttributes<SVGViewElement>> = props => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 13.1621H9V11.1621H3V2.00781C3 1.73167 3.22386 1.50781 3.5 1.50781C3.58425 1.50781 3.66714 1.5291 3.74096 1.5697L22.2034 11.724C22.4454 11.8571 22.5337 12.1611 22.4006 12.4031C22.3549 12.4862 22.2865 12.5546 22.2034 12.6003L3.74096 22.7546C3.499 22.8877 3.19497 22.7994 3.06189 22.5575C3.02129 22.4836 3 22.4008 3 22.3165V13.1621Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const ListItemTickIcon: FC<HTMLAttributes<SVGViewElement>> = props => {
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1 10.1137L4.5 14.2224L11.5 7.83105"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
};

export const BreadcrumbIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="12"
    viewBox="0 0 13 12"
    fill="none"
  >
    <path
      d="M4.955 9L4.25 8.295L6.54 6L4.25 3.705L4.955 3L7.955 6L4.955 9Z"
      fill="#2E373B"
    />
  </svg>
);
