/**
 * The Security view's one clock.
 *
 * A single dot falls from the outermost ring to the centre, and each ring
 * lights as the dot crosses it. Both used to be guessed at separately, the
 * dot on an SMIL animation and the rings on their own CSS timing, so the
 * light never quite matched the contact. Here the trajectory is solved once
 * and everything reads from it: the dot's position, its fade in and out, and
 * how brightly each ring is lit at this instant.
 *
 * Ported from the Terminal Atlas, revision 64, which took the composition
 * from this page and worked the passage out properly.
 */

/** The six rings, outermost first, as fractions of the canvas half-width. */
export const securityRadii = [0.95, 0.8, 0.65, 0.5, 0.36, 0.22];

/** One fall, in milliseconds. */
export const passageDuration = 6500;

const clamp = (value: number) => Math.max(0, Math.min(1, value));

// The ease the dot falls on, as a cubic bezier solved parametrically: x is
// time, y is distance covered.
const bezierX = (s: number) =>
  3 * (1 - s) * (1 - s) * s * 0.4 + 3 * (1 - s) * s * s * 0.6 + s * s * s;
const bezierY = (s: number) => 3 * (1 - s) * s * s + s * s * s;

/** The parameter at which `fn` reaches `value`, by bisection. */
function invert(fn: (s: number) => number, value: number): number {
  let low = 0;
  let high = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    if (fn(mid) < value) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

/** When the dot reaches each ring, in milliseconds from the start of a fall. */
export const crossingTimes = securityRadii.map(
  radius => bezierX(invert(bezierY, 1 - radius / 0.95)) * passageDuration,
);

export interface PassageState {
  /** The dot's y in the SVG's user units. */
  cy: number;
  /** The dot's own fade in and out. */
  opacity: number;
  /** How lit each ring is right now, outermost first, 0..1. */
  rings: number[];
}

/** Where the passage stands at `elapsed` milliseconds. */
export function securityPassage(elapsed: number): PassageState {
  const time =
    ((elapsed % passageDuration) + passageDuration) % passageDuration;
  const fraction = time / passageDuration;
  const position = bezierY(invert(bezierX, fraction));
  // Every ring is dark again before the next fall begins.
  const reset = clamp((passageDuration - time) / 240);
  return {
    cy: -712.5 * (1 - position),
    opacity: Math.min(clamp(fraction / 0.08), clamp((1 - fraction) / 0.08)),
    rings: crossingTimes.map(crossing => {
      const t = clamp((time - crossing) / 160);
      return t * t * (3 - 2 * t) * reset;
    }),
  };
}
