export interface LibraryInfoCardProps {
  libraryName: string;
  about: string;
  bookCount: number;
  videoCount: number;
  songCount: number;
  /** Drives the glass background/blur fade-in so it ramps instead of popping. */
  isActive?: boolean;
  className?: string;
}
