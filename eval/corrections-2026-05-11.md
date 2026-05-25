# widget_eval_v1.jsonl — corrections log

Applied 2026-05-11 by The Order. KS Lead flagged "~6 RU bias slugs inferred
from naming pattern, easy fix if wrong". Audit caught **8 corrections**
across both languages — not slug pattern errors, but **wrong bias-number IDs**.
The questions themselves are valid; only the URL targets were wrong.

| Question                            | Was                          | Fixed to                              | Why                                                               |
| ----------------------------------- | ---------------------------- | ------------------------------------- | ----------------------------------------------------------------- |
| q008 EN "halo effect"               | `/uxcore/63-halo-effect`     | `/uxcore/54-halo-effect`              | bias #63 in our corpus is "Curse of knowledge"; halo lives at #54 |
| q009 EN "negativity bias"           | `/uxcore/56-negativity-bias` | `/uxcore/17-negativity-bias`          | #56 is "Not invented here"; negativity at #17                     |
| q032 RU "эффект подтверждения"      | `25-effekt-podtverzhdeniya`  | `25-predvyatoct-podtverzhdeniya`      | slug name in corpus uses "предвзятость" prefix                    |
| q033 RU "эффект ореола"             | `63-effekt-oreola`           | `54-galo-effekt`                      | RU twin of q008 fix                                               |
| q034 RU "эффект негативности"       | `56-effekt-negativnosti`     | `17-fenomen-negativnogo-vospriyatiya` | RU twin of q009 fix                                               |
| q038 RU multi-cite                  | `25-effekt-podtverzhdeniya`  | `25-predvyatoct-podtverzhdeniya`      | secondary occurrence                                              |
| q039 RU "как не поддаваться"        | `25-effekt-podtverzhdeniya`  | `25-predvyatoct-podtverzhdeniya`      | secondary occurrence                                              |
| q041 RU "искажения в исследованиях" | `25-effekt-podtverzhdeniya`  | `25-predvyatoct-podtverzhdeniya`      | secondary occurrence                                              |

All 26 unique `expected_citations` URLs now resolve in uxcore-rag's doc_metadata.json.

For future eval versions: pull the canonical slug list from
`docker exec uxcore-rag cat /data/lightrag/doc_metadata.json | jq '.[].url'`
before authoring questions — that's the source of truth.
