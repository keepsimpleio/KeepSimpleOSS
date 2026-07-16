// No quoted figures by policy. One recovery-themed email, two emotional
// states. Before = a calm day, the lure reads as an obvious phish.
// After = the same email during a real, publicly visible outage — the
// anxious state retrieves anxiety-congruent memories ("last outage IT
// did send links") and the fake feels remembered rather than read.
// `priorContext` carries the incident; the email itself must not change.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'On a quiet morning, “restore your access” is an obvious phish — you archive it without a second look. During a real outage, with the status page red and Slack on fire, the identical email feels like exactly the message you were waiting for.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'Calm day — reflex fires',
      sender: 'access-recovery@vpn-servicedesk-restore.com',
      timestamp: 'Tue, 9:04 AM',
      subject: 'Your VPN access was interrupted — restore now',
      preview:
        'We detected an interruption on your account. Use the recovery link below to restore your VPN access and avoid losing your session.',
    },
    after: {
      kind: 'email',
      tag: 'Mid-outage — reflex silent',
      sender: 'access-recovery@vpn-servicedesk-restore.com',
      timestamp: 'Tue, 9:04 AM',
      priorContext:
        'The VPN is genuinely down. The status page is red, Slack is a wall of “is it just me?” — and this lands in the middle of it.',
      subject: 'Your VPN access was interrupted — restore now',
      preview:
        'We detected an interruption on your account. Use the recovery link below to restore your VPN access and avoid losing your session.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Your current mood decides which memories volunteer themselves. Calm, you recall the phishing briefings — and the email pattern-matches to “scam.” Anxious mid-outage, your brain preferentially serves up anxiety-flavored memories: past incidents, IT scrambling, recovery emails that were real. Against that backdrop the same lure stops looking alien and starts looking like a continuation of what’s already happening — not read and evaluated, but recognized and expected. Attackers know this, which is why real outages, breaches in the news, and tax season are their favorite send windows: the panic does the pre-selling.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter — here’s your homework.',
    moves: [
      'Incident time is phishing prime time. The moment something is publicly broken, expect lures dressed as the fix — attackers read the same status pages you do.',
      'During an outage, the status page and your IT channel are the only navigation. A recovery link that arrives by email is guilty until proven otherwise, no matter how well it fits the moment.',
      '“This is exactly what I needed right now” is a feeling, not a verification. The better an email matches your current stress, the more deliberately it should be checked.',
      'Real recovery flows almost never need your password through an emailed link. When access returns, it returns through the tools you already have — not through a form the crisis conveniently delivered.',
    ],
  },
};

export default content;
