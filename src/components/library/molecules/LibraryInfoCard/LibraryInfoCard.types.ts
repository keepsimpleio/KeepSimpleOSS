export interface LibraryInfoCardProps {
  libraryName: string;
  about: string;
  bookCount: number;
  videoCount: number;
  songCount: number;
  /** Fades the glass background wash and border in on reveal. */
  isActive?: boolean;
  className?: string;
}
