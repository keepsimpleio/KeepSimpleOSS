export type ShelfType = 'books' | 'videos' | 'audios';

export interface AddShelfModalProps {
  onClose: () => void;
  onAddShelf: (type: ShelfType, name: string) => void | Promise<void>;
  // Names of shelves that already exist in this library — used to warn on a
  // duplicate before hitting the backend (shelf names must be unique).
  existingNames?: string[];
}
