---
name: linkedin-post
description: Draft a LinkedIn post in Jamaal's voice from an approved content brief. Supports short, medium, and carousel_intro formats.
---

# Skill: LinkedIn Post Generator

## Before you start
Read: `_context/voice-style-and-rules.md` — specifically the banned phrases list and the "What Good Looks Like" section.

## What you receive
An approved content brief (output from the content-brief skill).

## Step 1 — Generate the scaffold
```bash
npx tsx scripts/cli.ts linkedin "<core thesis from brief>" [short|medium|carousel_intro]
```
Default format: `medium`.

## Step 2 — Write the actual post

Fill in the scaffold using the approved brief. Follow these rules exactly:

**Hook (1–2 sentences):**
- Drop into the uncomfortable truth, the specific cost, or the thing most teams get wrong
- No "I want to talk about", no "Today I...", no "As a [title]..."
- No question as the opener — open with a statement
- It should feel like you picked up mid-thought

**Body (4–6 short paragraphs for medium):**
- One idea per paragraph
- Short sentences. Subject-verb-object. No subordinate clause stacking.
- Arc: specific failure → system behind it → stakes → insight
- No filler transitions ("Furthermore", "It's worth noting", "At the end of the day")

**Inclusive Design Lesson:**
- One sentence a product leader or designer can use in their next meeting
- Practical, not inspirational

**CTA:**
- One ask only
- If linking to a lead magnet, put it in the first comment, not the post body

**Hashtags:**
- Max 5
- Always include #InclusiveTechClub and #InclusiveDesign
- Add 2–3 contextual tags based on pillar

## Step 3 — Run the voice checker
```bash
npx tsx scripts/cli.ts voice "<full post text>"
```
If exit code is 1 (revise), fix the flagged issues before proceeding.
Do not pass a failing draft to the inclusion reviewer.

## Step 4 — Output
Print the completed post with metadata block.
Status: `drafted`
