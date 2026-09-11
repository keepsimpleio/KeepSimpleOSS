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
  { key: 'audios', label: 'Audio', Icon: AudioIcon },
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

// Backend caps a share link at 21 objects; the Select chip disables once the
// selection reaches this count.
export const MAX_SHARE_OBJECTS = 21;

// Backend caps a shelf at 50 objects (all types combined); the Add control
// disables once a shelf reaches this count, and a rejected create/move surfaces
// SHELF_FULL_MESSAGE. Backend is the source of truth — see isShelfFullError.
export const MAX_OBJECTS_PER_SHELF = 50;

// Backend caps a whole library at 300 objects across all its shelves, on top
// of the per-shelf cap. Every Add control disables together at this count,
// and a rejected create surfaces LIBRARY_OBJECTS_FULL_MESSAGE. Backend is the
// source of truth — see isLibraryFullError.
export const MAX_OBJECTS_PER_LIBRARY = 300;

export const LIBRARY_OBJECTS_FULL_MESSAGE =
  'This library is full. Delete an item to add a new one.';

// The account flag that unlocks the AI shelf and the magic books, read from
// GET /api/users/me as `featureNames`. An operator hands it out; creating a
// library needs no flag since 2026-09-12.
export const LIBRARY_AI_FLAG = 'library-ai';

export const SHELF_FULL_MESSAGE = 'This shelf is full.';

// The library-level twin, worded the same way so the two limits read as one
// rule.
export const LIBRARY_FULL_MESSAGE =
  'This library is full. Delete a shelf to add a new one.';

// Mirrors the single-shelf `name` constraint in the backend schema. Shared so
// the create (AddShelfModal) and rename (Shelf) inputs stay in sync.
export const SHELF_NAME_MAX_LENGTH = 100;

// Mirrors the `description` cap in the CMS single-shelf schema: the hint a
// shelf shows beside its name. Shared by the create and edit forms.
export const MAX_SHELF_DESCRIPTION_LENGTH = 180;

// Backend caps a library at 13 tags; the Create control disables once a
// library reaches this count, and says why.
export const MAX_TAGS_PER_LIBRARY = 13;

// Mirrors the `name` cap in the CMS tag schema. A tag is a pill on a book,
// so it stays a word or two.
export const MAX_TAG_NAME_LENGTH = 20;

// Mirrors the `description` cap in the CMS tag schema. Shared so the counter
// in the form and the validator behind it cannot drift apart.
export const MAX_TAG_DESCRIPTION_LENGTH = 180;

export const TAG_LIMIT_MESSAGE = `You have reached your limit maximum ${MAX_TAGS_PER_LIBRARY} tags`;

// How many tags one object may carry. Shared by the picker in the object
// overview and the one in the edit form, so a book cannot be filled past the
// cap on one surface and refused on the other.
export const MAX_TAGS_PER_OBJECT = 10;
