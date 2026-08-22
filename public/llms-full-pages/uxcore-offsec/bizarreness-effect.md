# Bizarreness effect in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/bizarreness-effect
- Bias entry: https://keepsimple.io/uxcore/12-bizarreness-effect
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

Remembering a sender is not the same as having a relationship with one. When "I know these people" traces back only to something odd you once laughed at, check the ledger before you pay.

## Scenario

Week one: an invoice from Andes Logistics arrives with a llama mascot, a cheerful font, and a sum too small to escalate. No urgency, no demand. Just weird enough to show a colleague, laugh, and archive. Week three: Andes Logistics, "the llama folks", send their quarterly invoice with updated bank details. And somehow they feel like a vendor you know.

## Why it works

Weird things stick in memory. A llama on an invoice outlives a hundred beige PDFs. The trap is what your brain does with that recall later: "I remember these people" silently upgrades to "we work with these people". Recognition starts doing the job that a contract, a purchase order, and an accounts-payable record are supposed to do. The first invoice was never meant to be paid. It was meant to be remembered. Three weeks later, the second invoice collects on that memory, together with the real payload: new bank details.

## Defense

While your security team handles the perimeter, here is your homework.

- Memorable is not the same as real. Before paying "again", check the ledger: was this vendor ever onboarded, contracted, or paid before? If the only record is your memory of a mascot, there is no record.
- A tiny first invoice with no payment pressure is a known setup move. It exists to create history. Odd, low-stakes, no-ask documents from unknown senders deserve a report, not an archive.
- Bank-details changes get verified by a callback to the number from the signed contract. That rule does not care how familiar the sender feels. Familiarity is exactly what the attacker spent three weeks making.
- Make "funny" a trigger for process, not comfort. The moment a vendor is memorable enough to joke about, it is memorable enough to look up in accounts payable.
