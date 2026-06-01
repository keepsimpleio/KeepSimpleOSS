export interface LibraryCardProps {
  id: number | string;
  username?: string;
  libraryName: string;
  description: string;
  bookCount: number;
  videoCount: number;
  songCount: number;
  avatar?: string;
}
