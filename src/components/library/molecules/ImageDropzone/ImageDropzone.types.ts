export interface ImageDropzoneProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
  /** Remote URL of an existing image (e.g. edit mode). Shown when value is null. */
  existingPreviewUrl?: string;
  /** Fires when user clicks × while the existing-remote preview is shown (no File yet). */
  onClearExisting?: () => void;
  /** An image is being fetched for this slot (e.g. a cover pulled by autofill). */
  loading?: boolean;
  accept?: string[];
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}
