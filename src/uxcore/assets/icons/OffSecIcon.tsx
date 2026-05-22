// Hexens brand mark (the real logo, served from /public/uxcore/hexens-logo.png).
// We render the bitmap as an <img> so the trademark stays pixel-faithful.
// Dark-mode inversion is handled by the consumer's stylesheet via a
// `filter: invert(1) brightness(2)` rule on `body.darkTheme` —
// see UXCoreModal.module.scss for the active-state colouring.
// Two exports kept for parity with the PM/HR icon pair.
const HexensMark = () => (
  <img
    src="/uxcore/hexens-logo.png"
    alt=""
    aria-hidden="true"
    width={18}
    height={18}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  />
);

export const OffSecIcon = () => <HexensMark />;
export const OffSecIconGrey = () => <HexensMark />;
