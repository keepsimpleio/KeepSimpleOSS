## Font passport
<!-- font-passport: allowed=8,9,9.14,9.5,10,10.5,11,11.5,11.52,12,12.5,13,13.5,13.6,13.76,14,14.344,14.4,15,16,17,17.6,18,18.4,20,21,22,22.4,23,24,25,26,28,30,32,34,34.56,35,36,38,40,45,48,64,76; floor=8; contrast=4.5 -->
- Allowed sizes: **8, 9, 9.14, 9.5, 10, 10.5, 11, 11.5, 11.52, 12, 12.5, 13, 13.5, 13.6, 13.76, 14, 14.344, 14.4, 15, 16, 17, 17.6, 18, 18.4, 20, 21, 22, 22.4, 23, 24, 25, 26, 28, 30, 32, 34, 34.56, 35, 36, 38, 40, 45, 48, 64, 76px**. Hard floor: **8px**.
- Contrast: **4.5:1** minimum, or **3:1** for text at 18px and above.
- If text does not fit, fix the layout. This passport outranks template and skill defaults.

# CLAUDE.md — keepsimple (for Claude Code agents)

> **Global rules apply.** Communication style + Agent Directory routing live in `~/.claude/CLAUDE.md` — read that first. This project participates in the directory; use `/send-to` to ask peers.

MemPalace wing: `keepsimple` (protocol lives in `~/.claude/CLAUDE.md`).

Human-readable agent guidelines live in `AGENTS.md` next to this file; this file is the machine-facing version. See `AGENTS.md` for repo conventions, build/test commands, and contribution rules — imported below so it loads automatically.

@AGENTS.md

## Code search — prefer CodeGraph over Grep

Repo is indexed by **CodeGraph** (MCP `codegraph`, registered globally). Use it FIRST when you have a symbol name: `codegraph_search`, `codegraph_callers`/`callees`, `codegraph_context`, `codegraph_impact`, `codegraph_files`. Grep/Glob only when query is conceptual or CodeGraph returned nothing. Index lags writes ~500ms.

## Voice for user-facing copy

When writing copy that ships to users (microcopy, page headings, marketing blurbs, articles, error messages):

- First-person, direct, no filler.
- Em-dashes and semicolons over staccato fragments — let sentences breathe; reserve short fragments for deliberate punctuation, never as default rhythm.
- Cross-disciplinary framing welcome when it actually fits (behavioral science × product × longevity × AI).
- Sparse profanity is fine when it lands; default to clean.
- No AI-isms — no "let me know if…", no "happy to help", no preamble before the answer.
- Reference piece: **"The Rise of the Choice Architect"** (article on keepsimple.io). Match its register.

## ⚠️ UX Core data is canonical

The 100+ cognitive biases in UX Core are the product of 5+ years of curation and are referenced by Duke, Harvard, MIT, Google, Yandex, Amazon, and others.

- Never fabricate bias names, slugs, citation indices, or source URLs.
- If you need structured bias data, pull from `/uxcore-api` (see AGENTS.md → Public data API). Don't scrape, don't paraphrase from memory.
- Schema changes to UX Core data require explicit approval.

## MemPalace usage (wing: `keepsimple`)

When you find yourself stuck > 10 minutes on a problem and figure it out, write a brief drawer in your wing — chronology + fix. Next-session-you won't waste the same 10 minutes. Same when a deployment/config decision is non-obvious — capture _why_ alongside _what_.
