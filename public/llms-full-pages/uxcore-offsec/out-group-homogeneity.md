# Out group homogeneity in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/out-group-homogeneity
- Bias entry: https://keepsimple.io/uxcore/52-out-group-homogeneity
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

You would spot a swapped teammate instantly, yet every outside contractor looks like the last one. A burned scammer only has to come back wearing a slightly different name.

## Scenario

Three weeks ago a "delivery contractor" tried to talk you into resetting a shipping credential and you shut it down. Today another external contractor asks for the same thing. It is the same person running the same script, but they sit in a wall of interchangeable outside faces you never really distinguish, so the repeat never registers. If a colleague from your own team had been quietly replaced, you would have noticed in a second.

## Why it works

This is out-group homogeneity. We encode people in our own group as distinct individuals and flatten everyone outside it into a single undifferentiated type: "them", who all look alike. Your teammates get full individual detail, so a substitution jumps out. External contractors get one shared template, so a repeat visitor slides in unrecognised. The request is identical in risk to the one you already refused, but because the second face never separated from the first in your memory, the pattern that should scream "this again" stays silent. Attackers exploit this by recycling the same play across a category you never resolve into individuals, knowing the crowd of near-identical outsiders is exactly where a burned persona can hide in plain sight.

## Defense

Your team sets vendor verification. Refusing to let "just another contractor" collapse into one anonymous blur is your part.

- Log external requests against a stable identifier (company, contract, ticket), not a face or a first name. The record remembers the repeat your memory drops.
- When an outside party asks for a credential or access change, check whether this exact ask has come before, even if the name looks new.
- Treat "all these vendors look the same" as a warning, not a convenience. That blur is the cover a returning attacker counts on.
- Give an unfamiliar outsider the same individual scrutiny you would give a teammate acting out of character. Out-group does not mean low risk.
