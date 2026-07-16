// No quoted figures by policy — sums stay directional ("a sum too small
// to escalate"). Both sides are the document surface: two invoices from
// the same invented vendor. Before = week one, the deliberately odd
// llama-branded invoice with no ask — a memory implant, not a bill.
// After = week four, the follow-up that cashes in the recall: "the
// llama folks" now feel like an existing relationship. The lever is
// memorability being misread as familiarity, and familiarity as a
// business relationship.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'Week one: an invoice arrives with a llama mascot, a cheerful font, and a sum too small to escalate. No urgency, no payment demand — just weird enough to show a colleague, laugh, and archive. Week three: “the llama folks 🦙” send their quarterly invoice with updated bank details. And somehow, they feel like a vendor you know.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'document',
      tag: 'Week 1 — the odd one',
      docLabel: 'Invoice',
      logo: '🦙',
      title: 'Andes Logistics — vendor profile activation',
      meta: 'Invoice AND-114 · one-time onboarding',
      body: 'Vendor profile activation fee. Payable at your convenience — no action required this quarter. We look forward to working with your team.',
      footer: 'Total: a sum too small to question, too odd to forget.',
    },
    after: {
      kind: 'document',
      tag: 'Week 3 — the “familiar” one',
      docLabel: 'Invoice',
      logo: '🦙',
      title: 'Andes Logistics — quarterly services',
      meta: 'Invoice AND-289 · note: banking details updated',
      priorContext:
        'You remember the llama instantly. Nobody remembers signing a contract — but that’s not the part memory checks.',
      body: 'Quarterly services as agreed. Please note our banking details have changed — updated account information is attached for this and future payments.',
      footer: 'Attachment: “Updated payment details.pdf”',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Bizarre things are memory glue — a llama on an invoice outlives a hundred beige PDFs. The trap is what your brain does with that recall later: “I remember these people” gets silently upgraded to “we work with these people.” Recognition is doing the job that a contract, a purchase order, and an accounts-payable record are supposed to do. The first invoice was never meant to be paid; it was meant to be memorable. It’s a memory implant with a letterhead — and three weeks later, the second invoice harvests the implanted familiarity, plus the real payload: new bank details.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter — here’s your homework.',
    moves: [
      'Memorable is not the same as real. Before paying “again,” check the ledger: was this vendor ever onboarded, contracted, or paid before? If the only record is your recall of a mascot, there is no record.',
      'A tiny first invoice with no payment pressure is a known setup move — it exists to create history. Odd, low-stakes, no-ask documents from unknown senders deserve a report, not an archive.',
      'Bank-details changes are verified by callback to a number from the signed contract — a rule that doesn’t care how familiar the sender feels. Familiarity is precisely what the attacker spent three weeks manufacturing.',
      'Make “funny” a trigger for process, not comfort: the moment a vendor is memorable enough to joke about, it’s memorable enough to look up in accounts payable.',
    ],
  },
};

export default content;
