# Curse of knowledge in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/curse-of-knowledge
- Bias entry: https://keepsimple.io/uxcore/63-curse-of-knowledge
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

Jargon you recognise is not jargon you read. The more a scope sounds like standard boilerplate, the less an expert actually parses what it grants.

## Scenario

A developer tool asks to connect to your account. In plain words, "sign in to other services as you" makes you stop and ask why a build tool needs that. Rewrite it as "act-as impersonation via delegated token exchange" and the same person, precisely because they know the terms, files it under standard OAuth boilerplate and grants it. The expertise that should protect them is what talks them past the read.

## Why it works

This is the curse of knowledge. Once you know a domain, you cannot easily model not knowing it, and you assume familiar-looking terms carry their familiar, safe meaning. To an expert, "delegated token exchange" and "offline refresh grant" read as the ordinary furniture of every OAuth screen, so the eye certifies them as standard and moves on. The grant is identical in risk to the plain-language version, which the same person would have questioned. The jargon does not add capability, it removes scrutiny, because recognising the words feels like having read them. Attackers do not hide the dangerous scope from the novice here. They hide it from the expert, inside the vocabulary the expert trusts.

## Defense

Your platform names the scopes. Translating each one back into plain intent before you grant is your part.

- Say each scope out loud in plain words: what can this app now do to me. If you cannot, you have not read it, you have recognised it.
- Treat "impersonation", "act-as", and "delegated" as full stops however routine they sound. They mean the app can be you.
- Familiarity is not review. The scopes you have seen a hundred times are the ones worth reading on the hundred-and-first.
- Match the grant to the tool's actual job. A build runner reading your repos is expected. A build runner acting as you elsewhere is not.
