# CLAUDE.md — keepsimple-merged (for Claude Code agents)

This file is loaded by Claude Code at session start. Human-readable agent guidelines live in `AGENTS.md` next to it; this file is the machine-facing version.

## Code search — prefer CodeGraph over Grep

This repo is indexed by **CodeGraph** (MCP server `codegraph`, registered globally). Symbol/structure queries are sub-millisecond there and dramatically cheaper than grep. Reach for it FIRST when you have a name:

- `codegraph_search` — find a symbol by name (kind + location + signature in one shot)
- `codegraph_callers` / `codegraph_callees` — function-call graph navigation
- `codegraph_context` — fastest onboarding for "what is this file/feature about?"
- `codegraph_impact` — blast radius before a rename or refactor
- `codegraph_files` — what's in a directory + per-file symbol counts

Use **Grep / Glob only when** the query is a _concept_ with no symbol name ("where do we handle the Cohere fallback?"), or when a CodeGraph query returned nothing. Index lags writes ~500ms; if you just edited a file, give it a turn before re-querying.

## Voice for user-facing copy

When writing copy that ships to users (microcopy, page headings, marketing blurbs, articles, error messages):

- First-person, direct, no filler.
- Em-dashes and semicolons over staccato fragments — let sentences breathe; reserve short fragments for deliberate punctuation, never as default rhythm.
- Cross-disciplinary framing welcome when it actually fits (behavioral science × product × longevity × AI).
- Sparse profanity is fine when it lands; default to clean.
- No AI-isms — no "let me know if…", no "happy to help", no preamble before the answer.
- Reference piece: **"The Rise of the Choice Architect"** (article on keepsimple.io). Match its register.

## UX Core data is canonical

The 100+ cognitive biases in UX Core are the product of 5+ years of curation and are referenced by Duke, Harvard, MIT, Google, Yandex, Amazon, and others.

- Never fabricate bias names, slugs, citation indices, or source URLs.
- If you need structured bias data, pull from `/uxcore-api` (see AGENTS.md → Public data API). Don't scrape, don't paraphrase from memory.
- Schema changes to UX Core data require explicit approval.

## Everything else

See `AGENTS.md` for repo conventions, build/test commands, and contribution rules.
