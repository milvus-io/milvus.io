export const ArrowRightAltIcon = (props: { size?: number; color?: string }) => {
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
        d="M2 7L12.7244 7M12.7244 7L7.57669 12.1477M12.7244 7L7.5767 1.85228"
        stroke="#00131A"
        stroke-width="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
