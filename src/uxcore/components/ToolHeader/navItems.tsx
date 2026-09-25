import ArcOfSelfIcon from '@uxcore/assets/icons/ArcOfSelfIcon';
import UXCatIcon from '@uxcore/assets/icons/UXCatIcon';
import UXCGIcon from '@uxcore/assets/icons/UXCGIcon';
import UXCoreIcon from '@uxcore/assets/icons/UXCoreIcon';
import UXCPIcon from '@uxcore/assets/icons/UXCPIcon';

export const navItems = [
  {
    label: 'UX Core',
    href: '/uxcore',
    page: 'uxcore',
    icon: <UXCoreIcon />,
  },
  {
    label: 'Guide',
    href: '/uxcg',
    page: 'uxcg',
    icon: <UXCGIcon />,
  },
  {
    label: 'Persona',
    href: '/uxcp',
    page: 'uxcp',
    icon: <UXCPIcon />,
  },
  {
    label: 'Awareness Test',
    href: '/uxcat',
    page: 'uxcat',
    icon: <UXCatIcon />,
  },
  {
    label: 'Bob - AI Assistant',
    href: 'https://chatgpt.com/g/g-BtuSiGF18-bob-bias-trickery-and-deception-by-uxcore-io/',
    page: '',
    icon: '',
    external: true,
  },
  {
    label: 'Arc of Self',
    href: 'https://arc-of-self.com/?uxcore',
    page: '',
    icon: <ArcOfSelfIcon />,
    external: true,
  },
];
