import { z } from 'zod';

// Mirrors the backend username regex from docs/user-api.md §3:
// ^(?!.*[&%:;*|></\\#?"=])[^\s]{6,30}$
const USERNAME_REGEX = /^(?!.*[&%:;*|></\\#?"=])\S{6,30}$/;

// Backend limits per docs/library-api.md §"Library attributes (schema)":
//   aboutMe        ≤ 2000 chars
//   aboutLibrary   ≤ 4000 chars
// (CKEditor rich text on backend; the form sends plain string today.)
export const editLibrarySchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .regex(
      USERNAME_REGEX,
      'Username must be 6-30 characters, no whitespace, and must not contain & % : ; * | > < \\ # ? " ='
    ),
  aboutMe: z.string().max(2000, 'About author must be 2000 characters or less').optional(),
  aboutLibrary: z.string().max(4000, 'About library must be 4000 characters or less').optional(),
});

export type EditLibraryFormData = z.infer<typeof editLibrarySchema>;

// Avatar constraints — frontend mirrors what docs/library-api.md describes:
//   max 5 MB enforced server-side; the error message also implies a 10 KB minimum
//   so we gate that client-side to match the wording.
//   MIME types match the object cover image rule (jpg/jpeg/png/webp) — confirmed
//   for object, assumed for library since the doc doesn't list explicit MIMEs.
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const AVATAR_MIN_BYTES = 10 * 1024;
export const AVATAR_ACCEPT_MIME = ['image/jpeg', 'image/png', 'image/webp'];
