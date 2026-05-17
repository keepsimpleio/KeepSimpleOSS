# Copilot analytics — Strapi spec

Goal: capture every Copilot session end-to-end so we can read transcripts, see who navigated where, and watch anonymous → registered moments. Stored in our existing Strapi. Two new content types, one new API token. Nothing else in Strapi is touched.

---

## 1. Content type: `copilot-session`

One row per visitor session. Created on the visitor's first turn.

| Field       | Type                   | Required | Notes                                                           |
| ----------- | ---------------------- | -------- | --------------------------------------------------------------- |
| sessionId   | UID (unique)           | yes      | Anonymous browser-side id; survives CLEAR, dies on storage wipe |
| env         | Enum: dev/staging/prod | yes      | Stamped server-side from `NEXT_PUBLIC_ENV`                      |
| lang        | String (3)             | yes      | `en` / `ru` / `hy`                                              |
| userAgent   | Text                   | no       | Truncated to 500 chars                                          |
| startedAt   | DateTime               | yes      |                                                                 |
| firstUrl    | String (500)           | yes      | Page they were on for turn 1                                    |
| linkedUser  | String (200)           | no       | Filled in when they sign in mid-session (email or user id)      |
| linkedAt    | DateTime               | no       | When the auth event fired                                       |
| threadCount | Integer                | yes      | Starts at 1, +1 on every CLEAR                                  |

---

## 2. Content type: `copilot-turn`

One row per event inside a session. Most events are question + answer pairs; some are clears, nav hops, card clicks, or auth.

| Field       | Type                                                 | Required | Notes                                      |
| ----------- | ---------------------------------------------------- | -------- | ------------------------------------------ |
| sessionId   | String (indexed)                                     | yes      | Foreign key to `copilot-session.sessionId` |
| threadId    | String                                               | yes      | Changes on each CLEAR within a session     |
| env         | Enum: dev/staging/prod                               | yes      |                                            |
| ts          | DateTime                                             | yes      |                                            |
| kind        | Enum: question, answer, clear, nav, card_click, auth | yes      |                                            |
| query       | Text                                                 | no       | For kind=question                          |
| answer      | Text                                                 | no       | For kind=answer                            |
| cardsShown  | JSON                                                 | no       | Array of `{title, url, nominated, score}`  |
| cardClicked | JSON                                                 | no       | For kind=card_click: `{title, url, tier}`  |
| pageUrl     | String (500)                                         | no       | Where the visitor was when this fired      |
| pageTitle   | String (300)                                         | no       |                                            |
| mode        | String (20)                                          | no       | `answer` / `clarify`                       |
| meta        | JSON                                                 | no       | Free-form for future signals               |

---

## 3. Permissions

- **Public role**: no access to either type.
- **Authenticated role**: no access.
- **New API token**: name `copilot-writer`, type **Custom**, permissions:
  - `copilot-session`: `create`, `update` (no `find`, no `delete`)
  - `copilot-turn`: `create` (no `find`, no `update`, no `delete`)
- Token value goes into our Next.js env as `STRAPI_COPILOT_TOKEN` (added to DEV, staging, prod separately).

---

## 4. Reading the data

Wolf reads sessions directly in the **Strapi admin panel** using his existing admin account. Filter by `env=prod` for live calibration; filter by `sessionId` to scroll a single transcript end-to-end. No custom UI needed for v1.

---

## 5. Hard guarantees

- Both content types are prefixed `copilot-*` — cannot collide with any existing keepsimple content type.
- Token is write-only and scoped strictly to these two types — cannot touch Articles, UXCG cases, UX Core biases, or anything else.
- Neither type is queried at Next.js build time, so a Strapi outage cannot break a deploy.
- Writes from the Next.js side are fire-and-forget — a failed Strapi write never blocks the visitor's reply.
