import { handleMixpanelClick } from '../../lib/mixpanel';

export const socialMediaLinks = [
  {
    alt: 'linktree',
    href: 'https://linktr.ee/1_',
    imgLink: '/assets/logos/linktree.svg',
    width: 105,
    height: 32,
    id: 4,
    handleClick: () =>
      // TODO - Mary test this event after release
      handleMixpanelClick(
        'LinkTree Link Clicked',
        'Homepage > LinkTree',
        'Homepage',
        'LinkTree',
      ),
  },
  {
    alt: 'telegram',
    href: 'https://t.me/productmanager',
    imgLink: '/assets/logos/tg.svg',
    width: 30,
    height: 30,
    id: 4,
  },
  {
    alt: 'instagram',
    href: 'https://www.instagram.com/talmud',
    imgLink: '/assets/logos/instagram.svg',
    width: 30,
    height: 30,
    id: 4,
  },
  {
    alt: 'x',
    href: 'https://x.com/AlexanyanWolf',
    imgLink: '/assets/logos/x.svg',
    width: 30,
    height: 30,
    id: 4,
  },
  {
    alt: 'linkedin',
    href: 'https://www.linkedin.com/in/alexanyan/',
    imgLink: '/assets/logos/linkedin.svg',
    width: 30,
    height: 30,
    id: 4,
  },
];
