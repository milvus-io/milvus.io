export const RightTopArrowIcon = (props: { size?: number; color?: string }) => {
  const { size = 14, color = '#00131A' } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M3.5 11L11.0833 3.41669M11.0833 3.41669V10.6967M11.0833 3.41669H3.80333"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
