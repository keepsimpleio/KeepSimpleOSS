# Ikea effect in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/ikea-effect
- Bias entry: https://keepsimple.io/uxcore/84-ikea-effect
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

The hours you spent configuring a tool tell you nothing about whether it deserves your data. Effort you put in is not vetting you did.

## Scenario

You spent twenty minutes building a workspace inside a new app: picked a theme, arranged a dashboard, imported your projects. At the end it asks to connect your accounts with wide permissions. Because you built this yourself, it feels like yours, and yours feels safe. The effort you invested has quietly become the reason you trust the tool, even though you never actually checked it.

## Why it works

This is the IKEA effect, the documented tendency to place higher value on things you helped build. Effort creates attachment, and attachment reads as trust. By front-loading a long, hands-on setup, the attacker gets you to invest before they ask for anything, so that by the permission screen the workspace feels like your creation rather than a stranger's app. Something you built yourself does not feel like a threat, which is exactly the misread the design engineers. The labor you put in has nothing to do with whether the developer is honest or the scopes are appropriate, yet it quietly answers the trust question for you. The more you customise, the more it feels like yours, and the less you scrutinise the one screen that actually hands over your data.

## Defense

Admins can restrict which OAuth scopes third-party apps may request across the org. Judging a permission grant on its own terms, no matter how much setup preceded it, is the personal half.

- Effort you spent configuring a tool is not verification of the tool. Evaluate a permission request as if you had installed the app cold, one minute ago.
- Match the scope to the job. A task board or dashboard has no reason to read, send, or delete all your email or manage every file in your storage.
- Notice when a tool feels trustworthy because you built inside it. That attachment is the IKEA effect, and it tells you nothing about whether the app is safe.
- The dangerous grant usually comes at the end of the investment, when you are most attached and least skeptical. Slow down precisely there.
