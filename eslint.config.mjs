import { FlatCompat } from '@eslint/eslintrc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },

  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // ── TypeScript ───────────────────────────────────────────────────────
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        {
          'ts-ignore': false,
          'ts-expect-error': true,
          'ts-nocheck': true,
          'ts-check': false,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',

      // ── Import order ─────────────────────────────────────────────────────
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. Side-effect imports (e.g. `import 'reflect-metadata'`)
            ['^\\u0000'],
            // 2. Node built-ins (e.g. `node:url`, `path`, `fs`)
            ['^node:'],
            // 3. Third-party packages (react, next, classnames, lodash…)
            ['^@?\\w'],
            // 4. Styles alias
            ['^@styles(?:/.*)?$'],
            // 5. Constants alias
            ['^@constants(?:/.*)?$'],
            // 6. Types / local-types aliases
            ['^@local-types(?:/.*)?$'],
            // 7. Hooks alias
            ['^@hooks(?:/.*)?$'],
            // 8. Lib alias
            ['^@lib(?:/.*)?$'],
            // 9. API alias
            ['^@api(?:/.*)?$'],
            // 10. Data alias
            ['^@data(?:/.*)?$'],
            // 11. Icons alias
            ['^@icons(?:/.*)?$'],
            // 12. Components alias
            ['^@components(?:/.*)?$'],
            // 13. Layouts alias
            ['^@layouts(?:/.*)?$'],
            // 14. Catch-all for any other @ aliases (e.g. src/…)
            ['^@/', '^src/'],
            // 15. Relative imports (non-style)
            ['^\\.(?!.*\\.(?:css|scss|sass|less)$)'],
            // 16. Style imports (CSS / SCSS)
            ['^.+\\.(?:css|scss|sass|less)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'import/newline-after-import': 'error',
    },
  },
];
