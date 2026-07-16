// No quoted figures by policy. Before = the email surface: the same
// lure as text plus a link, where words trigger the trained fraud
// detector. After = the poster surface: a clean printed sheet with a QR
// code in the office kitchen — a picture on paper, inheriting the
// building's trust. The QR pattern in the component is decorative,
// never scannable. The lever is the medium: image + physical object
// bypass the scrutiny that text attracts.

import type { OffsecBiasContent } from './types';

const content: OffsecBiasContent = {
  scenario:
    'As an email — “new canteen menu, click here” — half the office side-eyes it and one person reports it. As a clean printed poster by the coffee machine, logo in the corner, QR code in the middle, it gets scanned all morning. Nobody has ever been trained to distrust paper.',
  visualLabel: 'Scenario',
  visual: {
    before: {
      kind: 'email',
      tag: 'As words in an inbox',
      sender: 'facilities@building-services-notice.com',
      timestamp: 'Mon, 8:45 AM',
      subject: 'New: canteen menu is now online',
      preview:
        'The kitchen menu has moved online. Follow the link below to browse this week’s dishes and daily specials.',
    },
    after: {
      kind: 'poster',
      tag: 'As a poster in the kitchen',
      priorContext:
        'Same destination. Printed, laminated, and taped up next to the coffee machine overnight.',
      heading: 'New: canteen menu is online 🍜',
      body: 'Scan to browse this week’s dishes and daily specials — updated every morning.',
      qrCaption: 'Point your camera · takes two seconds',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Why it works',
  whyItWorks:
    'Pictures are processed faster, trusted more, and remembered longer than words — and a physical object carrying a picture inherits the trust of the space it hangs in. Your fraud detector was trained on text: sender addresses, suspicious phrasing, hover-the-link. A poster has none of those handles, so the detector never engages; the laminated sheet reads as “the building said so.” And the QR code is the perfect accomplice — it’s a link rendered as an image, which means a link you cannot read. The email version showed you the URL and asked for trust; the poster hides the URL and simply receives it.',
  defenseLabel: 'Protect yourself',
  defense: {
    lede: 'While your security team handles the perimeter — here’s your homework.',
    moves: [
      'A QR code is a link you can’t read — give it the link treatment, not the picture treatment. After scanning, read the full URL your camera previews before opening anything.',
      'Paper is unauthenticated. Anyone with a printer can put a professional poster on a wall, and “it’s physically inside our office” is a feeling of trust, not a source of it.',
      'For anything the poster promises — menus, Wi-Fi, parking, HR surveys — type the address you already know or use the official app. The poster can advertise a destination; it cannot certify one.',
      'A QR that leads to a login form or an app install is your cue to stop cold. If a laminated sheet in a kitchen is asking for credentials, someone designed exactly that sentence not to be said out loud.',
    ],
  },
};

export default content;
