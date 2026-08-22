# In group favoritism in Offensive Cybersecurity

- URL: https://keepsimple.io/uxcore/cybersecurity/in-group-favoritism
- Bias entry: https://keepsimple.io/uxcore/53-in-group-favoritism
- Part of: UX Core Offensive Cybersecurity use case (social-engineering attack and defense scenarios for every cognitive bias). Also available in Russian and Armenian on the same URL via /ru and /hy prefixes.

## The tell

The same request gets waved through the moment it wears "one of us" markers. Internal, IT-managed and @yourcompany are costumes an outsider can put on, and they buy trust the request never earned.

## Scenario

A request lands asking you to connect a tool to your work accounts and grant it broad access. Wearing outsider markers (unknown vendor, external domain, nobody you know uses it) you scrutinise every line before deciding. The identical request arrives again, this time stamped "Internal tool", "IT-managed", "@yourco.com verified" and "used by your team". Nothing about what it actually asks for changed. But the in-group badges make it feel like it is already trusted, so you approve it on the strength of the stamps.

## Why it works

This is in-group favoritism. We extend trust to members of our own group far more readily than we extend it to outsiders, and we do it on the strength of group markers rather than on the merits of what is actually being asked. The request and its access scope are identical across both cards. What changes is the costume: "internal", "IT-managed", "@yourco.com", "used by your team". Each is a claim an attacker can print, and none of them is the same as the request being safe. But the badges trip the same reflex a familiar face does, and that reflex hands over scrutiny before the ask has been read. The attacker does not need to justify the access. They need to look like one of you, because the in-group tick is doing the persuading the request could never do on its own.

## Defense

Your team defines what "internal" and "IT-managed" actually mean and where they are verified. Not taking the badge as the proof is your part.

- Judge an access request by what it asks for, not by the group it claims to belong to. Broad access to your mail and files deserves the same scrutiny whoever it claims to be from.
- Treat "internal", "IT-managed" and "@yourco.com" as claims to verify through a channel you trust, never as facts because they are printed on the request.
- A verified sender domain and a matching display name are cheap to fake. Confirm a new tool with IT directly before granting it anything, in-group stamps or not.
- Notice the drop in scrutiny the moment a request feels like "one of us". That easing is the exact effect the badges were added to produce.
