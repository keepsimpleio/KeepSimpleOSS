// Surface is a security-update notification. The lever is the frame: the
// exact same action (install this "update") is refused when it reads as
// cost and hassle, accepted when the identical step reads as pure gain.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'Strip the adjectives and name the raw action out loud: "I am installing software from a pop-up". Judge that sentence, because the wording around it is free and changes nothing about what the file does.',
  scenario:
    'A prompt wants you to install a "critical security update", which is really a piece of attacker software. Framed one way it sounds like a chore that will interrupt your day, and you defer it. Framed the other way it sounds like one tap that protects everything, and you do it. The download is identical. Only the sentence around it changed.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'notification',
      tag: 'Framed as cost',
      appName: 'System Update',
      timestamp: 'now',
      title: 'Security update required',
      body: 'Installing will sign you out of all devices and may interrupt your work for several minutes. Begin update?',
    },
    after: {
      kind: 'notification',
      tag: 'Framed as gain',
      appName: 'System Update',
      timestamp: 'now',
      title: 'One tap to secure all your devices',
      body: 'Protect everything you are signed in to in a single step. Nothing to lose, fully secured in seconds. Tap to protect.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the framing effect. Identical facts produce opposite feelings depending on the words wrapped around them. "Sign you out of everything and interrupt your work" and "secure everything in one tap" describe the same event, but the first raises your guard and the second lowers it. Nothing about what the software does has changed, only the story it tells about itself. A gain frame invites the yes that a cost frame refused, which is why the dangerous version always speaks in the language of protection and ease.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team ships the real updates. Reading past the wording is on you.',
    moves: [
      'Wording is free and changes nothing about what the file does. Strip the adjectives and look at the raw action underneath.',
      'Name the actual step out loud: "I am installing software from a prompt" or "I am entering my password". Judge that, not the mood.',
      'Real updates arrive through your device’s managed channel, not a pop-up selling you a feeling. Verify the source, not the sentiment.',
      'The smoother and more reassuring the pitch, the more it is worth a second look. Ease is a sales technique, not a safety guarantee.',
    ],
  },
};

export default content;
