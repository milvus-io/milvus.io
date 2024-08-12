export * from './RightTopArrow';
export * from './DownArrow';
export * from './SocialMedia';
import { FC } from 'react';

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

export const InfoFilled = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12.0006" cy="12.0001" r="10.2857" fill="#4FC4F9" />
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
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="10" fill="#E8EAEE" />
    <path d="M9.29999 9H10.7V14H9.29999V9Z" fill="black" />
    <path d="M9.3 6.39999H10.7V7.79999H9.3V6.39999Z" fill="black" />
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
      fill="white"
    />
    <path
      d="M2 8.6546V12.6546C2 13.7592 2.89543 14.6546 4 14.6546H12C13.1046 14.6546 14 13.7592 14 12.6546V8.6546H12.6667V12.6546C12.6667 13.0228 12.3682 13.3213 12 13.3213H4C3.63181 13.3213 3.33333 13.0228 3.33333 12.6546V8.6546H2Z"
      fill="white"
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
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 4H6.5C5.11929 4 4 5.11929 4 6.5V16"
      stroke="#1D2939"
      strokeWidth="2"
    />
    <path
      d="M19.5 8H8.5C8.22386 8 8 8.22386 8 8.5V19.5C8 19.7761 8.22386 20 8.5 20H19.5C19.7761 20 20 19.7761 20 19.5V8.5C20 8.22386 19.7761 8 19.5 8Z"
      stroke="#1D2939"
      strokeWidth="2"
    />
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
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_446_5013)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 0.5C3.1325 0.5 0 3.6325 0 7.5C0 10.5975 2.00375 13.2137 4.78625 14.1413C5.13625 14.2025 5.2675 13.9925 5.2675 13.8088C5.2675 13.6425 5.25875 13.0913 5.25875 12.505C3.5 12.8288 3.045 12.0763 2.905 11.6825C2.82625 11.4812 2.485 10.86 2.1875 10.6937C1.9425 10.5625 1.5925 10.2387 2.17875 10.23C2.73 10.2212 3.12375 10.7375 3.255 10.9475C3.885 12.0062 4.89125 11.7088 5.29375 11.525C5.355 11.07 5.53875 10.7638 5.74 10.5887C4.1825 10.4137 2.555 9.81 2.555 7.1325C2.555 6.37125 2.82625 5.74125 3.2725 5.25125C3.2025 5.07625 2.9575 4.35875 3.3425 3.39625C3.3425 3.39625 3.92875 3.2125 5.2675 4.11375C5.8275 3.95625 6.4225 3.8775 7.0175 3.8775C7.6125 3.8775 8.2075 3.95625 8.7675 4.11375C10.1063 3.20375 10.6925 3.39625 10.6925 3.39625C11.0775 4.35875 10.8325 5.07625 10.7625 5.25125C11.2087 5.74125 11.48 6.3625 11.48 7.1325C11.48 9.81875 9.84375 10.4137 8.28625 10.5887C8.54 10.8075 8.75875 11.2275 8.75875 11.8837C8.75875 12.82 8.75 13.5725 8.75 13.8088C8.75 13.9925 8.88125 14.2113 9.23125 14.1413C11.9963 13.2137 14 10.5887 14 7.5C14 3.6325 10.8675 0.5 7 0.5Z"
        fill="#00131A"
      />
    </g>
    <defs>
      <clipPath id="clip0_446_5013">
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
