// Mode: interactive. The reader clicks, and the pull to finish "one whole
// unit" does the work. Surface: a security-setup stepper reading "1 of 1 step
// remaining, finish now". The lever is unit bias: a single unstarted step
// feels like an unfinished job, and the urge to close it out drives the risky
// final action (grant access, read a code back). Completing the unit is the
// attack.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A "one step left" prompt is engineered so the step that remains is the dangerous one. The pull to finish the unit, not the merit of the step, is what moves your hand.',
  scenario:
    'A setup screen tells you your account is almost secured: two steps done, one left. The screen looks tidy and nearly done. The single action left is to approve a login or read a code out loud so the "final check" can complete. Finishing feels like housekeeping, so you reach to close it out.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'progress',
      title: 'Security setup',
      steps: [
        { label: 'Identity confirmed', state: 'done' },
        { label: 'Device registered', state: 'done' },
        { label: 'Approve final check to finish', state: 'active' },
      ],
      percent: 90,
      caption: 'One step left. Finish now to secure your account.',
    },
    question:
      'The last step wants you to approve a login prompt. What do you do?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label: 'Approve the prompt so the setup finally reads 100% complete',
        trap: true,
        outcome:
          'Trap. The prompt is the attacker signing in to your account right now, and your approval is the second factor they were missing. You approved it because one step left felt like an obligation to close, not because the step itself was safe. The near-full bar was the bait: it turned "authorize a login I did not start" into "finish the job".',
      },
      {
        label: 'Leave the step unfinished and check the account yourself first',
        safe: true,
        outcome:
          'Safe. An unfinished step is not a reason to complete a dangerous one. You refused to approve a login you did not begin and went to the account through your own address instead. The stepper had no power to secure anything; it existed to make the last, risky action feel like tidy completion.',
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is unit bias: we treat a single unit as a whole to be finished and feel a small, real discomfort at leaving one incomplete. A setup framed as "1 of 1 step remaining" turns an isolated, risky action into the last tile of a job, and the drive to close the job overrides the question of whether the action is safe at all. The attacker did not have to make the step look good, only to make it look like the only thing between you and done. Once completion is the goal, "approve this login" stops reading as "let a stranger in" and starts reading as "finish". The bias supplies the momentum; the payload just sits in the final slot.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can kill setup flows that ask for live approvals. Refusing to finish a unit just because it is unfinished is the part only you can do.',
    moves: [
      'Judge the last step on its own action: "approve a login I did not start" is the same risk whether it is step one or the final tile.',
      'A near-complete bar is a lever, not a status. Attackers place the payload in the last slot precisely because you want to close it.',
      'A real security setup never asks you to approve a sign-in you did not just initiate, or to read a code back to anyone.',
      'When a flow insists "one step remaining, finish now", that urgency is the tell. Stop, and reach the account through your own trusted path.',
    ],
  },
};

export default content;
