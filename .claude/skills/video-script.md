---
name: video-script
description: Generate a short-form video script (30, 60, or 90 seconds) from an approved content brief. For LinkedIn video content.
---

# Skill: Video Script Generator

## Step 1 — Generate the scaffold
```bash
npx tsx scripts/cli.ts video "<core thesis from brief>" [30|60|90]
```
Default: 60 seconds.

## Step 2 — Write the script

**Hook (5–10 seconds):**
No "Hey everyone." No "Today I want to share."
Start mid-thought. Drop into the uncomfortable truth or cost.
One sentence. At ~2.5 words per second, a 5-second hook = ~12 words maximum.

**Body sections:**
For 30s: one core insight only
For 60s: problem → insight → takeaway
For 90s: problem → why it happens → insight → practical application

Write each section as narration — how it will be spoken, not how it would be written.
Short sentences. Natural speech rhythm. No reading-aloud-awkward constructions.

**On-screen text:**
For each section: what 5–8 words appear on screen to reinforce the narration.
On-screen text must meet 4.5:1 contrast against the background.

**Scene direction:**
Talking head / text animation / B-roll — specify.
Always include: face visible for lip-reading. Background uncluttered. Lighting consistent.

**CTA (5–12 seconds):**
Spoken aloud AND displayed on screen.
One ask. Descriptive link text — not "link in bio."

## Accessibility requirements
- Captions required — not auto-caption quality. Reviewed and corrected.
- Caption font minimum 22px equivalent, white text on dark background or outline
- No flashing content (max 3 flashes per second)
- Background music below 20% volume
- Non-speech sounds described in captions: [applause], [music]

## Output
Status: `drafted`
