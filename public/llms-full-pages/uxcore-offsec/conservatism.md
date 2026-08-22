# Conservatism in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/conservatism
- Bias entry: https://keepsimple.io/uxcore/19-conservatism
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

Familiar context is not a signature. A red flag inside a thread you already trust deserves more checking than the same flag in a cold email, because the thread is the disguise.

## Scenario

Your supplier Halden Studios wants their invoices paid to a new bank account. Version one is a fresh email from Halden saying so. Version two is a reply, three messages deep, inside the invoice thread you have been running with them since spring. Same request, same new account number. You interrogate the first one. You barely blink at the second.

## Why it works

This is conservatism, the way we cling to an existing belief and underweight evidence that should revise it. Once you have decided "this thread is legitimate", a red flag inside it has to fight that verdict, and it usually loses. The changed-account request is identical in both, but in the trusted thread your prior belief absorbs it as just another friendly message. The context you trust is exactly the cover the attacker wants, whether they hijacked the thread, spoofed the reply, or sit inside a compromised mailbox.

## Defense

Your team hardens the mailboxes. Updating your own beliefs is your job.

- A thread you trust can be hijacked or sent from an inbox that is already owned. Familiar context is not proof of who is typing.
- Any change to bank details gets an out-of-band callback to a number you already have, every time, no matter how routine the thread feels.
- Treat "our account has changed" as the single highest-risk sentence in business email. It is the whole payload of invoice fraud.
- Let a new fact actually move you. If something is off, the six months of history before it do not make it right.
