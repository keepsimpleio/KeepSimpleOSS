// No quoted figures by policy: sums stay directional ("a sum too small
// to escalate"). Both sides are the document surface: two invoices from
// the same invented vendor. Before = week one, the deliberately odd
// llama-branded invoice with no ask. After = week three, the follow-up
// that cashes in the recall: "the llama folks" now feel like an
// existing relationship. The lever: memorable gets misread as familiar,
// and familiar as an actual business relationship.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'Week one: an invoice arrives with a llama mascot, a cheerful font, and a sum too small to escalate. No urgency, no demand. Just weird enough to show a colleague, laugh, and archive. Week three: "the llama folks" send their quarterly invoice with updated bank details. And somehow they feel like a vendor you know.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'document',
      tag: 'Week 1, the odd one',
      docLabel: 'Invoice',
      logo: '🦙',
      title: 'Andes Logistics: vendor profile activation',
      meta: 'Invoice AND-114 · one-time onboarding',
      body: 'Vendor profile activation fee. Payable at your convenience, no action required this quarter. We look forward to working with your team.',
      footer: 'Total: a sum too small to question, too odd to forget.',
    },
    after: {
      kind: 'document',
      tag: 'Week 3, the "familiar" one',
      docLabel: 'Invoice',
      logo: '🦙',
      title: 'Andes Logistics: quarterly services',
      meta: 'Invoice AND-289 · note: banking details updated',
      priorContext:
        'You remember the llama instantly. Nobody remembers signing a contract, but that is not the part memory checks.',
      body: 'Quarterly services as agreed. Please note our banking details have changed. Updated account information is attached for this and future payments.',
      footer: 'Attachment: "Updated payment details.pdf"',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Weird things stick in memory. A llama on an invoice outlives a hundred beige PDFs. The trap is what your brain does with that recall later: "I remember these people" silently upgrades to "we work with these people". Recognition starts doing the job that a contract, a purchase order, and an accounts-payable record are supposed to do. The first invoice was never meant to be paid. It was meant to be remembered. Three weeks later, the second invoice collects on that memory, together with the real payload: new bank details.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter, here is your homework.',
    moves: [
      'Memorable is not the same as real. Before paying "again", check the ledger: was this vendor ever onboarded, contracted, or paid before? If the only record is your memory of a mascot, there is no record.',
      'A tiny first invoice with no payment pressure is a known setup move. It exists to create history. Odd, low-stakes, no-ask documents from unknown senders deserve a report, not an archive.',
      'Bank-details changes get verified by a callback to the number from the signed contract. That rule does not care how familiar the sender feels. Familiarity is exactly what the attacker spent three weeks making.',
      'Make "funny" a trigger for process, not comfort. The moment a vendor is memorable enough to joke about, it is memorable enough to look up in accounts payable.',
    ],
  },
};

export default content;
