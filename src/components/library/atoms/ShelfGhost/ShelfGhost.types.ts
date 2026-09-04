// Eight ways a book stands on a shelf. Placeholders only — abstract blocks in
// the shelf's own wood tones, never a drawn object with a face.
export type GhostKind =
  | 'upright'
  | 'tall'
  | 'thick'
  | 'thin'
  | 'leaning'
  | 'pair'
  | 'stack'
  | 'flat';

export interface ShelfGhostProps {
  kind: GhostKind;
  className?: string;
}
