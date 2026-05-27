# The Order — readiness check response (2026-05-25)

Responding to `staging-to-prod-assessment.md`. Audited the prod host + ks-contabo staging + the keepsimple repo @ `origin/dev` + the GH Actions CI workflow.

## The pipeline you're merging into (correction to assessment framing)

Prod deploy is **fully automatic** the moment `dev → main` lands. There is no manual `docker build` on the prod host:

1. GitHub Actions `.github/workflows/main.yaml` fires on push to `main`.
2. CI runs `docker build` using a **base64-encoded `ENV_PRODUCTION` GH Actions secret** as both `.env` and `.env.staging` baked into the image, runs `yarn build:staging`, pushes `<registry>/keepsimple-next:prod`.
3. Watchtower on the prod host polls the registry and recreates `keepsimple-next-staging` (yes, container is misnamed) when a new digest appears.

So **prod env secrets do NOT live on the prod host** — they live in the GH Actions secret `ENV_PRODUCTION` (and `ENV_STAGING` for dev pushes). Verifying the prod host's `.env` is meaningless for keys baked at build time; only the GH secret matters. The verification target for items 1-3 is **the `ENV_PRODUCTION` secret on the keepsimpleio/KeepSimpleOSS GitHub repo**, set by Wolf or me (The Order) before the merge.

This also means: **the merge itself is the deploy.** No staged go/no-go after the click.

## Item-by-item

### 1. `copilot-events` Postgres service — RED

- No `copilot-events` container exists on prod. Only `keepsimple-db-prod` (the main Strapi postgres:12) is up.
- Required env vars (`COPILOT_EVENTS_URL`, `COPILOT_EVENTS_WRITE_TOKEN`, `COPILOT_EVENTS_READ_TOKEN`) are **absent from both the staging AND prod baked env**.
- Implication: per `event.ts` fire-and-forget design, runtime won't crash, but every Copilot session writes 0 events and `/admin/copilot-sessions` returns empty. **Same is true on staging today** — Copilot analytics has likely never been exercised end-to-end with a real sink.
- Decision needed from Wolf:
  - (A) Stand up the `copilot-events` Postgres service (new container) + provision tokens + add to `ENV_PRODUCTION` + `ENV_STAGING` BEFORE merge. The Order can do this in ~30 min if KEEPSIMPLE provides the schema/migration file or service compose snippet.
  - (B) Accept Copilot ships dark on prod, fix in a follow-up. Admin viewer empty, no telemetry, no crash.

### 2. New `.env.example` keys missing on prod — YELLOW (but only meaningfully missing: `MAILRU_*`)

Diffing prod's baked env against the dev `.env.example`:

| Key                                                   | In prod baked env? | Impact                                    |
| ----------------------------------------------------- | ------------------ | ----------------------------------------- |
| `NEXT_PUBLIC_AHREFS_ANALYTICS_KEY`                    | NO                 | Ahrefs analytics tag won't render on prod |
| `MAILRU_CLIENT_ID` / `MAILRU_CLIENT_SECRET`           | NO                 | Mailru OAuth button will fail post-merge  |
| `COPILOT_EVENTS_URL` / `_WRITE_TOKEN` / `_READ_TOKEN` | NO                 | Covered in item 1                         |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`                       | YES (already set)  | OK                                        |
| `NEXTAUTH_SECRET`, OAuth (Google/LinkedIn/Discord)    | YES                | OK, hotfix #108 era already set them      |

Action: update `ENV_PRODUCTION` GH secret to include the missing keys before merge. The Order needs values from Wolf (Ahrefs key) and from Mailru OAuth console registration (CLIENT_ID/SECRET, redirect_uri whitelist for `https://keepsimple.io/api/auth/callback/mailru`).

### 3. Magic-link mailer + OAuth callbacks — GREEN (with one ask of KEEPSIMPLE)

