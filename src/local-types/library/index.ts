// Shareable types

import { ShelfType } from '@components/library/molecules/AddShelfModal';

export type {
  HomeLibraryCardView,
  StrapiLibrariesResponse,
  StrapiLibraryAttributes,
  StrapiLibraryEntry,
  StrapiPaginationMeta,
  StrapiSingleLibraryResponse,
  StrapiSingleShelfEntry,
} from './library';

export interface ILibraryCard {
  name: string;
  description: string;
  objects: { books: number; music: number; videos: number };
  slug: string;
}

export type TShelfCard = {
  key: ShelfType;
  label: string;
  Icon: React.ElementType;
};
