// No quoted figures by policy. Both sides are the chat surface, same
// sender, same destination URL. Before = the bare pitch — a link with
// no emotional wrapper, and the suspicion reflex fires normally. After
// = the identical link riding a genuinely funny meme; the laugh
// disarms scrutiny and recruits the victim as a distributor. The lever
// is the emotional wrapper, never the link.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'A half-remembered conference contact DMs you a tool link — you side-eye it and move on. The same contact sends a genuinely funny industry meme first, and the same link right after. You’ve already forwarded the meme to two teammates before it occurs to you to wonder where the link goes.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'The pitch without the laugh',
      senderName: 'Deniz Aksoy',
      senderHandle: 'met at a conference · DM',
      timestamp: 'Wed, 4:12 PM',
      body: 'Hey! Found a tool that auto-generates client status reports — huge time-saver. Try it: reportninja-app.com',
    },
    after: {
      kind: 'chat',
      tag: 'The same link, wrapped in a laugh',
      senderName: 'Deniz Aksoy',
      senderHandle: 'met at a conference · DM',
      timestamp: 'Wed, 4:12 PM',
      attachment: '😂 agency-life-in-30-seconds.mp4',
      body: 'lmao this is our entire industry in one video 😭 the guy who made it has a whole collection — reportninja-app.com/memes',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Humor does two jobs at once, and both serve the attacker. First, it disarms: amusement and scrutiny compete for the same attention, and a brain mid-laugh audits nothing — the link arrives inside the warm glow the meme just bought. Second, it distributes: funny content is the only payload people forward voluntarily, at speed, to the exact colleagues who trust them. The suspicious version of this message dies in one chat; the funny version tours the whole team wearing your endorsement. Notice that nothing about the destination changed — only the feeling you had while not looking at it.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter — here’s your homework.',
    moves: [
      'Funny gets the same link hygiene as scary. Urgency and comedy are both emotional wrappers around a URL — inspect the address with the same cold eye regardless of which feeling delivered it.',
      'Laugh first, click never — or at least later, from a machine and moment where you’re actually looking. The meme is real entertainment; the link is a separate object with a separate reputation.',
      'Forwarding is vouching. The moment you pass a link along, your colleagues inherit your skipped check and add trust you never verified. Send the laugh if you must — strip the link.',
      'Be extra deliberate when comedy arrives paired with an ask or a URL from a weak tie. “Person I barely know + genuinely funny + here’s a link” is a delivery pattern, not a coincidence.',
    ],
  },
};

export default content;
