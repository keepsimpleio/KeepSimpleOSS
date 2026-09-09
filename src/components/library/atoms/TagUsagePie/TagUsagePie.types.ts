/** One tagged object, as the tag modal reads it off the library on screen. */
export interface TagUsageRow {
  id: number;
  title: string;
  shelf: string;
  /** The object's position on its shelf, counted from 1. */
  order: number;
}

export interface TagUsagePieProps {
  rows: TagUsageRow[];
  /** The tag's own colour: the chart is drawn in it and nothing else. */
  color: string;
  className?: string;
}
