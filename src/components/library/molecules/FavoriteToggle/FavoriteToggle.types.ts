export interface FavoriteToggleProps {
  /** Whether the book is on the Favorites shelf. */
  favorite: boolean;
  /**
   * Owner's handler. Absent for a visitor: the star then only marks a
   * favorite and is not a control at all.
   */
  onToggle?: () => void;
  /** Book title, for the accessible name. */
  title: string;
  className?: string;
  /** In flight: the star ignores clicks until the save answers. */
  busy?: boolean;
}
