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
