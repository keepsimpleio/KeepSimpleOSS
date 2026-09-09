import { z } from 'zod';

import { MAX_TAG_DESCRIPTION_LENGTH } from '@constants/library/common';

// Backend generates the tag slug from the name and enforces the Strapi uid
// regex /^[A-Za-z0-9-_.~]*$/. We mirror it client-side so the user sees a
// friendly message instead of the raw Strapi validation error.
const TAG_NAME_REGEX = /^[A-Za-z0-9\-_.~]+$/;

export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, 'Tag name is required')
    .min(2, 'Tag name must be at least 2 characters')
    .max(20, 'Tag name must be 20 characters or less.')
    .regex(
      TAG_NAME_REGEX,
      'Use letters, numbers, or - _ . ~ only (no spaces or special characters).',
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
