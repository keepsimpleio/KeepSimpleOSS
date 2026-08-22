# Overconfidence effect in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/overconfidence-effect
- Bias entry: https://keepsimple.io/uxcore/69-overconfidence-effect
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

Being sure and being right are different things. The engineer most certain they can eyeball malicious code is the one who skips the scan that would have caught it.

## Scenario

A popular library ships a new release your service needs, and a typo-similar package sits next to it in the registry. You are about to pull it into the production build that deploys to every customer. Asked to actually rate your certainty, you would land at a cautious middle: probably the real one, but the lockfile hash and the publisher are worth thirty seconds. Feeling like the senior who has read a thousand diffs and never been fooled, you jump to certain, wave it in, and ship. The typosquatted build runs its install script on every machine it lands on.

## Why it works

This is the overconfidence effect. Across almost every domain, people rate their own judgement as more accurate than it actually is, and the gap is widest exactly where they feel most expert. The decision is identical in both cards: the same package, the same production build. What changes is the meter. At a cautious 55 you still run the publisher check and the hash compare that expose a typosquat instantly. At a certain 98 those checks feel beneath you, because confidence feels identical to competence from the inside and quietly replaces the verification that competence would actually run. A supply-chain attacker does not need the whole team to be careless. They need the one person with merge rights to be certain, because certainty is what switches the checking off, and one waved-through package ships to everyone downstream.

## Defense

Your pipeline can enforce the checks. Not trusting your own certainty enough to skip them is the part only you can do.

- Treat high confidence as the trigger to verify, not the reason to skip it. On anything that reaches production, the surer you feel, the more the thirty-second check earns its place.
- Make dependency and artifact verification a pipeline gate, not a judgement call. A hash pin and a publisher check run even when the reviewer is certain by eye.
- The belief "I would spot it in review" is a risk state, not a control. It is the precondition for merging the thing you would have caught, not protection against it.
- The more senior you are, the more your single approval ships to everyone downstream. Apply the checks hardest exactly where your judgement is trusted most.
