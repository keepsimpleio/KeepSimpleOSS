export type ShelfType = 'books' | 'videos' | 'audios';

export interface AddShelfModalProps {
  onClose: () => void;
  onAddShelf: (type: ShelfType, name: string) => void | Promise<void>;
}
