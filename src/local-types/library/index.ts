// Shareable types

import { ShelfType } from '@/components/molecules/AddShelfModal';

export type {
  HomeLibraryCardView,
  StrapiLibrariesResponse,
  StrapiSingleLibraryResponse,
  StrapiLibraryEntry,
  StrapiLibraryAttributes,
  StrapiSingleShelfEntry,
  StrapiPaginationMeta,
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
