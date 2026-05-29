// Hexens brand mark, redrawn as SVG so it stays crisp at any size and
// inherits the host's text colour via `currentColor`. Geometry mirrors
// the 16×16 pixel reference: two diagonal "corner ticks" in the
// top-left and bottom-right plus an X formed by two diagonals through
// the middle. Two exports kept for parity with the PM/HR icon pair.
const HexensMark = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* top-left tick */}
    <line x1="1.5" y1="4.5" x2="4.5" y2="1.5" />
    {/* bottom-right tick */}
    <line x1="11.5" y1="14.5" x2="14.5" y2="11.5" />
    {/* X — two diagonals through the center */}
    <line x1="4.5" y1="4.5" x2="11.5" y2="11.5" />
    <line x1="11.5" y1="4.5" x2="4.5" y2="11.5" />
  </svg>
);

export const OffSecIcon = () => <HexensMark />;
export const OffSecIconGrey = () => <HexensMark />;
