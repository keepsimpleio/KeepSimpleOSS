# Law of triviality in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/law-of-triviality
- Bias entry: https://keepsimple.io/uxcore/95-law-of-triviality
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

A change request full of tiny things to nitpick is not sloppy. The trivia is bait, drawing your scrutiny away from the one line that matters.

## Scenario

A supplier sends an updated invoice with a dozen small things to check: a rounding fix, a typo in the address, a corrected PO number, a reformatted date. You catch and fix the little errors, feel diligent, and approve. Buried among them, the bank account number quietly changed. Attention flows to the details you can easily understand and correct, and the one field that actually matters rides through under cover of all that busywork. The padding is not carelessness. It is where your scrutiny was meant to go.

## Why it works

This is the law of triviality, also called bikeshedding: attention flows to the small, understandable details and away from the one hard thing that actually matters. A reviewer faced with a typo, a rounding error and a bank-account change engages the items they can fully grasp and fix, because catching them is easy and feels like diligence. The account number, the only field with real consequences, demands out-of-band effort to verify, so it gets less scrutiny precisely because it deserves more. An attacker pads a change request with trivia on purpose, giving your attention a comfortable place to land and a satisfying sense of a job well done. By the time you approve, you have audited everything except the line that empties the payment. The busywork was never noise. It was the cover.

## Defense

The number of small fixes is a distraction budget. Spend your scrutiny on the one field that moves money or access.

- Before touching the small stuff, find the highest-stakes field, the bank account, the payee, the permission, and verify that one first, out of band.
- Treat a change set padded with trivial corrections as a reason for more suspicion, not less. Easy fixes are where attention is meant to pool.
- Confirm any bank-detail change with the supplier through a phone number you already hold, never one on the updated document.
- Notice the feeling of "I checked it thoroughly". Diligence on the trivia can stand in for diligence on the thing that mattered.
