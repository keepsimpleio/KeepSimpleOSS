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

const bookSchema = z.object({
  type: z.literal('book'),
  title: z
    .string()
    .min(1, 'Book title is required')
    .max(200, 'Title must be 200 chars or less.'),
  author: z.string().max(150, 'Author must be 150 chars or less.').optional(),
  publicationDate: z.date().optional().nullable(),
  description: z
    .string()
    .max(4000, 'Description must be 4000 chars or less.')
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
    .max(150, 'Title must be 150 chars or less.'),
  author: z.string().max(100, 'Creator must be 100 chars or less.').optional(),
  description: z
    .string()
    .max(5000, 'Description must be 5000 chars or less.')
    .optional(),
  coverImage: coverImageSchema.optional().nullable(),
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
    .max(150, 'Title must be 150 chars or less.'),
  author: z.string().max(100, 'Artist must be 100 chars or less.').optional(),
  description: z
    .string()
    .max(5000, 'Description must be 5000 chars or less.')
    .optional(),
  coverImage: coverImageSchema.optional().nullable(),
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
