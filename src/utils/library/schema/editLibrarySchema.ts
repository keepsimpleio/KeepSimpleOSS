import { z } from 'zod';

import { htmlToPlainText } from '@lib/library/objectMeta';

// Mirrors the backend username regex from docs/user-api.md §3:
// ^(?!.*[&%:;*|></\\#?"=])[^\s]{4,30}$
const USERNAME_REGEX = /^(?!.*[&%:;*|></\\#?"=])\S{4,30}$/;

// The backend accepts more (aboutMe 2000, aboutLibrary 4000 per
// docs/library-api.md), but both passages sit in a narrow panel: 1000
// characters is what reads there, and the counter and the validator share
// these figures so they cannot drift apart.
export const ABOUT_LIBRARY_MAX = 1000;
export const ABOUT_AUTHOR_MAX = 1000;

// Both fields hold rich text, so the limit is measured on the writing rather
// than on the markup around it: a bold word must not cost the owner 17 of
// their characters.
const withinLimit = (max: number) => (value?: string) =>
  htmlToPlainText(value ?? '').length <= max;

/** What the owner opened the form with, so an untouched passage is exempt. */
export interface EditLibraryInitialValues {
  aboutMe?: string;
  aboutLibrary?: string;
}

// The cap applies to what the owner writes from here on. A passage saved under
// the old limits stays valid while it is left alone, so a long legacy About
// cannot block an unrelated edit such as a username change; touching it brings
// it under the cap.
export const createEditLibrarySchema = (
  initial: EditLibraryInitialValues = {},
) =>
  z.object({
    username: z
      .string()
      .min(1, 'Username is required')
      .regex(
        USERNAME_REGEX,
        'Username must be 4-30 characters, no whitespace, and must not contain & % : ; * | > < \\ # ? " =',
      ),
    aboutMe: z
      .string()
      .refine(
        value =>
          value === initial.aboutMe || withinLimit(ABOUT_AUTHOR_MAX)(value),
        `About author must be ${ABOUT_AUTHOR_MAX} characters or less`,
      )
      .optional(),
    aboutLibrary: z
      .string()
      .refine(
        value =>
          value === initial.aboutLibrary ||
          withinLimit(ABOUT_LIBRARY_MAX)(value),
        `About library must be ${ABOUT_LIBRARY_MAX} characters or less`,
      )
      .optional(),
  });

export type EditLibraryFormData = z.infer<
  ReturnType<typeof createEditLibrarySchema>
>;

// Avatar constraints — frontend mirrors what docs/library-api.md describes:
//   max 5 MB enforced server-side; the error message also implies a 10 KB minimum
//   so we gate that client-side to match the wording.
//   MIME types match the object cover image rule (jpg/jpeg/png/webp) — confirmed
//   for object, assumed for library since the doc doesn't list explicit MIMEs.
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const AVATAR_MIN_BYTES = 10 * 1024;
export const AVATAR_ACCEPT_MIME = ['image/jpeg', 'image/png', 'image/webp'];
