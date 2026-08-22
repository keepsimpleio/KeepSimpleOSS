# Availability heuristics in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/availability-heuristics
- Bias entry: https://keepsimple.io/uxcore/1-availability-heuristics
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

When a page feels legitimate because it echoes the story you read this morning, that recall is the lure working. How easily something comes to mind says nothing about whether it is real.

## Scenario

A bank called NorthBank just got breached and the news is everywhere. You work somewhere else entirely, but two phishing pages still ask you for the exact same thing: your work login. The only difference between them is that one name-drops the NorthBank breach you just read about.

## Why it works

The first page earns instant suspicion: a login request out of nowhere. The second one asks for exactly the same thing, yet feels expected, because the breach is everywhere this week. That is the availability heuristic. Your brain stops asking "how likely is this real?" and starts asking "how easily can I recall it?", and right now recall is effortless. You substitute "I just read about this" for "I should verify this URL". Identical payload; the news is doing the social engineering.

## Defense

While your security team handles the perimeter, here is your homework.

- When a page leans on today’s news to get you moving, that is exactly when to slow down, not speed up. The urgency you feel is the attack working.
- Read the full hostname left to right before you type anything. Attackers stack the brand you trust as a subdomain of a domain they own. The rightmost label is the one that counts.
- Let your password manager be the judge. If it does not autofill on a login page, that page is not the one you think it is. Do not override it, close the tab.
- Treat any breach reference on a landing page as a claim, not a fact. Check the company’s own status page or Have I Been Pwned before you sign in anywhere else.
