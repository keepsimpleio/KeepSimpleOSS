export interface LibraryTreeNode {
  /** Shelf id — used to find the shelf's DOM node (`#shelf-<id>`). */
  id: number;
  /** Objects on the shelf — drives limb thickness and foliage density. */
  count: number;
}

export interface LibraryTreeProps {
  /** Visible shelves, in render order. */
  nodes: LibraryTreeNode[];
  /** Stable identity of the library (username or id) — seeds the tree. */
  seedKey: string;
  className?: string;
}
