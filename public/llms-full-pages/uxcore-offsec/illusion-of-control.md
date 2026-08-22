# Illusion of control in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/illusion-of-control
- Bias entry: https://keepsimple.io/uxcore/76-illusion-of-control
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

Being handed the knobs is not the same as being in control. A page that lets you "set your own security" still gets to keep whatever you type into it.

## Scenario

A page tells you a login attempt was blocked and invites you to secure the account your way. It lets you choose the verification method, set a new PIN, and pick a recovery question. You feel in charge because you are the one making the choices. Every one of those choices is a field on their server, and the account you are "securing" is the one you are handing over.

## Why it works

This is the illusion of control. When you are allowed to make choices inside a process, you feel responsible for its outcome, and that felt ownership lowers your suspicion of the process itself. The attacker does not need to convince you the page is legitimate. They just need to let you configure it, because the act of choosing a method, a PIN, and a question makes the whole flow feel like yours. Control over trivial settings gets mistaken for control over safety, and the one thing that actually matters, whose server receives your password, is the one thing you never got to choose. The more knobs they hand you, the more in charge you feel, and the less you question why you are typing a real password into an unfamiliar site.

## Defense

Your team can steer these lookalike pages away with filtering and passkeys. The move only you can make is noticing that choosing settings is not the same as being safe.

- Real account changes start from you, inside the service you already use. A page that came to you and offers to "secure your account your way" is the attack, no matter how many options it gives you.
- Separate control over settings from control over risk. Picking a PIN or a recovery question on an unknown page changes nothing about who receives it.
- Never type a current password to "confirm it is you" on a page you did not open yourself from a bookmark or the official app.
- When something feels like your decision, ask who built the menu. Feeling in charge is exactly the state this attack manufactures.
