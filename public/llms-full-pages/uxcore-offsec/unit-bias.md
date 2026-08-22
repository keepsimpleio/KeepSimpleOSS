# Unit bias in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/unit-bias
- Bias entry: https://keepsimple.io/uxcore/85-unit-bias
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

A "one step left" prompt is engineered so the step that remains is the dangerous one. The pull to finish the unit, not the merit of the step, is what moves your hand.

## Scenario

A setup screen tells you your account is almost secured: two steps done, one left. The screen looks tidy and nearly done. The single action left is to approve a login or read a code out loud so the "final check" can complete. Finishing feels like housekeeping, so you reach to close it out.

## Why it works

This is unit bias: we treat a single unit as a whole to be finished and feel a small, real discomfort at leaving one incomplete. A setup framed as "1 of 1 step remaining" turns an isolated, risky action into the last tile of a job, and the drive to close the job overrides the question of whether the action is safe at all. The attacker did not have to make the step look good, only to make it look like the only thing between you and done. Once completion is the goal, "approve this login" stops reading as "let a stranger in" and starts reading as "finish". The bias supplies the momentum; the payload just sits in the final slot.

## Defense

Your team can kill setup flows that ask for live approvals. Refusing to finish a unit just because it is unfinished is the part only you can do.

- Judge the last step on its own action: "approve a login I did not start" is the same risk whether it is step one or the final tile.
- A near-complete bar is a lever, not a status. Attackers place the payload in the last slot precisely because you want to close it.
- A real security setup never asks you to approve a sign-in you did not just initiate, or to read a code back to anyone.
- When a flow insists "one step remaining, finish now", that urgency is the tell. Stop, and reach the account through your own trusted path.
