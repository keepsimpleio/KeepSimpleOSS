import { ILibraryCard, TShelfCard } from '@local-types/library';

import {
  ArticlesIcon,
  AudioIcon,
  BookIcon,
  CompanyIcon,
  LibraryIcon,
  ToolsIcon,
  UxcoreIcon,
  VideoIcon,
} from '@icons/library/svg';

// Frontend gate for the Library feature. Only the exact string 'true' enables
// it; unset/'false'/anything else stays disabled so a typo can't ship it to prod.
export const isLibraryEnabled = (): boolean =>
  process.env.NEXT_PUBLIC_ENABLE_LIBRARY === 'true';

export const title = 'Library';

export const KEEPSIMPLE_URL = 'https://keepsimple.io';

export const librariesData: ILibraryCard[] = Array.from(
  { length: 60 },
  (_, i) => ({
    id: `Library ${i + 1}`,
    name: `Library ${i + 1}`,
    description: `Description for Library ${i + 1}. A great collection of various media types.`,
    objects: {
      books: Math.floor(Math.random() * 100),
      music: Math.floor(Math.random() * 50),
      videos: Math.floor(Math.random() * 30),
    },
    slug: `library-${i + 1}`,
  }),
);

export const shelfCardData: TShelfCard[] = [
  { key: 'books', label: 'Books', Icon: BookIcon },
  { key: 'videos', label: 'Videos', Icon: VideoIcon },
  { key: 'audios', label: 'Audios', Icon: AudioIcon },
];

export const navigationData: {
  label: string;
  Icon: React.ElementType;
  href: string;
}[] = [
  {
    label: 'UX Core',
    Icon: UxcoreIcon,
    href: '/',
  },
  {
    label: 'Company Management',
    Icon: CompanyIcon,
    href: '/',
  },
  {
    label: 'Library',
    Icon: LibraryIcon,
    href: '/',
  },
  {
    label: 'Tools',
    Icon: ToolsIcon,
    href: '/',
  },
  {
    label: 'Articles',
    Icon: ArticlesIcon,
    href: '/',
  },
];

export const LIBRARY_SHELVES_REFETCH_EVENT = 'library-shelves-refetch';

// Backend caps a library at 21 shelves; the Add shelf control disables once a
// library reaches this count.
export const MAX_SHELVES_PER_LIBRARY = 21;
