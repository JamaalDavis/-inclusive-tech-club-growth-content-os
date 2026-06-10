---
name: carousel
description: Generate a carousel outline from an approved content brief. 5, 7, or 10 slides. Each slide includes alt text draft and accessibility notes.
---

# Skill: Carousel Generator

## Step 1 — Generate the scaffold
```bash
npx tsx scripts/cli.ts carousel "<core thesis from brief>" [5|7|10]
```
Default: 7 slides.

## Step 2 — Fill each slide

For each slide, provide:

**Headline:** One idea. Short. No full sentences required — punchy labels work.

**Body:** 1–3 sentences. Plain language. Each slide should standalone-read.

**Visual Direction:** Describe the layout, contrast approach, and any icon/image guidance.
Always specify: no text embedded in images, minimum 4.5:1 contrast, font size minimum 16px equivalent.

**Alt Text:** Write the full alt text for the slide — everything a screen reader user needs.
Include all on-screen text verbatim plus visual description.
Format: `"Slide X of Y. [Full text on slide]. [Visual description if relevant]"`

## Slide roles by position

| Position | Role | Purpose |
|---|---|---|
| 1 | Hook | The uncomfortable truth. Earns the swipe. |
| 2 | Problem | Specific. Who experiences it. What it costs. |
| 3 (7/10 only) | Why it happens | Structural cause, not user error. |
| 3 or 4 | Insight | The reframe. What most teams get wrong. |
| Next | Framework | Named model, numbered steps, plain language. |
| Next | Practical application | Action. Starts with a verb. |
| Last | CTA | One ask. High contrast. Spoken in alt text. |

## Accessibility requirements per slide
- Minimum 4.5:1 contrast for body text; 3:1 for large text and UI elements
- No information conveyed by color alone
- Alt text written for every slide — full text + visual description
- Column layouts must linearize correctly when read by screen readers
- CTA button text must be descriptive (not "click here")

## Output
Status: `drafted`
