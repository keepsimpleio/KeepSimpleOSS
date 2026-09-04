import type { ObjectType } from '@local-types/library/object';

export type CoverShape = 'portrait' | 'landscape' | 'square';

export interface ObjectOverviewTypeConfig {
  /** Modal header — "Book overview", etc. */
  modalTitle: string;
  /** Section label, e.g. "Book description". */
  descriptionLabel: string;
  /** Description placeholder when empty. */
  descriptionEmpty: string;
  /** Left-column cover aspect ratio. */
  coverShape: CoverShape;
  /** Whether to render the Source / Duration row beneath the cover. */
  showSourceDurationRow: boolean;
  /** Book only — show the rating box on the right column. */
  showRatingBox: boolean;
  /** Title for the post-delete success popup. */
  deleteSuccessTitle: string;
  /** Text for the post-delete success popup. */
  deleteSuccessText: string;
  /**
   * Schema-level title length cap from `docs/object-api.md` (per-type).
   * Enforced client-side because the backend gate is currently no-op.
   */
  titleMaxLength: number;
}

export const overviewConfigByType: Record<
  ObjectType,
  ObjectOverviewTypeConfig
> = {
  book: {
    modalTitle: 'Book overview',
    descriptionLabel: 'Book description',
    descriptionEmpty: 'No description yet',
    coverShape: 'portrait',
    showSourceDurationRow: false,
    showRatingBox: true,
    deleteSuccessTitle: 'Book deleted',
    deleteSuccessText: 'The book has been removed from the library.',
    titleMaxLength: 200,
  },
  video: {
    modalTitle: 'Video overview',
    descriptionLabel: 'Video description',
    descriptionEmpty: 'No description yet',
    coverShape: 'landscape',
    showSourceDurationRow: true,
    showRatingBox: false,
    deleteSuccessTitle: 'Video deleted',
    deleteSuccessText: 'The video has been removed from the library.',
    titleMaxLength: 150,
  },
  audio: {
    modalTitle: 'Audio overview',
    descriptionLabel: 'Audio description',
    descriptionEmpty: 'No description yet',
    coverShape: 'square',
    showSourceDurationRow: true,
    showRatingBox: false,
    deleteSuccessTitle: 'Audio deleted',
    deleteSuccessText: 'The audio has been removed from the library.',
    titleMaxLength: 150,
  },
};
