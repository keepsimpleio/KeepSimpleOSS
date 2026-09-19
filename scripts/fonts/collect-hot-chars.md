# Hot characters for the sliced fonts

`yuji-syuku.hot.txt` lists every character the site is known to render with
the YujiSyuku face. The build packs them into one slice so a normal page needs
a single small download; any character outside the list still renders from
one of the code-point slices.

Refresh the list when new Japanese copy lands:

1. Characters in source: Japanese ranges (U+3000-30FF, U+3400-4DBF, U+4E00-9FFF,
   U+FF00-FFEF) across `src/**/*.{ts,tsx,scss}`.
2. Characters from Strapi: fetch the live Longevity pages (about-project,
   environment, results, habits/\*) in `en` and `ru`, plus `/contributors` and
   `/tools`, and extract the same ranges from the HTML.
3. Union both sets into `yuji-syuku.hot.txt`, then run
   `node scripts/fonts/build-webfonts.cjs` and commit the regenerated files.

Last collected: 2026-09-08 (123 characters).
