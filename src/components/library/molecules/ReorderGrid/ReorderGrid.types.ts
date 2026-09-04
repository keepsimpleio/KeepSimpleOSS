export type ReorderItemShape = 'square' | 'landscape';

export interface ReorderItem {
  id: string;
  title: string;
  coverUrl?: string;
  isCurrent?: boolean;
  // Tags carried by the object, so a consumer can show the sequence through a
  // single tag's lens. Order itself is per-shelf, never per-tag.
  tagIds?: number[];
}

export interface ReorderGridProps {
  items: ReorderItem[];
  onReorder: (next: ReorderItem[]) => void;
  onAddPlaceholder?: () => void;
  itemShape?: ReorderItemShape;
  className?: string;
  emptyState?: string;
}
