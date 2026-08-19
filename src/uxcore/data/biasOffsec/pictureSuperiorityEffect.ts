// No quoted figures by policy. Before = a plain chat post (words plus a
// link) in a facilities channel, where text triggers the trained
// caution. After = the poster surface: a clean printed sheet with a QR
// code in the office kitchen. A picture on paper, inheriting the
// building's trust. The QR pattern in the component is decorative,
// never scannable. The lever is the medium: image plus physical object
// bypass the scrutiny that text attracts.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  tell: 'A QR code is a link with the URL torn off, and a wall authenticates nobody. Anything printed that asks you to scan deserves the same scrutiny you would give those words in a message.',
  scenario:
    'As a message with a link, "new canteen menu, click here" gets side-eyed and reported. As a clean printed poster by the coffee machine, logo in the corner, QR code in the middle, it gets scanned all morning. Nobody has ever been trained to distrust paper.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'chat',
      tag: 'As words with a link',
      senderName: 'Building Services',
      senderHandle: '#facilities · posted by a new account',
      timestamp: 'Mon, 8:45 AM',
      body: 'The kitchen menu has moved online. Browse this week’s dishes and daily specials here: building-canteen-menu.com',
    },
    after: {
      kind: 'poster',
      tag: 'As a poster in the kitchen',
      priorContext:
        'Same destination. Printed, laminated, and taped up next to the coffee machine overnight.',
      heading: 'New: canteen menu is online 🍜',
      body: 'Scan to browse this week’s dishes and daily specials, updated every morning.',
      qrCaption: 'Point your camera · takes two seconds',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Pictures are processed faster, trusted more, and remembered longer than words. A physical object carrying a picture also inherits the trust of the space it hangs in. Your fraud detector was trained on text: sender names, suspicious phrasing, hover the link. A poster has none of those handles, so the detector never engages. The laminated sheet reads as "the building said so". And the QR code is the perfect accomplice: it is a link rendered as an image, which means a link you cannot read. The chat version showed you the URL and asked for trust. The poster hides the URL and simply receives it.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter, here is your homework.',
    moves: [
      'A QR code is a link you cannot read. Give it the link treatment, not the picture treatment: after scanning, read the full URL your camera previews before opening anything.',
      'Paper is unauthenticated. Anyone with a printer can put a professional poster on a wall. "It is physically inside our office" is a feeling of trust, not a source of it.',
      'For anything a poster promises (menus, Wi-Fi, parking, HR surveys), type the address you already know or use the official app. A poster can advertise a destination. It cannot certify one.',
      'A QR that leads to a login form or an app install is your cue to stop cold. If a laminated sheet in a kitchen is asking for credentials, someone designed it so that sentence never gets said out loud.',
    ],
  },
};

export default content;
