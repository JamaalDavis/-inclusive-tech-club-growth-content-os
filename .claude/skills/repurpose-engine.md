---
name: repurpose-engine
description: Build a repurpose map for any approved source asset. Shows what derivative formats it can become, what the adaptation requires, and effort level.
---

# Skill: Repurpose Engine

## Run the map
```bash
npx tsx scripts/cli.ts repurpose "<title>" "<source type>" "<pillar>" "<funnel>" "<audience>"
```

Source types: `research_note` | `transcript` | `linkedin_post` | `newsletter` | `messy_notes` | `workshop_idea` | `article`

## What you get back

For each derivative format:
- **Format** and **channel**
- **Rationale** — why this format serves this audience and funnel stage
- **Adaptation notes** — specifically how to adapt the source, not just "reformat it"
- **Effort** — low / medium / high

## Key adaptation principles

**Repurposing is not copying.** Each derivative serves a different reader context.

| Source → Derivative | Core adaptation requirement |
|---|---|
| LinkedIn post → Newsletter | Go further. Add the systemic analysis the post couldn't hold. |
| Newsletter → LinkedIn post | Extract one insight. Not a summary — a signal. |
| Research note → Carousel | Visual argument, not visual summary. One insight per slide. |
| Research note → Lead magnet | Distill to what a practitioner needs to apply it. Not a repackage. |
| Workshop idea → Lead magnet | The free sample. One exercise that demonstrates the full workshop's value. |
| Transcript → Newsletter | Find 2–3 substantive ideas. Preserve conversational tone. Edit for structure. |
| Messy notes → anything | Generate a content brief first. Always. |

## What to preserve across all derivatives

- Original content pillar
- Business value framing
- Target audience intent
- Core argument (the thing changes form, not substance)

## Output
The repurpose map with all derivative recommendations.
Mark each with: `status: idea` — none of these are approved yet.
