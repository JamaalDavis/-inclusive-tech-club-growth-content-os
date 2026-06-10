---
name: inclusion-reviewer
description: Run the automated inclusion review on any draft. Checks for shallow inclusion language, power dynamics gaps, accessibility framing issues, harmful language, and overconfident AI claims.
---

# Skill: Inclusion Reviewer

## Run the review
```bash
npx tsx scripts/cli.ts inclusion "<full draft text>"
```

Exit codes:
- `0` = pass
- `1` = revise (flags present but not blocking)
- `2` = block (harmful framing or overconfident AI claims detected)

## What the reviewer catches

**Shallow inclusion language:**
Performative statements without operational meaning.
"We believe in accessibility", "inclusion is important", "diversity is our strength",
"everyone can", "inclusive culture" without structural specifics.

**Power dynamics gaps:**
- "User error" framing (shifts blame from design to user)
- "Edge case" framing (minimizes real user needs)
- Medical model language: "the disabled", "visually impaired", "hearing impaired"
- Charity framing: "helping the disabled", "serving special needs users"

**Accessibility framing issues:**
- Outdated impairment language
- WCAG-as-completion framing ("accessibility is done")
- Accessibility discussion focused only on visual access

**Harmful framing (always a BLOCK):**
"Normal users", "typical users", "special needs", "wheelchair-bound",
"despite his/her/their disability", "differently abled"

**Overconfident AI claims (always a BLOCK):**
"AI is bias-free", "AI will solve accessibility", "AI is neutral/objective"

## Responding to flags

**PASS:** Proceed to growth-agent.

**REVISE:** Fix the specific flagged items. Common fixes:
- Replace "the disabled" → "disabled people" or "people with disabilities"
- Replace "visually impaired" → "blind or low-vision users"
- Replace "helps the disabled" → name the specific design decision that removes the barrier
- Replace "edge case" → name the community affected and their real share of the user base
- Replace "we believe in accessibility" → name a specific commitment, mechanism, or measurement

**BLOCK:** Stop the pipeline.
Do not proceed. Present the block to Jamaal with the specific flags.
The content cannot move forward until the harmful framing is resolved.

## What the automated check cannot catch

The automated check catches patterns. It cannot assess:
- Whether the overall framing centers disabled people or organizational convenience
- Whether an example stereotypes or generalizes a community
- Whether the business case framing has erased the human stakes
- Intersectional blind spots (disability + race, gender + class, etc.)

These require Jamaal's judgment at the review checkpoint.