- **No SMTP/EmailProvider in the Next.js NextAuth handler.** The Next.js app only _consumes_ magic links via `/auth/magic-link` (`consumeMagicLink` from `@api/auth`). The send-side mailer lives in the **backend** (`uxcat-api` or Strapi) — already running on prod, out of scope for this Next.js push.
- OAuth providers wired in handler: Google, LinkedIn, Discord, Twitter, Yandex, **Mailru (new)**. Existing 5 keep their redirect URIs unchanged (paths weren't refactored). Mailru is the only one requiring console setup.
- **Confirm with KEEPSIMPLE:** has the magic-link flow been exercised end-to-end on staging with a real email landing in a real inbox? If yes, send-side mailer is configured in uxcat-api/Strapi and prod inherits the same backend. If no, magic-link UI ships dark and that's a separate fix.

### 4. `build-fetch-patch.js` Strapi guardrail — GREEN, already done

The Dockerfile **unconditionally runs `yarn build:staging`** for both `:prod` and `:staging` tags. That command includes `NODE_OPTIONS=--require=./build-fetch-patch.js`. Strapi 5xx absorber is already protecting every prod build. **No action needed.** Strike this item from the gate list.

### 5. Staging-commit confirmation — staging IS on dev tip (with caveat)

- ks-contabo's `keepsimple-next-staging` container runs `keepsimple-next:staging`, image **built 2026-05-22 15:05 UTC**.
- GH Actions auto-builds `:staging` on every push to `origin/dev`.
- `origin/dev` tip locally is `f659653` (Merge PR #119 chore/minor-improvements).
- If anything pushed to `dev` after 2026-05-22 15:05 UTC, staging is N commits behind dev tip. Likely 0-2 commits behind based on commit cadence — Wolf, check `git log --since='2026-05-22 15:05Z' origin/dev` if exact-tip-on-staging matters for QA sign-off.

## Recommended sequence

1. KEEPSIMPLE answers: was magic-link send-side tested on staging with a real inbox? (5-line reply)
2. Wolf decides: copilot-events Postgres before merge (A) or after (B)?
3. If (A): The Order stands up service + tokens + appends to both GH secrets (~30 min, needs schema from KEEPSIMPLE).
4. The Order updates `ENV_PRODUCTION` GH secret with: AHREFS key (from Wolf), MAILRU OAuth creds (from Wolf via Mailru console), copilot-events tokens (from step 3).
5. The Order does same updates to `ENV_STAGING` secret to keep parity, pushes a no-op commit to `dev` to rebuild staging with full env, smoke-checks at staging.keepsimple.io.
6. Merge `dev → main` in PR UI. Watchtower picks up in ≤1 hr.
7. The Order watches prod healthcheck + Copilot endpoint logs for 30 min post-deploy.

## SEND TO @Keepsimple draft (for Wolf to relay)

> The Order ran the readiness audit. Three corrections to your assessment:
>
> 1. Your item 4 (build-fetch-patch guardrail) is ALREADY active for prod — the Dockerfile runs `yarn build:staging` for the `:prod` tag too, so the Strapi 5xx absorber is wrapped around every prod build. Drop this item.
> 2. Your item 3 (magic-link mailer): the Next.js app only consumes magic links — it never sends. Send-side mailer lives in the backend (uxcat-api or Strapi), not Next.js. ONE question for you: has the magic-link flow been tested end-to-end on staging with a real email landing in a real inbox? If yes → backend mailer is already configured, no prod risk. If no → magic-link ships dark, plan a follow-up.
> 3. Items 1, 2 (copilot-events Postgres + missing env keys): your framing of "Order needs to verify on the prod host" is wrong layer. Prod secrets are not on the prod host — they're baked into the image at build time from the `ENV_PRODUCTION` GitHub Actions secret. Same for staging from `ENV_STAGING`. Verified by comparing the prod image's `/app/.env` against `.env.example`. Confirmed missing in prod's baked env: `MAILRU_CLIENT_ID/SECRET`, `NEXT_PUBLIC_AHREFS_ANALYTICS_KEY`, all three `COPILOT_EVENTS_*`. Same gaps on the staging baked env (so Copilot analytics has never had a real sink, including on staging).
>
> Decisions for Wolf:
>
> - (A) Stand up `copilot-events` Postgres before merge — need the service compose snippet + DB schema/migration from you. I can deploy + token-provision in ~30 min once those land.
> - (B) Ship Copilot dark on prod, fix in a follow-up. No crash (event.ts swallows errors), just empty admin viewer.
>
> Staging is on `:staging` image built 2026-05-22 15:05 UTC; if any dev commits landed after that, staging is N behind. Local `origin/dev` tip is `f659653` (Merge PR #119). If you need staging at exact dev tip for QA sign-off, push a no-op or let me re-trigger the build after the env secret update.
