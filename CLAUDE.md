# CLAUDE.md — keepsimple-merged (for Claude Code agents)

This file is loaded by Claude Code at session start. Human-readable agent guidelines live in `AGENTS.md` next to it; this file is the machine-facing version.

## Code search — prefer CodeGraph over Grep

This repo is indexed by **CodeGraph** (MCP server `codegraph`, registered globally). Symbol/structure queries are sub-millisecond there and dramatically cheaper than grep. Reach for it FIRST when you have a name:

- `codegraph_search` — find a symbol by name (kind + location + signature in one shot)
- `codegraph_callers` / `codegraph_callees` — function-call graph navigation
- `codegraph_context` — fastest onboarding for "what is this file/feature about?"
- `codegraph_impact` — blast radius before a rename or refactor
- `codegraph_files` — what's in a directory + per-file symbol counts

Use **Grep / Glob only when** the query is a *concept* with no symbol name ("where do we handle the Cohere fallback?"), or when a CodeGraph query returned nothing. Index lags writes ~500ms; if you just edited a file, give it a turn before re-querying.

## Everything else

See `AGENTS.md` for repo conventions, build/test commands, and contribution rules.
