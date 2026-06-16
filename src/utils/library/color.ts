const SHORT_HEX = /^#([\da-f])([\da-f])([\da-f])$/i;
const FULL_HEX = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i;

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const trimmed = hex.trim();
  const short = SHORT_HEX.exec(trimmed);

  if (short) {
    return {
      r: parseInt(short[1] + short[1], 16),
      g: parseInt(short[2] + short[2], 16),
      b: parseInt(short[3] + short[3], 16),
    };
  }

  const full = FULL_HEX.exec(trimmed);

  if (full) {
    return {
      r: parseInt(full[1], 16),
      g: parseInt(full[2], 16),
      b: parseInt(full[3], 16),
    };
  }

  return null;
}

// YIQ-based contrast pick: dark text on bright bg, white on dark.
export function getContrastTextColor(background: string, darkColor = '#23221c'): string {
  const rgb = parseHex(background);

  if (!rgb) return '#ffffff';

  const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

  return yiq >= 150 ? darkColor : '#ffffff';
}
