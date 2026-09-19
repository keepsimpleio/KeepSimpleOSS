// Surface is an email: the same vulnerability warning, once from your own
// security team, once from an outside researcher. The lever is
// not-invented-here: work that comes from outside the tribe gets discounted
// for its origin, not its content. Attackers do not send the external report,
// they rely on it being ignored: an org that files researcher mail under
// "outside noise" leaves the reported hole open, and that dwell time is the
// exploit window.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: '"Not from our team" is not the same as "not true". The warning you dismiss for being external is the one an attacker is counting on you to shelve.',
  scenario:
    'The same finding lands twice. From your own security channel, "auth bypass in the client portal, patch today", it is actioned within the hour, no one asks who found it. From an outside researcher, word for word the same flaw with reproduction steps attached, it reads as unsolicited noise from someone with no standing, and it sits unanswered in the queue. The flaw does not care who reported it. Every week the external report sits unread is a week the portal stays open, and attackers scan for exactly the holes that organizations have already been told about and ignored.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'The finding, from your own team',
      sender: 'secops@yourco.com',
      timestamp: 'Mon, 10:05 AM',
      subject: 'Auth bypass in the client portal, patch today',
      preview:
        'We confirmed an authentication bypass in the client portal login flow. Apply the attached fix and rotate the affected keys today. Reproduction steps included.',
      attachment: 'fix-and-repro.md',
    },
    after: {
      kind: 'email',
      tag: 'The same finding, from outside',
      sender: 'j.reyes@kestrel-security-research.io',
      timestamp: 'Mon, 10:05 AM',
      priorContext:
        'Third unsolicited "vulnerability report" this year. The last two were consultants fishing for a contract, and this one is filed the same way before the first line is read.',
      subject: 'Vulnerability report: auth bypass in your client portal',
      preview:
        'I am an independent security researcher. Your client portal login flow contains an authentication bypass, reproduction steps attached. Please confirm receipt so I can coordinate disclosure.',
      attachment: 'repro-steps.md',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    "This is not-invented-here. Work from inside the tribe gets weighed on its content, work from outside gets weighed on its origin, and origin loses. The two emails carry the same flaw, the same reproduction steps, the same fix. The internal one inherits the team's standing and gets patched before lunch. The external one has to first prove the sender deserves to be read at all, and usually never gets that far. No attacker wrote either email. The attack is what happens in the gap: reported holes that stay open because the report wore the wrong return address. By the time the flaw resurfaces through an incident, the ignored mail is sitting in the queue as a timestamp of how long the door stood open.",
  defenseLabel: 'Protect yourself',
  defense: {
    lede: "Your team owns the disclosure process. Making sure an outside report cannot die unread in a queue is everyone's part.",
    moves: [
      'Judge a vulnerability report by whether it reproduces, never by who sent it. A working proof of concept from a stranger outranks a hunch from a colleague.',
      'Route external security mail to a monitored channel with an owner and a response deadline, so "unsolicited" cannot quietly become "unread".',
      'Treat "probably another consultant fishing" as a hypothesis to test with the reproduction steps, not a reason to skip them.',
      'Every ignored report is a timestamp an attacker can beat you to. Assume you were not the first to find out, and act on that clock.',
    ],
  },
};

export default content;
