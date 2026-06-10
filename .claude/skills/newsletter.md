---
name: newsletter
description: Draft a newsletter issue from an approved content brief, or expand a LinkedIn post into a full newsletter.
---

# Skill: Newsletter Generator

## Before you start
Read: `_context/voice-style-and-rules.md` and `_context/content-pillars.md`

## Step 1 — Generate the scaffold
```bash
npx tsx scripts/cli.ts newsletter "<core thesis from brief>"
```

## Step 2 — Write the newsletter

The scaffold has seven sections. Fill each one:

**Title:**
Specific and useful. A statement, not a teaser.
"Why accessibility audits fail disabled users" — not "Accessibility: are we doing it right?"

**Opening Thesis (2–3 sentences):**
State the central argument. Give the reader real value before the first scroll.
Do not start with a question. Do not start with "Welcome to this week's issue."

**The Problem (2–4 paragraphs):**
Name the specific problem. Not the symptom — the system.
Who created it? What maintains it? What does it cost?
Use a real example, or mark `[EXAMPLE NEEDED]`.

**Why It Matters (2–3 paragraphs):**
Business stakes, human stakes, or both.
What happens if this doesn't change? Who pays the cost?

**Inclusive Design Lens (2–4 paragraphs):**
This is the section the LinkedIn post couldn't hold.
Name the power dynamics. Surface intersectional dimensions.
Challenge the default framing. Go further than the platform post could.

**Business Value Translation (2–3 paragraphs):**
Revenue, risk, cost, brand — pick the ones that apply.
Give product leaders the language to use in their next internal meeting.

**Action Step (1–2 paragraphs):**
One thing. Starts with a verb. Specific enough to do this week.
Not "think about this more."

**CTA:**
One ask. Not three.

## Step 3 — Run voice check
```bash
npx tsx scripts/cli.ts voice "<full newsletter text>"
```
Fix any issues before proceeding.

## Output
Status: `drafted`
