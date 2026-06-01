import type { ILibrary } from '@local-types/library/library';

export interface EditLibraryModalProps {
  className?: string;
  library: ILibrary;
  onClose: () => void;
  onSaved?: (library: ILibrary) => void;
}
