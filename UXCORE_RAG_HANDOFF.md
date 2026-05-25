# UX Core RAG → KeepSimple Engineering Handoff

**Status (2026-05-09):** Backend live, indexed, smoke-tested. Ready for the
KeepSimple agent to start building the concierge widget on `keepsimple.io`.

---

## What's live

- **Service:** `uxcore-rag` (FastAPI + LightRAG + OpenAI gpt-4o-mini)
- **Staging URL:** `https://keepsimple-rag.administration.ae`
- **Auth:** Cloudflare Access (login via Google email).
  Currently allows `alexanyanwolf@gmail.com` only — Wolf adds your engineer's
  email to the allowlist on request, OR provisions a CF Access service token
  for automated calls (preferred for the production proxy).
- **Indexed corpus:** 105 cognitive biases + 63 UXCG questions (English).
  RU + HY locales planned in v2 once EN is validated end-to-end.
- **Brain artifact:** stored in named Docker volume `uxcore-rag_lightrag-data`.
  Treat the indexed graph as a build artifact — do **not** re-index per
  environment (LLM extraction is non-deterministic, graph drifts).
  Re-index only when Strapi content meaningfully changes, then publish a
  new artifact.

---

## API contract (v0.2)

All endpoints are JSON, all hit `https://keepsimple-rag.administration.ae`.

### `GET /healthz`

Liveness + config flags. No auth.

```json
{
  "status": "ok",
  "version": "0.2.0",
  "ingester_configured": true,
  "openai_configured": true,
  "indexing": false,
  "indexed_docs": 168
}
```

### `POST /query/concierge`

LLM-synthesized answer with retrieved context. **This is what the widget calls.**

```json
// Request
{ "text": "My team keeps overestimating how clear our messaging is.", "lang": "en" }

// Response
{ "answer": "...markdown answer..." }
```

- `lang` is currently informational only (corpus is EN). When RU + HY ship,
  pass the user's locale.
- Answer is Markdown. May contain `[KG]` / `[DC]` LightRAG citation markers —
  the widget should strip these client-side before render. (Or render them as
  small "source" chips if you want extra credibility cues.)
- Latency: 2–6s typical. Streaming (SSE) is **not** implemented yet — the
  request blocks until the answer is complete. SSE is on the v0.3 roadmap if
  the widget needs it.

### `POST /query/retrieve`

Pure retrieval, no LLM synthesis. Faster, cheaper. Returns the raw context
LightRAG would have fed the LLM. Use this for "show me related biases without
narrative" UIs.

```json
// Request: same shape as concierge
{ "text": "...", "lang": "en" }
// Response
{ "answer": "...raw context blob..." }
```

### `POST /index` (admin only)

Triggers a full re-index from Strapi. Returns 202 immediately; check
`/index/status` for progress. Requires `Authorization: Bearer <INDEX_AUTH_HEADER>`.
**The KeepSimple agent does not need to call this** — Wolf re-indexes on
content changes.

---

## How to call from `keepsimple.io`

**Don't call directly from the browser.** Cloudflare Access cookies are scoped
to `*.administration.ae` and won't work cross-origin from `keepsimple.io`. Also,
shipping a CF Access service token to the browser would leak it.

**Correct pattern:** add a thin Next.js API route on `keepsimple.io` that holds
the service token server-side and proxies to our service.

```ts
// /pages/api/concierge.ts (or /app/api/concierge/route.ts)
export default async function handler(req, res) {
  const r = await fetch(
    'https://keepsimple-rag.administration.ae/query/concierge',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CF-Access-Client-Id': process.env.CF_ACCESS_CLIENT_ID, // server-side
        'CF-Access-Client-Secret': process.env.CF_ACCESS_CLIENT_SECRET, // server-side
      },
      body: JSON.stringify(req.body),
    },
  );
  res.status(r.status).json(await r.json());
}
```

