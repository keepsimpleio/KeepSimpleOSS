# Library release gates

These instructions apply before a Library release and after rollout. They supplement the project-owned keepsimple-ctl wrapper; they never change global deployment policy. Commands here are for the operator, not instructions to the user.

## Before starting

Record the approved batch, target, frontend SHA, CMS SHA (or explicit unchanged CMS SHA), schema fields and permission changes in a private journal. Inspect both deployed components. Do not infer CMS parity from frontend CI.

Run `yarn check:library` for source regressions. This uses Node and TypeScript, no browser or new testing framework. CI runs it on pull requests once this branch is merged. Until then the operator must run it locally.

Run `node scripts/release/library-release-check.cjs inspect TARGET OWNER_ID LIBRARY_ID` against the actual target/account. It checks the known database identity, exact schema fields, ownership, actual role permission, account feature flag, public read and private preference omission. Missing fields fail even if HTTP returns200. This command is read-only and is not an end-to-end certificate.

Before a release touching schema/data or permissions, create a target CMS backup through keepsimple-ctl and record its artifact. Capture content with `node scripts/release/library-release-check.cjs capture TARGET UNIQUE.json`. The file is created exclusively, under ignored docs/release-audits, with mode0600. It contains ids/fingerprints, not content or credentials. Do not overwrite a baseline.

## Feature acceptance matrix

Use an identified account and library per target. Never silently substitute a review account for Wolf. Do not mint an owner token or ship a donor endpoint to make a test pass. If owner credentials are unavailable, mark owner interaction NOT TESTED and obtain observed user acceptance; schema and permission checks cannot replace it.

| Change                  | Required evidence                                                                                                                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Collapse or visibility  | Owner action, returned value, independent GET, reload, guest privacy; nonowner rejection. Exercise both states on an authorized fixture. Do not temporarily publish a real private shelf as a test. |
| Favorites/books         | Star then edit notes, move shelf, reorder, reload; favorite/timestamp/order retained; owner and guest visibility.                                                                                   |
| Login/logout/navigation | Current session expiry, stale401 after renewed login, logout, direct username URL, dropdown to another owner, numeric redirect including object/query/locale.                                       |
| Covers                  | Deployed handler on target network, actual image type/bytes, redirect chain and denied destination, genuine no-cover case.                                                                          |
| UI                      | No native hints/capacity noise; shared styles; fixed geometry; reduced motion; hover, focus return and stacking acceptance. Do not claim browser verification when only source/HTTP checks ran.     |

## Rollout and completion

Start an authorized staging build while optional review runs. Do not bypass protected checks. Reuse evidence only for the same diff and target context. Do not create additional releases for cleanup without scope authorization.

Inspect existing rollout before redeploy. Run one deployment operation at a time. A successful CI push or wrapper exit does not prove the live image. Match frontend live BUILD_ID, running image digest and successful CI SHA with `keepsimple-ctl verify SHA`. Match CMS running digest to CMS CI output and check schema/API. Never use frontend verify as proof of CMS deployment.

After rollout, rerun target inspect and `node scripts/release/library-release-check.cjs compare TARGET BASELINE.json`. It fails on removed, added or changed protected rows/relations and on a different database identity. Concurrent user edits must be reviewed as differences; never restore automatically to force a pass. Additive data migrations require an explicit before/after mapping and independent preservation check.

Record review dispositions separately: fixed, disproved with evidence, or deferred with impact. A resolved thread alone proves none of these. Report what passed and what remains untested. Keep backup, CI, deployment, schema, permission, owner interaction and data evidence distinct.

## Scope and limitations

The inspect command does not write settings, grant permissions, deploy code, test visuals, verify provider images or claim owner save success. The regressions exercise real frontend helpers with controlled inputs and reject historical failure fixtures. The snapshot checks protected content rows, not the bytes of external media; cover copying also requires file hashes. Journal files use UTC and are never deleted or rotated by these scripts.

The target cluster identities are checked-in non-secret identifiers. Replacing a database requires deliberate review of these pins. They must never be updated merely to silence a failure.

Deployment CI also runs `library-public-check.cjs` against its target before building
or pushing the frontend image. A missing Favorites visibility field, leaked private
preference, failed directory request or missing fixture stops the deployment job.
This gate requires no CMS credentials. Its journal is retained as a CI artifact.
If a frontend change adds a backend dependency, extend this contract and deploy the
compatible CMS change first. Never bypass a failed contract to ship the frontend.

## Library metadata

Run `yarn check:library:seo` after changing Library metadata or its shared renderer.
It checks server-rendered tags, anonymous fetching, private shelf exclusion and the
public image response, including its dimensions. With `NEXT_PUBLIC_STRAPI` pointing
to the release target, `node scripts/release/library-seo-check.cjs --live` also
checks Wolf's public collection. This is read-only. After deployment, inspect the
served HTML for `/library` and `/library/wolf`; a local render does not certify a
release or refresh an external messenger's cached preview.

The pending Library batch changes the account username minimum to four characters.
The CMS companion branch is `chore/library-release-guardrails` in keepsimple-cms-new;
its validator change must be released with the frontend. Existing usernames and
records are not rewritten. Uniqueness, forbidden characters and rename cooldown
remain enforced. The database schema is unchanged.

`check:library` also checks the four-Favorites card threshold, ordering, private
content exclusion, frontend username boundaries and the rune loader stylesheet.
When the local CMS checkout exists, the batch check exercises its validator too.
A frontend-only CI run does not prove the CMS validator has been deployed.

Personal library metadata now uses the public username and a fixed personal-notes description. The thumbnail endpoint renders a 1200 by 630 PNG from local artwork and fonts after anonymous library lookup. Unknown libraries return 404; CMS failures return 503 without caching. Successful PNG responses cache for one hour. Each endpoint request emits a JSON event to container logs. Wolf retains the approved static card and collection date. The SEO check renders Latin, Cyrillic and Armenian samples and exercises endpoint method, lookup and failure responses.
