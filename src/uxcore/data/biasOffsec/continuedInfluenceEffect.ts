// Surface is a team chat. The lever is the continued influence effect: a
// false claim keeps steering behaviour even after it is corrected, so the
// version that embeds deeply survives the retraction and still gets acted on.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A correction rarely erases the false fact it corrected. If a claim ever lodged in your head, keep checking whether you are still acting on it.',
  scenario:
    'A message in your team channel says the payroll portal has moved to a new address. Later, IT posts a correction: it was fake, ignore it. If the original was a throwaway line, you drop it. If it arrived with authority and detail and got repeated, the correction never fully dislodges it, and next month you type the fake address from memory anyway.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'A claim that never embedded',
      senderName: 'unknown',
      senderHandle: '#general · guest account',
      timestamp: 'Mon, 11:02 AM',
      body: 'fyi payroll portal moved, new link is newpay-portal.co',
    },
    after: {
      kind: 'chat',
      tag: 'A claim that lodged deep',
      senderName: 'unknown',
      senderHandle: '#general · guest account',
      timestamp: 'Mon, 11:02 AM',
      priorContext:
        'It arrived styled as an official IT notice, with a ticket number, and two more people "confirmed" it in replies before the correction landed.',
      body: 'OFFICIAL: Payroll portal has migrated to newpay-portal.co, effective today (ref IT-4471). Please update your bookmarks before your next sign-in.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the continued influence effect. Once a piece of information is stored, a later correction does not delete it, it just adds a competing note beside it. Under time pressure or from memory, the original often wins, especially if it arrived vivid, detailed, and repeated. The retraction fixes the record but not the reflex. That is why attackers invest in making the false claim land hard and land often: even a debunk leaves a residue they can harvest weeks later, when you reach for the address you "remember".',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can post the correction. Making sure it actually overwrites the lie is on you.',
    moves: [
      'When something is corrected, do not just note the retraction, actively replace the false detail with the right one, out loud or in writing.',
      'Reach critical destinations from your own saved bookmark or the intranet, never from memory of a message, especially a corrected one.',
      'Be wary of claims that arrive with authority props and echo replies. That packaging is built to outlive the debunk.',
      'If a false "fact" ever circulated, assume it left a residue. Re-check your habits for a while after, not just once.',
    ],
  },
};

export default content;
