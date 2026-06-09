import type { ILibrary } from '@local-types/library/library';

export interface EditLibraryModalProps {
  className?: string;
  // Null when the owner has create permission but hasn't created a library yet —
  // the modal bootstraps one on first save.
  library: ILibrary | null;
  onClose: () => void;
  // Receives the resolved library id (existing, or freshly created on save) so
  // the caller can reload by direct id instead of the restricted owner filter.
  onSaved?: (libraryId: number) => void;
}
