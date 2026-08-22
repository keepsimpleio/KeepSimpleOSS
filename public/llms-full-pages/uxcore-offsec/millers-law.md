# Millers law in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/millers-law
- Bias entry: https://keepsimple.io/uxcore/61-millers-law
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

A long permission list looks thorough and reads as forgettable. The scope that matters is rarely first or last. It sits in the middle, where your memory quietly drops it.

## Scenario

A scheduling app asks to connect to your work account. In a short list, "send payments on your behalf" jumps out and you stop. Pad the same request with eight ordinary-sounding scopes and put the payment one seventh down, and it lands in the exact slot your working memory cannot hold. You read the top, you glance at the bottom, and the middle blurs into "the usual stuff" as you press allow.

## Why it works

This is Miller's Law. Working memory holds only a handful of items at once, somewhere near seven, before older items get pushed out to make room for new ones. A three-item list fits inside that window, so the payment scope stays lit the whole time you read. A nine-item list overflows it: by the time you reach the seventh scope, the first few have already dropped, and the danger sits in the gap between what you have forgotten and what you have not yet reached. The grant is identical in risk across both cards. The only thing that changed is the padding, and the padding is enough, because it moves the one scope that matters into the slot your memory cannot keep.

## Defense

Your platform decides which scopes an app can even request. Reading the long ones instead of skimming them is your part.

- Read a permission list to its end before granting, slowest through the middle where attention naturally sags. Length is a hiding place, not a reassurance.
- Any scope that moves money, sends on your behalf, or writes data deserves a full stop, whatever position it sits in.
- When a simple tool asks for a long list, the length itself is the signal. A scheduler does not need to pay anyone.
- Grant scopes one purpose at a time where the platform allows it, so no single item can ride in on the crowd around it.
