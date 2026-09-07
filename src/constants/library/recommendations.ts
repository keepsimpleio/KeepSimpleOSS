import type { IRecommendedBook } from '@local-types/library/recommendation';

export const RECOMMENDED_SHELF_NAME = 'AI Shelf';

/** Said on the shelf's settings control: the shelf is the owner's alone. */
export const RECOMMENDED_SHELF_HINT = 'Only you can see this shelf';

/** Shown on the board once every pick is banned or none arrived. */
export const RECOMMENDED_SHELF_EMPTY = 'Nothing to recommend right now.';

/** How many picks stand on the board at once. */
export const RECOMMENDED_SHELF_SIZE = 6;

/**
 * Stand-in picks while the recommendation engine is built. Real titles,
 * years and authors; the `reason` is a one-line description and `match` a
 * placeholder score, neither is the engine's verdict. The pool is deeper
 * than the board so a mocked Re-Generate has something to deal in. The
 * engine replaces this list wholesale.
 */
export const RECOMMENDED_SEED: IRecommendedBook[] = [
  {
    id: 'seed-thinking-fast-and-slow',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    year: 2011,
    match: 65,
    reason:
      'The two systems behind judgment and choice, from the psychologist who mapped most of the biases on this site.',
  },
  {
    id: 'seed-nudge',
    title: 'Nudge',
    author: 'Richard H. Thaler, Cass R. Sunstein',
    year: 2008,
    match: 55,
    reason:
      'Choice architecture as a discipline: how defaults and framing steer decisions without removing options.',
  },
  {
    id: 'seed-predictably-irrational',
    title: 'Predictably Irrational',
    author: 'Dan Ariely',
    year: 2008,
    match: 50,
    reason:
      'Experiments on pricing, ownership and expectations that show where rational models break.',
  },
  {
    id: 'seed-influence',
    title: 'Influence: The Psychology of Persuasion',
    author: 'Robert B. Cialdini',
    year: 1984,
    match: 48,
    reason:
      'Six levers of compliance, each traced to the field studies that exposed it.',
  },
  {
    id: 'seed-design-of-everyday-things',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    year: 1988,
    match: 40,
    reason:
      'Affordances, signifiers and the gulf of execution: the vocabulary product design still runs on.',
  },
  {
    id: 'seed-noise',
    title: 'Noise: A Flaw in Human Judgment',
    author: 'Daniel Kahneman, Olivier Sibony, Cass R. Sunstein',
    year: 2021,
    match: 39,
    reason:
      'Why two experts given the same case reach different answers, and what reduces the scatter.',
  },
  {
    id: 'seed-misbehaving',
    title: 'Misbehaving: The Making of Behavioral Economics',
    author: 'Richard H. Thaler',
    year: 2015,
    match: 37,
    reason:
      'How behavioural economics was argued into existence, one anomaly at a time.',
  },
  {
    id: 'seed-hooked',
    title: 'Hooked: How to Build Habit-Forming Products',
    author: 'Nir Eyal',
    year: 2014,
    match: 34,
    reason:
      'The trigger, action, reward, investment loop that product teams build habits on.',
  },
  {
    id: 'seed-art-of-thinking-clearly',
    title: 'The Art of Thinking Clearly',
    author: 'Rolf Dobelli',
    year: 2011,
    match: 31,
    reason: 'Ninety-nine short chapters, one systematic error of thought each.',
  },
  {
    id: 'seed-scarcity',
    title: 'Scarcity: Why Having Too Little Means So Much',
    author: 'Sendhil Mullainathan, Eldar Shafir',
    year: 2013,
    match: 29,
    reason:
      'What running short of money, time or attention does to the mind that is short of it.',
  },
  {
    id: 'seed-alchemy',
    title: 'Alchemy: The Surprising Power of Ideas That Don’t Make Sense',
    author: 'Rory Sutherland',
    year: 2019,
    match: 27,
    reason:
      'A case for psychological solutions where logical ones keep failing.',
  },
  {
    id: 'seed-the-undoing-project',
    title: 'The Undoing Project',
    author: 'Michael Lewis',
    year: 2016,
    match: 25,
    reason:
      'Kahneman and Tversky as a story: the friendship behind the research.',
  },
];
