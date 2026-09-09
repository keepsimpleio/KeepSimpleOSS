import { z } from 'zod';

import {
  MAX_TAG_DESCRIPTION_LENGTH,
  MAX_TAG_NAME_LENGTH,
} from '@constants/library/common';

// A tag's name is the owner's own word, written the way they write it: spaces,
// accents, punctuation, any script. Nothing here has to be URL-safe, because
// the CMS derives the tag's address from the name itself (transliterated to
// Latin, unique inside the library) and never takes one from the client. The
// field used to be held to Strapi's uid character class, a leftover from when
// the client stamped its own slug, and it refused "To begin" along with every
// other name written like a phrase.
export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tag name is required')
    .min(2, 'Tag name must be at least 2 characters')
    .max(
      MAX_TAG_NAME_LENGTH,
      `Tag name must be ${MAX_TAG_NAME_LENGTH} characters or less.`,
    ),
  description: z
    .string()
    .max(
      MAX_TAG_DESCRIPTION_LENGTH,
      `Description must be ${MAX_TAG_DESCRIPTION_LENGTH} characters or less`,
    )
    .optional(),
  color: z.string().min(1, 'Color is required'),
});
