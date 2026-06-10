---
name: content-brief
description: Generate a structured content brief from any raw input — idea, image extract, transcript, or notes. Always the first skill called in any pipeline run.
---

# Skill: Content Brief Generator

## Before you start
Read these files in order:
1. `_context/about-me.md`
2. `_context/voice-style-and-rules.md`
3. `_context/content-pillars.md`
4. `_context/working-rules.md`

## What you receive
The raw input: an idea, a block of notes, an image description, or a transcript excerpt.

## What you do

### Step 1 — Run the classifier
```bash
npx tsx scripts/cli.ts brief "<raw input>"
```
This outputs a structured brief with pillar, funnel stage, audience, value categories, power dynamics angle, inclusion angle, and claims needing citation.

### Step 2 — Fill in the core thesis
The classifier outputs `[TO FILL]` for the core thesis. You fill it in:
- One sentence
- States the single most important insight
- Should make a product leader or designer stop scrolling
- Must not start with "I want to talk about" or "In today's..."
- Must not use any banned phrases from `_context/voice-style-and-rules.md`

### Step 3 — Assess the claims needing citation
If the classifier flagged claims needing citation, note them clearly.
Do not invent statistics. Mark with `[CITATION NEEDED]` or suggest removing the claim.

### Step 4 — Output the brief
Print the completed brief as markdown.
Add at the bottom: `**Status: briefed — awaiting Jamaal approval on angle before drafting**`

## Checkpoint
Do not proceed to content-agent until Jamaal has confirmed the angle.
Ask: "Does this angle work? Any shifts before I draft?"