The widget then calls `/api/concierge` on its own origin — no CORS, no leaked
tokens. CORS is enabled on the staging API (allowlist: keepsimple.io,
www.keepsimple.io, localhost:3000, localhost:3005) for direct dev work, but
production should always go through the proxy.

Wolf provisions the CF service token from the "UX Core RAG" Access app; values
land in keepsimple.io's `.env` as `CF_ACCESS_CLIENT_ID` + `CF_ACCESS_CLIENT_SECRET`.

---

## Caveats & known gaps

- **Bias source URLs in answers are best-guesses.** The ingester emits
  `https://keepsimple.io/uxcg#bias-{slug}` and `#q-{slug}`. If the real
  public URL pattern for biases on `keepsimple.io` is different, send the
  pattern and I'll re-index with the correct template (cheap — only re-emits
  metadata, no re-extraction).
- **No RU / HY yet.** Strapi has the localizations. Adding them is a
  one-pass extension (~$2 extra) once EN behavior is validated.
- **No persona / nationality data.** Wolf's third corpus
  (persona → nationality biases) doesn't exist in this Strapi instance.
  Engineer to confirm whether it lives elsewhere or is a future addition.
- **LightRAG citation markers.** Answers may contain `[KG]`,
  `[DC]`, `(Reference: …)` annotations. Strip or stylize as needed.
- **Cost guardrails.** Each concierge query is ~$0.001. Set a Mixpanel-driven
  rate limit on the widget if you want to cap exposure.

---

## Top 5 features the brain unlocks

The widget is feature #1. The other four are next-up product opportunities
the same backend can power without re-indexing.

1. **Concierge widget** _(this handoff)_ — floating button on every
   `keepsimple.io` page; user types a problem in plain words, gets the biases
   that explain it + how to use them.
2. **Decision pre-flight** — user pastes a plan ("we're hiring 10 engineers
   next quarter, here's the process"), gets the 3–5 biases most likely to
   derail it + mitigations. Big for product / HR managers.
3. **Bias awareness quiz** — 8 questions about a recent decision; output a
   shareable card showing which biases were at play, with a score. Viral / SEO.
4. **"Ask UX Core" chat** — open-ended multi-turn conversation; users can
   drill into any bias, ask for HR vs UX examples, compare two biases.
5. **Interactive bias map** — visual graph of how the 105 biases relate
   (LightRAG already builds this graph internally — it's a render away).
   Click one, see neighbors, explore by domain. Long dwell time.

Each of these calls `/query/concierge` (or a small variant) — no new
infrastructure required.

---

## What I need from you to ship the widget

1. **One Gmail address** for your engineer to access the staging API in the
   browser, OR a green-light to mint a CF Access service token for the proxy.
2. **Confirmation of the public bias URL pattern** on `keepsimple.io` (so
   citations link correctly).
3. **Any tweaks to the answer post-processing rules** (strip / keep /
   stylize the `[KG]` markers).

Then the widget is just (a) build the proxy route, (b) build the popover UI,
(c) wire `fetch('/api/concierge')`. ~2–3 hours of focused work for a
KeepSimple front-end engineer.

---

## Production deployment (when you're ready)

Same image, same indexed brain, different env. Two artifacts move:

1. **The image** — pull `manager/uxcore-rag` (private repo), build, ship.
   Or push the Wolf-Server-built image to the KeepSimple registry.
2. **The brain** — snapshot the contents of the `uxcore-rag_lightrag-data`
   Docker volume from staging, restore into production's volume.
   Wolf can publish a tarball to R2 or push to a registry on demand.

Production env file pins:

- `OPENAI_API_KEY` — KeepSimple's own OpenAI key
- `STRAPI_BASE_URL` + `STRAPI_API_TOKEN` — same Strapi (no change)
- `INDEX_AUTH_HEADER` — fresh secret for the prod admin endpoint
- `CORS_ORIGINS` — pin to `https://keepsimple.io`
- `LIGHTRAG_DIR` — wherever the prod volume mounts

Don't run `/index` in production unless you intend to replace the brain.
