// Single source of truth for whether the Offensive Cybersecurity (OffSec)
// use-case is exposed. Work in progress: surfaced only on the dev preview,
// dark on staging/prod. The `#offsec` deep link, the persisted flag and the
// switcher rows must all be inert when this is false so users cannot open
// the layer by any path.
export const isOffsecEnabled =
  (process.env.NEXT_PUBLIC_ENV || '').toLowerCase() === 'dev';
