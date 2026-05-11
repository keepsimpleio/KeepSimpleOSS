# Known Issues

This file lists known issues, intentional behaviors, and quirks that the QA agent should NOT report as findings. The agent reads this before every pass.

## How to add an entry

Each entry needs:

- A short title.
- The route(s) it affects (or "global").
- A one-sentence reason it's not a finding (intentional / wontfix / third-party / pending fix).
- Date added.

## Format

### [Short title]

- **Routes:** `/path` or `global`
- **Reason:** intentional | wontfix | third-party | pending-fix
- **Note:** One sentence.
- **Added:** YYYY-MM-DD

---

## Entries

### Cookie consent banner on first visit

- **Routes:** global
- **Reason:** intentional
- **Note:** A cookie banner appears on first visit and must be dismissed before interactions work. Agent should accept/dismiss it at the start of every pass.
- **Added:** 2026-04-28

### "New Update!" promo modal on first visit

- **Routes:** global
- **Reason:** intentional
- **Note:** A promotional modal appears on first visit and blocks clicks. Agent should dismiss it at the start of every pass.
- **Added:** 2026-04-28

### English-only header tabs: "Awareness Test" and "Bob - AI Assistant"

- **Routes:** global (header on all locale-prefixed pages)
- **Reason:** intentional
- **Note:** Per team decision, these two header tabs stay English in all locales (en/ru/hy). Same as "UX CORE / GUIDE / PERSONA" tool brand names.
- **Added:** 2026-04-28

### English-only motto: "Be Kind. Do Good."

- **Routes:** global (under UX CORE hexagon)
- **Reason:** intentional
- **Note:** Brand motto stays English in all locales. Same convention as tool brand names.
- **Added:** 2026-04-28
