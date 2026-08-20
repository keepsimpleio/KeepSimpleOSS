// Mode: interactive. The surface is a browser page that dares you: "most
// people fail this security check, do you have what it takes to pass?" The
// lever is illusory superiority, the belief that you are better than average
// at spotting scams. The dare turns that ego into engagement, and to prove
// you are the sharp one you enter something you should never have entered.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A page that flatters your judgement and dares you to prove it is not testing you. It is recruiting your ego to do the clicking.',
  scenario:
    'A page frames itself as a hard security check that "only the top few percent" pass, then dares you to try. The bait here is pride, not fear. You think you are sharper than the people who fall for this, so you engage to prove it, and the very act of engaging is the win they wanted.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'browser',
      host: 'are-you-scam-proof.com',
      path: '/challenge',
      pageHeading: 'Most people fail this. Can you pass?',
      pageBody:
        'Only a small fraction of users are sharp enough to pass our security awareness check. Log in with your work account to take the challenge and see your score.',
    },
    question: 'What do you do?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label:
          'Take the challenge and log in with your work account to prove you can pass',
        trap: true,
        outcome:
          'Trap. The dare worked because you believed you were sharper than the average target, so proving it felt safe. The "challenge" had one question, and logging in was the answer they were harvesting. The people who "fail" are the ones who never logged in. You just graded yourself into their credential list.',
      },
      {
        label:
          'Take it, but use a throwaway detail to see how the test works first',
        outcome:
          'Still a loss on their terms. Engaging at all is the goal, and "I will just poke at it to show I can beat it" is the exact confidence the page is farming. Whatever you type, real or throwaway, you have accepted a dare from a page whose only purpose was to make you interact.',
      },
      {
        label: 'Close the tab and do not take the bait',
        outcome:
          'Safe. You noticed the page was flattering your judgement to borrow your ego. A real security check does not dare you or rank you against strangers to make you log in. Refusing a dare from an unknown page is how you pass the only test that mattered.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is illusory superiority, the well-documented tendency to rate yourself above average at almost everything, scam-spotting included. Most people believe they are harder to fool than the next person, which is statistically impossible and exactly what the attacker counts on. By framing the page as a test that most people fail, they turn your self-image into a motive: refusing feels like conceding you might be one of the many, and engaging feels like proving you are one of the few. The confidence that normally protects you gets inverted into the thing that pulls you in. The sharper you believe you are, the more the dare stings, and the more likely you are to answer it. Pride, not fear, does the persuading.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Filtering and awareness training reduce how often these dares reach you. Declining the dare when one lands is the part only you can do.',
    moves: [
      'A page that grades your judgement or dares you to prove it is manipulating your ego. Legitimate security never challenges you to log in to see how good you are.',
      'Notice the specific pull: "I am too smart to fall for this" is the belief being exploited, so treat that thought as a warning, not a shield.',
      'Interacting at all is the attacker\'s goal. There is no safe way to "just test" a page whose only purpose is to make you respond.',
      'Confidence in your judgement is best spent on the choice to walk away, not on the choice to engage and prove a point.',
    ],
  },
};

export default content;
