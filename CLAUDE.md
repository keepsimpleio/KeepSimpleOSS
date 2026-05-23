# CLAUDE.md — keepsimple (for Claude Code agents)

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

---

## ⚠️ Karpathy's 4 coding rules — apply to all work

Behavioral guidelines to reduce common LLM coding mistakes. Source: Andrej Karpathy via `multica-ai/andrej-karpathy-skills`. Bias toward caution over speed; for trivial tasks, use judgment.

### 1. Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.
- The test: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

Touch only what you must. Clean up only your own mess.

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove imports/variables/functions that YOUR changes made unused; don't remove pre-existing dead code unless asked.
- The test: every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

Define success criteria. Loop until verified.

- "Add validation" → "Write tests for invalid inputs, then make them pass."
- "Fix the bug" → "Write a test that reproduces it, then make it pass."
- "Refactor X" → "Ensure tests pass before and after."
- For multi-step tasks, state a brief plan with a verify check per step.
- Strong success criteria let you loop independently; weak ones ("make it work") force constant clarification.

Working if: fewer unnecessary diffs, fewer rewrites from overcomplication, clarifying questions land before implementation rather than after mistakes.
