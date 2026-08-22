# Serial position effect in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/serial-position-effect
- Bias entry: https://keepsimple.io/uxcore/105-serial-position-effect
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

If a consent list opens and closes with harmless items, read the middle twice. The risky line is placed where memory and scrutiny are weakest, between the mundane ones.

## Scenario

An app asks for permissions to connect to your calendar. The list runs seven items long. The first line is ordinary, view your basic profile. The last line is ordinary, view your language and region. Dead in the middle, where your eyes glide and your memory drops off, sits the one that matters: read and send mail on your behalf, flanked on both sides by boring scopes. You approve the screen and later recall granting something reasonable, because the parts you remember, the first and the last, were reasonable. The attacker did not hide the dangerous scope. They positioned it where you would not hold onto it.

## Why it works

This is the serial-position effect. In any list, the first items get primacy and the last get recency, so both ends are attended to and remembered while the middle sags into a blind spot. The attacker maps the permission screen onto that curve deliberately: harmless scopes anchor the top and the bottom, the two positions you will actually process and recall, and the one scope that hands over control, sending mail as you, is set in the middle where your attention is thinnest. You are not tricked by a hidden line, the dangerous scope is right there in plain text. You are tricked by placement, because after you approve, the items your memory kept are the innocuous ends, so you file the grant as reasonable. That is why the defense is to read a consent list against its curve, giving the middle the scrutiny it never gets on its own.

## Defense

The platform shows you every scope in plain text. Reading the middle as hard as the ends is the part only you can do.

- Read a permission list from the middle out, not top to bottom. The risky scope is placed where your attention naturally dips, so give the center the scrutiny the ends get for free.
- Judge each scope against what the app actually needs. A calendar tool has no reason to read and send your mail, and that mismatch is the whole tell.
- Any single scope that grants "act on your behalf", send, post, pay or delete, outweighs every harmless line around it. One dangerous grant is enough to reject the screen.
- If you cannot recall every permission a second after approving, you did not evaluate the list, you skimmed its edges. Reopen it and read it in full before you allow.
