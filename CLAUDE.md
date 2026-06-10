# Inclusive Tech Club Growth Content OS

## Purpose

This system helps Jamaal Davis plan, generate, repurpose, review, and organize content for Inclusive Tech Club across LinkedIn, newsletters, carousels, short videos, lead magnets, and CRM nurture workflows.

The goal is not to automate Jamaal's voice. The goal is to reduce repetitive production labor, sharpen content strategy, and ensure every asset connects inclusive design to real business value.

## How to Use This System

Before every generation task, read:
- `_context/about-me.md` — who Jamaal is and what Inclusive Tech Club stands for
- `_context/voice-style-and-rules.md` — how Jamaal writes and what to avoid
- `_context/content-pillars.md` — the five content pillars that anchor all content
- `_context/working-rules.md` — hard rules that govern every output

## Hard Rules

1. **No content is ever publish-ready without Jamaal's explicit human review.** The system generates drafts. Jamaal approves.
2. **Preserve voice.** Every output must sound like Jamaal, not a corporate AI press release.
3. **Connect inclusion to business value.** Every asset should make the business case, not just the moral case.
4. **Avoid banned phrases.** Run every draft through the voice checker before marking it reviewed.
5. **Flag, don't fix.** When content has a power dynamics gap or unsupported claim, flag it with a note. Do not paper over it.
6. **Accessibility is not an edge case.** Every carousel, video script, and newsletter must include accessibility notes.

## Project Structure

```
_context/          — Context files read before every generation task
src/domain/        — Core data models and classifiers
src/services/      — Content generation and review services
src/templates/     — Markdown templates for each content format
src/__tests__/     — Vitest test suite
outputs/           — Generated content (not committed to git)
```

## Approval Stages

| Stage    | Owner            | Required Action              |
|----------|------------------|------------------------------|
| Idea     | Jamaal           | Approves direction           |
| Brief    | Strategy Agent   | Creates structured brief     |
| Draft    | Content Agent    | Generates content            |
| Review   | Inclusion + Voice| Flags issues                 |
| Approval | Jamaal           | Final decision               |
| Publish  | Jamaal           | Manual action only           |

## Content Pillars

1. Inclusive Design as Business Value
2. Human-Centered AI
3. Power Dynamics in Product Design
4. Accessibility Beyond Compliance
5. Inclusive Tech Club Builds

## Value Categories

`revenue_protection` | `revenue_growth` | `cost_reduction` | `risk_reduction` | `operational_efficiency` | `trust_and_brand` | `community_power`
