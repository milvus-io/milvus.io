export const DownArrowIcon = (props: { size?: number; color?: string }) => {
  const { size = 14, color = '#00131A' } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path d="M13.3295 6L9.08688 10.2426L4.84424 6" stroke={color} />
    </svg>
  );
};
