// Single source of truth for whether the Offensive Cybersecurity (OffSec)
// use-case is exposed. It is hidden in production: the `#offsec` deep link,
// the localStorage flag, and the switcher rows must all be inert when
// NEXT_PUBLIC_ENV === 'prod' so users cannot open it by any path.
export const isOffsecEnabled = process.env.NEXT_PUBLIC_ENV !== 'prod';
