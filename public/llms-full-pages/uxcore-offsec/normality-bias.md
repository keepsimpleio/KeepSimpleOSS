# Normality bias in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/normality-bias
- Bias entry: https://keepsimple.io/uxcore/58-normality-bias
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

A board that says "normal" everywhere trains you to read the one abnormal line as normal too. The anomaly did not blend in on its own, the wall of green did the blending.

## Scenario

A domain controller starts sending outbound traffic to an address it has never talked to. Flagged clearly on its own, you escalate and someone investigates within the hour. Surrounded by a wall of "Normal" tiles on the morning board, the same anomaly reads as one more line in a page that always looks fine, and you scroll past it because nothing here has ever meant anything before.

## Why it works

This is normality bias. We expect the near future to look like the recent past, and a system that has been fine for years builds a strong prior that it will stay fine, which quietly raises the bar for what counts as worth reacting to. The anomaly is identical in both cards: DC-02 reaching a host it has never contacted. What changes is the company it keeps. Alone on an alert screen, it is an exception that demands a look. Dressed like its neighbours in a wall of "Normal", it inherits their calm and gets filed as more of the same. An attacker who has moved laterally and is exfiltrating does not need the board to hide the beacon, they only need it to sit among enough normal lines that your assumption of continuity does the dismissing. The signal is on the screen. The bias is what tells you it is nothing.

## Defense

Your team tunes the alerts and baselines. Refusing to let a page of "Normal" answer for the one line that is not is your part.

- Read each line against its own baseline, not against the mood of the board. A new outbound host is abnormal whether or not everything around it is calm.
- Treat "it has always been fine" as the reason to look harder at the one thing that changed, not permission to skip it.
- Make anomalies page you out of the status board entirely, so a first-seen destination does not have to survive a wall of green to get noticed.
- When a screen feels reassuring, name the single line that would matter if it were real, then check whether that line is actually normal or just surrounded by normal.
