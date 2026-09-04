import { z } from 'zod';

import type { ObjectType } from '@local-types/library/object';

const COVER_MAX_BYTES = 5 * 1024 * 1024;
const COVER_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const coverImageSchema = z
  .instanceof(File)
  .refine(
    f => COVER_MIME_TYPES.includes(f.type),
    'Cover must be a JPEG, PNG or WebP image.',
  )
  .refine(
    f => f.size <= COVER_MAX_BYTES,
    'Cover image must be 5 MB or smaller.',
  );

const URL_REGEX = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/;

// Single source of truth for the user-entered field limits, shared between the
// zod schemas and the CharCount indicators in AddObjectModal so the counter's
// `max` can never drift from what validation actually enforces.
// Title caps are per type (docs/object-api.md): 200 for books, 150 for video
// and audio.
export const OBJECT_FIELD_LIMITS = {
  title: { book: 200, video: 150, audio: 150 } as Record<ObjectType, number>,
  author: 100,
  description: 5000,
} as const;

const bookSchema = z.object({
  type: z.literal('book'),
  title: z
    .string()
    .min(1, 'Book title is required')
    .max(OBJECT_FIELD_LIMITS.title.book, 'Title must be 200 chars or less.'),
  author: z
    .string()
    .max(OBJECT_FIELD_LIMITS.author, 'Author must be 100 chars or less.')
    .optional(),
  publicationDate: z.date().optional().nullable(),
  description: z
    .string()
    .max(
      OBJECT_FIELD_LIMITS.description,
      'Description must be 5000 chars or less.',
    )
    .optional(),
  coverImage: coverImageSchema.optional().nullable(),
});

const videoSchema = z.object({
  type: z.literal('video'),
  sourceUrl: z
    .string()
    .min(1, 'URL is required')
    .regex(URL_REGEX, 'Enter a valid URL'),
  title: z
    .string()
    .min(1, 'Video title is required')
    .max(OBJECT_FIELD_LIMITS.title.video, 'Title must be 150 chars or less.'),
  author: z
    .string()
    .max(OBJECT_FIELD_LIMITS.author, 'Creator must be 100 chars or less.')
    .optional(),
  description: z
    .string()
    .max(
      OBJECT_FIELD_LIMITS.description,
      'Description must be 5000 chars or less.',
    )
    .optional(),
  coverImage: coverImageSchema.optional().nullable(),
  // Auto-derived from the URL host (e.g. "YouTube") — not user-entered.
  source: z.string().max(100).optional(),
});

const audioSchema = z.object({
  type: z.literal('audio'),
  sourceUrl: z
    .string()
    .min(1, 'URL is required')
    .regex(URL_REGEX, 'Enter a valid URL'),
  title: z
    .string()
    .min(1, 'Audio title is required')
    .max(OBJECT_FIELD_LIMITS.title.audio, 'Title must be 150 chars or less.'),
  author: z
    .string()
    .max(OBJECT_FIELD_LIMITS.author, 'Artist must be 100 chars or less.')
    .optional(),
  description: z
    .string()
    .max(
      OBJECT_FIELD_LIMITS.description,
      'Description must be 5000 chars or less.',
    )
    .optional(),
  coverImage: coverImageSchema.optional().nullable(),
  // Both auto-derived, never user-entered: `source` from the URL host,
  // `duration` (whole seconds) from the selected iTunes track.
  source: z.string().max(100).optional(),
  duration: z.number().int().nonnegative().optional(),
});

export const schemaByType = {
  book: bookSchema,
  video: videoSchema,
  audio: audioSchema,
} as const;

export type BookFormData = z.infer<typeof bookSchema>;
export type VideoFormData = z.infer<typeof videoSchema>;
export type AudioFormData = z.infer<typeof audioSchema>;

export type AddObjectFormData = BookFormData | VideoFormData | AudioFormData;

export function getSchemaForType(type: ObjectType) {
  return schemaByType[type];
}
