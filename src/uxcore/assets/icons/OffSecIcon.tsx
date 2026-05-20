// Hexens logo — bold X framed by top-left and bottom-right corner
// brackets. Reproduced as SVG from the hexens.io brand mark. Uses
// `currentColor` so the host row's `color` cascade decides the fill,
// which lets dark mode invert it to white without a second asset.
// Two exports kept for parity with the PM/HR icon pair, but they
// share the same body — the wrapping span on the "grey" variant lets
// callers visually flag the inactive state if needed.
const HexensMark = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* top-left bracket */}
    <path d="M2 2 H9 V5 H5 V9 H2 Z" />
    {/* bottom-right bracket */}
    <path d="M22 22 H15 V19 H19 V15 H22 Z" />
    {/* X — two diagonal bars meeting at center */}
    <path d="M6.4 6.4 L9.2 6.4 L17.6 17.6 L14.8 17.6 Z" />
    <path d="M14.8 6.4 L17.6 6.4 L9.2 17.6 L6.4 17.6 Z" />
  </svg>
);

export const OffSecIcon = () => <HexensMark />;
export const OffSecIconGrey = () => <HexensMark />;
