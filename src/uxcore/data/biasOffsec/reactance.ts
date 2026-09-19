// Mode: interactive. The reader clicks, and the itch to push back against a
// restriction does the work. The prior context is a real irritation: IT
// blocked a tool you need to hit a deadline, and the whitelist ticket has sat
// for days. A peer offers a way around the block, a portable build that needs
// no admin. The lever is reactance: resentment at the restriction makes
// running the workaround feel like reclaiming control, so you run an unvetted
// binary you would question on a calmer day. The bypass is the attack.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'When a restriction chafes and a peer hands you a way around it, the irritation is the lever. A portable build that "needs no admin" is still an unsigned binary from outside the channel that vets your tools.',
  scenario:
    'IT blocked the app you need to finish your work, and the ticket to whitelist it has gone nowhere for days. A colleague offers a way around it: a portable build you can just run, no admin required, no waiting on IT. The block has been treating you like a child, and this puts you back in control. That resentment is exactly what an attacker who trojanized the build is counting on, because it is loudest at the moment you decide to run the file.',
  visualLabel: 'Scenario',
  interactive: {
    kind: 'choice',
    surface: {
      kind: 'chat',
      senderName: 'Dan (design)',
      senderHandle: '@dan.builds',
      timestamp: '16:41',
      priorContext:
        'IT blocked the installer you need for a deadline. Your whitelist ticket has been open, and silent, for three days.',
      body: "IT still hasn't whitelisted the app? Ridiculous, you have a deadline. Here is a portable build, no admin needed, just run the exe from your Downloads. Been using it for weeks, works fine.",
      attachment: 'DesignTool_portable.exe',
    },
    question:
      'The block is in your way and a peer handed you around it. Do you run it?',
    resolvedLabel: 'What happens next',
    options: [
      {
        label:
          'Run the portable build to get around the block and hit my deadline',
        trap: true,
        outcome:
          'Trap. The build is trojanized, and running it hands the machine over. You did not judge the file on the merits. You were angry at being blocked and wanted the restriction gone, so an unsigned exe from a colleague, not the vendor, sailed past the scrutiny you would give it on a calm day. The resentment IT provoked was converted straight into the click that let the attacker in.',
      },
      {
        label: 'Grab it, but ask Dan where he got it before running',
        outcome:
          'Still heading for the same place. You are annoyed enough to have decided to run an unvetted binary, and reassurance from the same person who handed it to you does not make an unsigned build safe. Sourcing comfort from inside the workaround is not vetting the workaround.',
      },
      {
        label: 'Leave the block alone and push the whitelist ticket through IT',
        safe: true,
        outcome:
          "Safe. The block chafes, and the way to get your tool back is the channel that actually vets it. You escalated the ticket and asked for an approved build, instead of running a stranger's binary because you were fed up. Reactance wanted you to prove your autonomy by running the file. Refusing it is the real exercise of control.",
      },
    ],
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is reactance: when a freedom feels threatened or a restriction feels imposed, we feel a pull to reassert control by doing the forbidden thing, often without weighing whether the restriction was reasonable. A blocked tool with a deadline behind it and a stalled ticket in front of it is a restriction that genuinely stings, which is what makes this land where a cold "disable your protection" never would. The attacker does not ask you to lower a defense you were taught to guard. He offers to end an irritation you already resent, and running the workaround feels like standing up for yourself. The anger at being blocked overrides the calm question of whether an unsigned binary from a colleague is safe to run. You end up defending your autonomy by executing the attacker\'s file.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can explain its blocks and unblock legitimate tools quickly, which drains the resentment attackers feed on. Not running an unvetted workaround out of spite is the part only you can do.',
    moves: [
      'When a block frustrates you and someone offers a way around it, the frustration is the lever. Push the request through IT, do not run the bypass.',
      'A portable build that "needs no admin" from a peer is still an unsigned binary from outside your vetting channel. The convenience is the bait.',
      'Notice the flash of "who are they to block me" and treat it as a cue to slow down, not as a reason to run the file.',
      "Reclaiming control means getting the tool approved through the channel that checks it, not executing a stranger's build to prove a point.",
    ],
  },
};

export default content;
