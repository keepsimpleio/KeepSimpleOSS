// Open ring with a centre dot: the arc that does not close back on itself,
// drawn in the same 18x18 / #515151 language as the other ToolHeader icons.
const ArcOfSelfIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.25 3.37A6.5 6.5 0 1 0 12.25 14.63L11.5 13.33A5 5 0 1 1 11.5 4.67L12.25 3.37Z"
      fill="#515151"
    />
    <path d="M9 7.4A1.6 1.6 0 1 0 9 10.6A1.6 1.6 0 1 0 9 7.4Z" fill="#515151" />
  </svg>
);

export default ArcOfSelfIcon;
