// Mode: interactive. The surface is a post in a channel of your peers that
// dares the expert to prove their skill on the attacker's artifact: "bet you
// can't spot the flaw in this, real reversers will see it in seconds, sample
// is attached, run it and tell me what it does". The lever is illusory
// superiority, the belief that you are sharper than the average target. The
// dare turns that self-image into engagement, and running the sample to show
// off is the payload executing. Ego, not fear.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: "A post that dares you to prove your skill by opening or running the poster's file on your own machine is recruiting your ego to detonate the payload for them.",
  scenario:
    'A post lands in a channel of people whose competence you respect. It dares the room to spot the flaw in an attached build: real reversers will see it in thirty seconds, rookies will just say it looks fine. You know you are good at this, better than most who fall for scams, so the pull is to run it and show them. That pull is the whole attack. The one who wins is the one who convinces the sharpest person in the room to execute the file themselves.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'chat',
      senderName: 'kernel_ghost',
      senderHandle: '@kernelghost',
      timestamp: '14:19',
      body: 'Bet none of you can spot what this build actually does. Real reversers will call it in 30 seconds. Rookies will say it looks clean. Sample attached, run it and tell me what it does.',
      attachment: 'crackme_v3.bin',
    },
    question: 'The post dares you to prove you can crack it. Do you?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label: 'Download it and run it to prove I can spot what it does',
        trap: true,
        outcome:
          'Trap. You believed you were sharper than whoever this was aimed at, so running it felt like a demonstration, not a risk. The build was the whole point, and executing it on your machine was the answer the poster was fishing for. The payload does not care how good your analysis would have been. It ran the moment your pride answered the dare.',
      },
      {
        label:
          'Load it into my disassembler to show them up without running it',
        outcome:
          'Still on their terms. Opening an untrusted file in your everyday tooling on your working machine is engaging with an artifact chosen by a stranger, and a malicious sample can exploit the parser that opens it. Whatever you do next, you accepted a dare designed to make you handle the file at all.',
      },
      {
        label:
          'Do not answer the dare; if I analyze unknown samples it is in a disposable isolated environment, on my terms',
        safe: true,
        outcome:
          'Safe. You noticed the post was borrowing your ego to move the file onto your machine. Analyzing an unknown binary is something you do in a throwaway isolated environment when you choose to, never to win an argument with a stranger. The dare was the only test that mattered, and refusing it is passing.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is illusory superiority, the well-documented tendency to rate yourself above average at almost everything, technical judgement included. The more skilled you actually are, the more certain you feel that a trap aimed at the careless could not catch you, and that certainty is what the dare exploits. By framing the artifact as a test only the sharp will pass, the attacker turns your self-image into a motive: staying out feels like conceding you are not as good as you think, and engaging feels like proving you are. The confidence that normally protects you gets inverted into the thing that puts the file on your machine. It targets experts precisely because experts are the ones sure they are immune. Pride, not fear, does the persuading.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Team policy can route unknown-sample analysis into approved isolated tooling so the choice never rides on a dare. Declining the challenge when one lands is the part only you can do.',
    moves: [
      'A post that dares you to prove your skill by running or opening its file is aiming at your ego. The competence being flattered is the lever, not a compliment.',
      'Notice the specific pull: "I am too good to be caught by this" is the belief being exploited, so treat that thought as a warning, not a shield.',
      'Handling the artifact at all is the goal. There is no "just peek at it to show I can" that is not you moving the attacker\'s file onto your machine.',
      'If analyzing unknown code is your job, it happens in a disposable isolated environment you control, on your schedule, never to answer a stranger who called you out.',
    ],
  },
};

export default content;
