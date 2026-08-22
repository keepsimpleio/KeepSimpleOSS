# Illusory correlation in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/illusory-correlation
- Bias entry: https://keepsimple.io/uxcore/42-illusory-correlation
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

"Your device is slow because you are infected" is a story, not a diagnosis. A scary cause bolted onto a normal symptom is the con.

## Scenario

Your laptop is running slow, which happens for a hundred boring reasons. A pop-up states a plain fact, and you shrug. Then a second version ties that exact slowness to a frightening cause: "Slow performance detected. This is a sign your device is infected." Suddenly the ordinary symptom feels like proof of a breach, and the "clean my device now" button feels like the obvious cure.

## Why it works

This is illusory correlation, the mind’s habit of seeing a relationship between two things that are not actually linked. A slow laptop and a malware infection can co-occur, so the brain readily accepts "slow, therefore infected", even though slowness has countless innocent causes and proves nothing. The attacker supplies the missing arrow for free, welding a genuine, observable symptom to a frightening cause you cannot check. Once the link feels real, the fake "cleaner" feels like the natural remedy, and you install the very thing the pop-up pretended to detect.

## Defense

Your team can actually diagnose a machine. A web page cannot, and you knowing that is the defense.

- A website cannot scan your device. Any page claiming to have "detected an infection" is asserting a link it cannot possibly have measured.
- Separate the symptom from the story. Slow is common and boring, "therefore infected" is a claim someone bolted on to scare you.
- Never install a "cleaner" or "fix" offered by the same pop-up that raised the alarm. That is the attack, not the cure.
- Real performance issues go to your IT team or a tool you already trust, not to a button that appeared with the warning.
