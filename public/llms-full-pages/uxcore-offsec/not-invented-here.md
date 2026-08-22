# Not invented here in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/not-invented-here
- Bias entry: https://keepsimple.io/uxcore/56-not-invented-here
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

"Not from our team" is not the same as "not true". The warning you dismiss for being external is the one an attacker is counting on you to shelve.

## Scenario

The same finding lands twice. From your own security channel, "auth bypass in the client portal, patch today", it is actioned within the hour, no one asks who found it. From an outside researcher, word for word the same flaw with reproduction steps attached, it reads as unsolicited noise from someone with no standing, and it sits unanswered in the queue. The flaw does not care who reported it. Every week the external report sits unread is a week the portal stays open, and attackers scan for exactly the holes that organizations have already been told about and ignored.

## Why it works

This is not-invented-here. Work from inside the tribe gets weighed on its content, work from outside gets weighed on its origin, and origin loses. The two emails carry the same flaw, the same reproduction steps, the same fix. The internal one inherits the team's standing and gets patched before lunch. The external one has to first prove the sender deserves to be read at all, and usually never gets that far. No attacker wrote either email. The attack is what happens in the gap: reported holes that stay open because the report wore the wrong return address. By the time the flaw resurfaces through an incident, the ignored mail is sitting in the queue as a timestamp of how long the door stood open.

## Defense

Your team owns the disclosure process. Making sure an outside report cannot die unread in a queue is everyone's part.

- Judge a vulnerability report by whether it reproduces, never by who sent it. A working proof of concept from a stranger outranks a hunch from a colleague.
- Route external security mail to a monitored channel with an owner and a response deadline, so "unsolicited" cannot quietly become "unread".
- Treat "probably another consultant fishing" as a hypothesis to test with the reproduction steps, not a reason to skip them.
- Every ignored report is a timestamp an attacker can beat you to. Assume the sender told you second, after telling no one, and act on that clock.
