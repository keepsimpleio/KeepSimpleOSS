# Staging → Prod safety assessment (2026-05-25)

Baseline assumption: **staging == origin/dev tip** (needs confirmation from Wolf / The Order).
Comparison: `origin/main` (prod) → `origin/dev` (presumed staging).

## Scale of the push

- 101 commits, 2244 files changed, +134,848 / -2,569 lines.
- Bulk is the UX Core merge (folded May 14): `src/uxcore/` alone is +95,760 lines, `public/` +12,309. Net new product code (Copilot, auth, AI Atlas updates) is the smaller, hotter slice.
- Last prod push: hotfix #108 (`hotfix/delete-test-login`) on 2026-05-11. PR #102 (dev→main) on 2026-05-08. **17 days of dev work** accumulated since prod last moved.

## Green / verified safe

1. **Hotfix #108 preserved.** `src/pages/api/test-login.ts` is absent on **both** main and dev. The unauthenticated JWT-mint endpoint will not re-appear post-merge.
2. **No DB migrations / SQL files** in the diff. No Strapi schema changes inside this repo.
3. **No `_document.tsx` touch.** `_app.tsx` modified (locale/context/atlas-class wiring + UX Core context Proxy) — diff is non-trivial but localized.

## Red — needs Order verification before push

1. **Copilot analytics depends on Postgres `copilot-events` service.**
   - New endpoints on dev: `/api/copilot/event`, `/api/concierge`, `/api/concierge-landing`, plus `/admin/copilot-sessions`.
   - New libs: `src/lib/copilotAnalytics.ts`, `src/lib/copilotEventsRead.ts`.
   - Strapi sink was ripped out (PR `4635feb feat(copilot): swap analytics sink from Strapi to copilot-events Postgres`).
   - **PROD MUST HAVE:** the `copilot-events` Postgres service running + reachable from the prod container, and the Postgres connection env vars (`COPILOT_EVENTS_*` or equivalent) set in prod secrets. Without these, every Copilot event POST and concierge turn will throw on log-write. Fire-and-forget should swallow errors (per `event.ts` design), but admin viewer (`/admin/copilot-sessions`) will be empty / errored.

2. **`.env.example` changed.** New required env keys may have been introduced and not yet provisioned in prod. Order needs to diff `.env.example` against prod's actual env and add what's missing **before** the dev → main merge runs the build.

3. **24 new npm dependencies, yarn.lock +2047/-329.**
   - Notable: `isomorphic-dompurify`, `marked`, `rehype-sanitize` (markdown/XSS surface), `d3-geo` + topojson stack, `victory`, `react-toastify`, `web-vitals`, `tsx`, `linkinator`, `axe-core`.
   - Prod build must `yarn install` cleanly — confirm no private-registry deps and Node 18.18.0 image still resolves all of them.

4. **Magic-link auth flow added.** `src/pages/auth/magic-link.tsx`, `MagicLinkEmailForm`, plus changes to `[...nextauth].ts`. Mailer (SMTP / provider) must be configured in prod env. NextAuth callback URLs (Google/LinkedIn/Discord) for keepsimple.io domain must still be whitelisted in their respective OAuth consoles after the auth refactor.

5. **`build-fetch-patch.js` Strapi guardrail.** Injected via `NODE_OPTIONS=--require=./build-fetch-patch.js` in `yarn build:staging`. Confirm prod's build command path also wires this in — if prod calls `yarn build` (plain), Strapi 5xx during build will crash the deploy.

6. **`.github/workflows/cypress-manual.yml` shows up in the diff.** Per `CLAUDE.local.md` Cypress was already removed (PR #103). Likely a no-op dead workflow — won't block prod, just clutter.

## Yellow — process risk

- **101-commit single jump.** No incremental staging cadence inside the window; the whole 17-day backlog rides together. Rollback path is `git revert b1e6f9f` (last merge to main) — works, but loses everything.
- **Staging coverage uncertain.** I do not know:
  - Which exact commit / branch staging.keepsimple.io is serving.
  - Whether QA has run a full smoke / canonical pass on that build.
  - Whether the magic-link flow has been exercised end-to-end on staging with a real mailer.

## What's NOT in this push (clarifying scope)

- `feat/uxcore-cybersec` (current local branch, 30 commits ahead of dev) — OffSec layer, AI Atlas tweaks, Hexens/kemmio attribution. **Not on dev, therefore not on staging, therefore not in this prod push.** Stays in the queue.

## Recommendation

**Conditional GO**, contingent on Order confirming, on the prod host:

1. `copilot-events` Postgres service exists, is running, and its DSN/creds are in the prod container env.
2. `.env.example` keys not yet in prod env are added.
3. Magic-link mailer creds present; OAuth callback URLs unchanged.
4. Prod build command includes the `build-fetch-patch.js` guardrail (or equivalent Strapi 5xx tolerance).
5. Staging is in fact on `origin/dev` tip and has cleared a QA smoke pass in the last 24h.

If any of (1)–(4) is missing, **do not merge dev → main yet**. Item (5) needs Wolf / QA, not Order.

## SEND TO @TheOrder draft (for Wolf to relay)

> Before we merge dev → main on keepsimpleio/KeepSimpleOSS (101 commits, prod push), please verify on the prod host:
>
> 1. `copilot-events` Postgres service is running and its connection env vars are set in the prod KS container.
> 2. Any new keys in `.env.example` (vs `origin/main`) are present in prod env.
> 3. Magic-link SMTP/mailer creds are configured; OAuth callback URLs (Google/LinkedIn/Discord) for keepsimple.io still match the refactored NextAuth handler.
> 4. The prod build command path wires `NODE_OPTIONS=--require=./build-fetch-patch.js` (Strapi 5xx absorber) — same way `yarn build:staging` does.
>    Also: which exact commit is `staging.keepsimple.io` serving right now? Need that to confirm staging == dev tip.
