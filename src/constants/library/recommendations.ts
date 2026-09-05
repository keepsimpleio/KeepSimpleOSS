import type { IRecommendedBook } from '@local-types/library/recommendation';

export const RECOMMENDED_SHELF_NAME = 'Recommended for you';

/** Said beside the shelf name: the shelf is the owner's alone. */
export const RECOMMENDED_SHELF_HINT = 'Only you can see this shelf';

/** Shown on the board once every pick has been hidden or none arrived. */
export const RECOMMENDED_SHELF_EMPTY = 'Nothing to recommend right now.';

/**
 * Stand-in picks while the recommendation engine is built. Real titles,
 * years and authors; the `reason` is a one-line description, not the
 * engine's verdict. The engine replaces this list wholesale.
 */
export const RECOMMENDED_SEED: IRecommendedBook[] = [
  {
    id: 'seed-thinking-fast-and-slow',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    year: 2011,
    reason:
      'The two systems behind judgment and choice, from the psychologist who mapped most of the biases on this site.',
  },
  {
    id: 'seed-nudge',
    title: 'Nudge',
    author: 'Richard H. Thaler, Cass R. Sunstein',
    year: 2008,
    reason:
      'Choice architecture as a discipline: how defaults and framing steer decisions without removing options.',
  },
  {
    id: 'seed-predictably-irrational',
    title: 'Predictably Irrational',
    author: 'Dan Ariely',
    year: 2008,
    reason:
      'Experiments on pricing, ownership and expectations that show where rational models break.',
  },
  {
    id: 'seed-influence',
    title: 'Influence: The Psychology of Persuasion',
    author: 'Robert B. Cialdini',
    year: 1984,
    reason:
      'Six levers of compliance, each traced to the field studies that exposed it.',
  },
  {
    id: 'seed-design-of-everyday-things',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    year: 1988,
    reason:
      'Affordances, signifiers and the gulf of execution: the vocabulary product design still runs on.',
  },
  {
    id: 'seed-noise',
    title: 'Noise: A Flaw in Human Judgment',
    author: 'Daniel Kahneman, Olivier Sibony, Cass R. Sunstein',
    year: 2021,
    reason:
      'Why two experts given the same case reach different answers, and what reduces the scatter.',
  },
];
