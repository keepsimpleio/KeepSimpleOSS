import type { ILibrary } from '@/types/library';

export interface EditLibraryModalProps {
  className?: string;
  library: ILibrary;
  onClose: () => void;
  onSaved?: (library: ILibrary) => void;
}
