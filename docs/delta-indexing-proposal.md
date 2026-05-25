# Delta-indexing for the widget's graph DB

> **Status: DEFERRED (2026-05-13).** Wolf paused the rollout before any
> infra was wired. The design below is kept as the agreed direction
> for when we pick it up again. The Order II's staging work has been
> cancelled per the conversation; do not act on this doc until Wolf
> explicitly green-lights it again.
>
> Production-grade proposal. The widget already retrieves from the
> RAG service; this doc only covers how the RAG service stays in sync
> with content as it's published and edited.

## Goal

Whenever a new article, bias, case, persona, sector, or AI Atlas entry
is published — or one is edited / unpublished / deleted — the widget's
graph DB reflects that change within minutes, without re-indexing the
whole library.

## Design at a glance

```
   Strapi entry published                Repo merge to prod branch
         │                                       │
         ▼                                       ▼
   Strapi webhook                         GitHub Action
   (built-in, no Strapi code)             (watches public/ai-atlas/*)
         │                                       │
         └─────────────────┬─────────────────────┘
                           ▼
            POST /ingest/upsert  (or /ingest/delete)
                           │
                           ▼
                    uxcore-rag service
                  embeds + upserts ONE entry
                  into the existing graph DB
```

One ingest endpoint, two callers, same shared secret.

## What changes, and where

| Where                         | What                                                                                                                     | Owner                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| Strapi (prod + staging admin) | Configure webhooks on `entry.publish / update / unpublish / delete` pointing at RAG                                      | The Order                       |
| Strapi secret + RAG env vars  | `INGEST_WEBHOOK_SECRET` per env                                                                                          | The Order                       |
| `uxcore-rag`                  | New routes `POST /ingest/upsert`, `POST /ingest/delete`; HMAC verify; reuse existing ingester functions per content-type | RAG owner (route via The Order) |
| `uxcore-rag`                  | Nightly cron `/cron/safety-sync` pulling `updated_at > last_sync_ts` from Strapi                                         | RAG owner                       |
| `uxcore-rag`                  | `GET /ingest/status` returning `{last_sync_ts, last_5_errors, counts_by_type}`                                           | RAG owner                       |
| `keepsimple-oss` (this repo)  | GitHub Action on merge to prod branch, POSTs changed `public/ai-atlas/*.json` to RAG                                     | KeepSimple agent (this one)     |

## Production guard-rails

1. **Per-env routing.** Staging Strapi → staging RAG, prod Strapi → prod
   RAG. Webhook URLs and HMAC secrets live in each Strapi instance's
   settings + the corresponding RAG container's env. No hardcoded URLs.
2. **Auth, two flavours.**
   - **Strapi → RAG**: bearer token in `Authorization: Bearer <secret>`.
     Strapi v4 has no native request signing, so bearer is the only
     honest option from that side. Token rotates per env.
   - **GitHub Action → RAG**: HMAC signature on the body
     (`X-Ingest-Signature: sha256=<hmac(body, secret)>`). Action context
     can compute it cleanly, and a leaked Atlas-side token shouldn't
     also unlock Strapi-side ingest.
     Either path rejects unauthenticated calls with 401 and logs the
     attempt.
3. **Idempotency.** The graph key for an entry =
   `{type}:{strapi_id}:{lang}`. Each locale is its own row, so EN and
   RU versions of the same article never overwrite each other.
   Re-deliveries (Strapi retries on 5xx) upsert, never duplicate.
4. **Safety-net cron.** Nightly, RAG pulls everything from Strapi where
   `updated_at > last_sync_ts` and upserts. Catches any webhook the
   network ate. Belt + braces — non-negotiable for production.
5. **Observability.** Every ingest event logged structured:
   `{source, type, id, action, took_ms, status, error?}`.
   `GET /ingest/status` exposes last-sync-ts + last-5-errors so we can
   verify health from anywhere without SSH.
6. **Atlas / repo content.** GitHub Action runs ONLY on merge to the
   prod branch, hits the prod RAG endpoint, fails loudly in the Actions
   log if RAG is unreachable. Same HMAC envelope.
7. **Initial backfill.** On first deploy of the new RAG version, run
   the existing full-library ingest once. After that, deltas only.
   `last_sync_ts` is initialized to the backfill timestamp.

## API contract (RAG side)

```
POST /ingest/upsert
Headers (Strapi → RAG):
  Authorization: Bearer <INGEST_STRAPI_TOKEN>
  Content-Type: application/json
Headers (GitHub Action → RAG):
  X-Ingest-Signature: sha256=<hmac(body, INGEST_ACTION_SECRET)>
  Content-Type: application/json
Body:
  { source: "strapi" | "atlas" | "manual",
    type: "article" | "bias" | "case" | "persona" | "sector" | ...,
    id: "<stable id>",
    payload: { ...content blob... },
    lang: "en" | "ru" | "hy" }
Returns: { ok: true, indexed_at: "<iso8601>" }

POST /ingest/delete
Same envelope; body has { source, type, id, lang }.

GET /ingest/status
Returns: {
  last_sync_ts: "<iso8601>",
  last_5_errors: [{ ts, type, id, error }],
  counts_by_type: { article: 312, bias: 198, ... }
}
```

## Failure modes + responses

| Failure                        | What happens                                                                                       | Recovery                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| RAG down when Strapi fires     | Strapi retries (3 tries, exp backoff). After that, missed entries get caught by nightly safety-net | Automatic                                           |
| Strapi webhook misconfigured   | Nothing arrives at RAG; safety-net catches it within 24h                                           | `/ingest/status` shows stale `last_sync_ts` — alert |
| HMAC mismatch                  | RAG returns 401, logs the attempt                                                                  | Manual: check secret rotation                       |
| Bad payload shape              | RAG returns 422, logs, ack to Strapi (don't retry forever)                                         | Schema bug — fix in RAG ingester                    |
| Atlas Action hits network blip | Action fails loudly; Wolf gets the email                                                           | Re-run the Action                                   |

## Not in this proposal

- Real-time push to the widget (visitors already in-session). Out of
  scope — they get fresh content on their next question.
- Per-language differential indexing beyond what the ingester already
  handles. Strapi entries are already lang-tagged; we pass it through.
- Schema migrations on the graph DB. Treat as a separate operation.

## What I'm not implementing here

- Strapi admin webhook config + secret provisioning (Order).
- The `uxcore-rag` endpoint, HMAC code, cron job (RAG repo, route via Order).
- Production deploy of the new RAG image (Order).
- I CAN add the GitHub Action workflow in this repo when given the
  prod RAG endpoint URL + secret env-var name.

## Sequence for shipping

1. The Order configures Strapi webhook + secret on staging.
2. RAG owner ships the three endpoints + HMAC + safety-net cron on staging.
3. We test end-to-end on staging: publish a Strapi entry → verify it
   appears in retrieval within a minute.
4. Repeat on prod with prod secret.
5. I add the GitHub Action in this repo pointing at prod RAG.
6. First full backfill, then deltas only forever.
