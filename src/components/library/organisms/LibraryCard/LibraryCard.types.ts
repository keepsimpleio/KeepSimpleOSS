export interface LibraryCardProps {
  id: number | string;
  username?: string;
  libraryName: string;
  description: string;
  bookCount: number;
  videoCount: number;
  songCount: number;
  avatar?: string;
  /** Cover URLs for the card's mini-shelf; empty or absent hides the shelf. */
  coverUrls?: string[];
  /** Index into the shared pigment cycle for the header's wash accent. */
  accent?: number;
}
