// No quoted figures by policy. Surface is an SMS (chat card) on both
// sides, not email: same text message, two emotional states. Before = a
// calm day, the lure reads as an obvious scam. After = the same SMS
// during a real, publicly visible outage. The anxious state recalls
// anxiety-matching memories (past incidents, real recovery messages)
// and the fake feels expected. priorContext carries the incident; the
// message itself must not change.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'The message that fits your current stress perfectly is the one to check hardest. Attackers send during outages and crises because the moment does the convincing for them.',
  scenario:
    'On a quiet morning, a "restore your VPN access" text is an obvious scam and you delete it without thinking. During a real outage, with the status page red and Slack on fire, the identical text feels like exactly the message you were waiting for.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'Calm day, reflex fires',
      senderName: 'VPN ServiceDesk',
      senderHandle: 'SMS · unknown short code',
      timestamp: 'Tue, 9:04 AM',
      body: 'Your VPN access was interrupted. Restore it now to avoid losing your session: vpn-access-restore.com/verify',
    },
    after: {
      kind: 'chat',
      tag: 'Mid-outage, reflex silent',
      senderName: 'VPN ServiceDesk',
      senderHandle: 'SMS · unknown short code',
      timestamp: 'Tue, 9:04 AM',
      priorContext:
        'The VPN is genuinely down. The status page is red, Slack is a wall of "is it just me?", and this text lands in the middle of it.',
      body: 'Your VPN access was interrupted. Restore it now to avoid losing your session: vpn-access-restore.com/verify',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Your current mood decides which memories come to mind first. Calm, you recall the phishing briefings, and the text matches the "scam" pattern. Anxious during an outage, your brain serves up anxiety-flavored memories instead: past incidents, IT scrambling, recovery messages that were real. Against that backdrop the same text stops looking alien and starts looking like part of what is already happening. You do not read and evaluate it. You recognize and expect it. Attackers know this, which is why real outages, breaches in the news, and tax season are their favorite send windows. The stress does the pre-selling.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter, here is your homework.',
    moves: [
      'Incident time is phishing prime time. The moment something is publicly broken, expect lures dressed as the fix. Attackers read the same status pages you do.',
      'During an outage, the status page and your IT channel are the only navigation. A recovery link that arrives by text or email is guilty until proven otherwise, no matter how well it fits the moment.',
      '"This is exactly what I needed right now" is a feeling, not a verification. The better a message matches your current stress, the more deliberately it should be checked.',
      'Real recovery almost never needs your password through a link someone sent you. When access returns, it returns through the tools you already have, not through a form the crisis conveniently delivered.',
    ],
  },
};

export default content;
