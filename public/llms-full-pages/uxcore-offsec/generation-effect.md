# Generation effect in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/generation-effect
- Bias entry: https://keepsimple.io/uxcore/82-generation-effect
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

A helper who never sends you a file, only tells you what to type, is not saving you a download. Self-typed commands skip the guard that a handed-over payload would trip.

## Scenario

A support agent walks you through a fix by having you paste a command into your own terminal and press enter. Because your hands ran it, it does not feel like something a stranger did to your machine. It feels like something you did. That sense of authorship is the whole trick. A file they emailed you would get scanned and second-guessed. A line you typed yourself inherits the trust you extend to your own actions, even though the agent chose every character of it.

## Why it works

This is the generation effect. Information you produce yourself is trusted and remembered more strongly than the same information handed to you, because the act of generating it makes it feel like your own. An attacker turns that against you by never delivering a payload directly: instead of sending a file that your instincts and your scanner would both interrogate, they get you to type or paste and run the command with your own hands. The moment you press enter, the action files itself under "things I did", not "things a stranger did to my machine", so the scrutiny you would apply to an inbound attachment never fires. Every character was chosen by them, but the authorship feels like yours. Self-produced feels safe even when it was dictated word for word.

## Defense

A command is not safer because your hands ran it. Judge what it does, not who typed it.

- Never paste a command you did not write and do not fully understand, no matter who is walking you through it. Support fixing your account never needs your terminal.
- Treat "run this yourself" exactly as you would treat a file they emailed you. The delivery method changed; the payload did not.
- A line that pipes a remote script straight into a shell (curl piped to sh, iex, base64 into bash) is the pattern, not a repair. Stop there.
- Verify the fix through the account's own official channel, not the chat that handed you the command. Real support can resolve it without your keyboard.
