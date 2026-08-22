# Automation bias in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/automation-bias
- Bias entry: https://keepsimple.io/uxcore/49-automation-bias
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

"The system says it is safe" is still just something someone programmed to say that. A green automated check can be the attacker’s own.

## Scenario

A page asks you to download and run a file. Framed as one person’s say-so, "trust me, this is fine", you hesitate. Framed as the verdict of an automated scanner, "Automated Security Check: PASSED, no threats found, safe to run", you relax and click. The file is identical. A machine-shaped stamp of approval, which the attacker printed themselves, overrode the caution a human claim left intact.

## Why it works

This is automation bias: our tendency to trust an automated or algorithmic verdict over our own judgment, and to relax the moment a machine appears to have checked. "Automated Security Check: PASSED" and a reassuring "AI engine" feel objective and authoritative, so the healthy hesitation a human claim left in place quietly switches off. But the green check is just text and an icon the attacker placed on their own page. It measured nothing. By dressing their approval as a system output, they borrow the credibility of automation to wave through the exact file a real scanner would flag.

## Defense

Your team runs the real scanners. Knowing a page cannot vouch for itself is your part.

- A "passed" badge on the page offering the file is not a scan, it is a picture. The page cannot certify its own safety.
- Trust security verdicts only from tools your organization runs, not from labels printed by the site hosting the download.
- "AI verified" and "automated check passed" are persuasion phrases here, not evidence. The more official the stamp, the more you check.
- When a machine seems to have decided for you, put your own judgment back in. That hand-off is exactly the lever.
