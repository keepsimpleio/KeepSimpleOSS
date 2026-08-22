# Decoy effect in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/decoy-effect
- Bias entry: https://keepsimple.io/uxcore/92-decoy-effect
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

When one option is obviously worse and it is right there for comparison, it was put there to steer you. The decoy exists to be rejected, so the choice beside it looks wise.

## Scenario

A pop-up says your session flagged a security risk and offers three ways to resolve it. You are not really choosing between three options. You are choosing between two, because the middle one was built to be rejected, and its only job is to make the attacker's option look like the calm, reasonable middle path.

## Why it works

This is the decoy effect, or asymmetric dominance. Add a third option that is clearly worse than one of the existing two, and it drags your preference toward the option it is worse than, even though the decoy itself is never chosen. The lockout option is the decoy: nobody wants fourteen days locked out, so the "one-click helper" stops looking like "install unknown software from a pop-up" and starts looking like "the quick, reasonable one". Your judgement quietly shifts from "is this safe at all?" to "which of these is best?", which is exactly the question the attacker wants you answering. The decoy costs them nothing to add and reframes their payload as the moderate choice.

## Defense

Your team can block the pop-ups it sees. Refusing the menu itself is the part only you can do in the moment.

- When a prompt gives you a set of options, add the one it left out: "none of these, I leave and check for myself." The absent option is usually the safe one.
- A deliberately awful choice sitting next to a convenient one is a tell. It is there to make the convenient one look moderate, not to be chosen.
- A web page cannot detect a risk on your session or your device. Any three-way "how would you like to resolve this" is a frame, not a diagnosis.
- Judge the option you are drawn to on its own: "install this" or "enter my password" is the same risk whether or not a worse option sits beside it.
