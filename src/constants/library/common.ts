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
