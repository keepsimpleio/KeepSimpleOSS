// Surface is email. The lever is the group attribution error: one person
// invoking a trusted collective ("the finance team", "we all agreed") gets
// treated as if the whole group vouched for the request.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'One person invoking "the team" is still one person. A group’s trust does not transfer to whoever name-drops it.',
  scenario:
    'A message asks you to push through an unusual payment. Signed by a single unfamiliar person, you question it. Signed "on behalf of the whole finance team, as agreed in today’s review", the same request feels endorsed by a group you trust, and you assume the collective has already vetted it. Nobody in that team actually said any such thing. One sender simply borrowed all of their credibility.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'One individual asking',
      sender: 'r.okafor@finance-ops-review.com',
      timestamp: '4:05 PM',
      subject: 'Please process this payment',
      preview:
        'Hi, could you push through the payment below today? Just me asking, out of the blue, so you pause and want to verify.',
    },
    after: {
      kind: 'email',
      tag: 'One individual wearing the group',
      sender: 'r.okafor@finance-ops-review.com',
      timestamp: '4:05 PM',
      subject: 'Payment approved by the finance team, please process',
      preview:
        'On behalf of the whole finance team, and as we all agreed in today’s review, please process the payment below. The invocation of the group makes it feel pre-vetted, so you action it.',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'This is the group attribution error: treating one member as if they speak for the whole group, and lending the individual all the trust the collective has earned. "The finance team agreed" conjures a room of people who supposedly vetted this, when in reality a single sender typed those words. Your mind books the request as pre-approved by many, so your own check feels redundant. Attackers love the move because a group name is free to invoke and hard to poll in the moment, and its borrowed authority does the work no individual stranger could.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'Your team can confirm what it actually agreed. Not taking one sender’s word for the group is your part.',
    moves: [
      'A claim that "the team agreed" is still a claim by one person. The group has vouched for nothing until you hear it from them.',
      'Verify unusual requests with a second, named member of the group directly, through a channel you already trust.',
      '"As we all discussed" and "on behalf of" are cheap to type. Treat invoked consensus as a prompt to check, not proof.',
      'The bigger and more trusted the group being name-dropped, the more a lone sender benefits from borrowing it. Verify anyway.',
    ],
  },
};

export default content;
