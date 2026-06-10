# Inclusive Tech Club — Growth Content OS

A TypeScript content operations system for planning, generating, reviewing, and organizing inclusive design content across LinkedIn, newsletters, carousels, short videos, lead magnets, and CRM nurture workflows.

**Core principle:** The system generates drafts. Jamaal approves. No content is ever marked published without explicit human sign-off.

---

## What it does

- Classifies raw ideas against 5 content pillars, 6 funnel stages, 7 audience segments, and 7 value categories
- Generates structured content briefs, then scaffolds (not final copy) for each format
- Runs every draft through a voice checker (51 banned phrases, weak hooks, vague claims) and an inclusion reviewer (shallow language, power gaps, harmful framing)
- Maps existing assets to repurposing opportunities with effort estimates
- Manages a content calendar with an approval workflow
- Exports structured rows for CRM nurture sequences

Everything is rule-based and local — no external APIs, no LLM calls.

---

## Tech stack

- **Language:** TypeScript 5.4, strict mode, ES2022
- **Runtime:** Node.js with ESM
- **Build:** `tsc`
- **Test:** Vitest with v8 coverage
- **Lint:** ESLint with TypeScript support
- **Scripts:** `tsx` for direct TypeScript execution

---

## Project structure

```
.
├── _context/                   # Reference docs read before every generation
│   ├── about-me.md
│   ├── voice-style-and-rules.md
│   ├── content-pillars.md
│   ├── working-rules.md
│   ├── brand-guide.md
│   ├── company.md
│   └── offer-map.md
│
├── src/
│   ├── types.ts                # All core interfaces and union types
│   ├── domain/                 # Rule engines and classifiers (pure, no side effects)
│   │   ├── content-strategy/content-pillars.ts
│   │   ├── growth-funnel/funnel-classifier.ts
│   │   ├── audience-map/audience-map.ts
│   │   └── value-map/value-map-engine.ts
│   ├── services/               # Content generation and review
│   │   ├── content-brief-generator.ts
│   │   ├── voice-checker.ts
│   │   ├── inclusion-reviewer.ts
│   │   ├── linkedin-post-generator.ts
│   │   ├── newsletter-generator.ts
│   │   ├── carousel-generator.ts
│   │   ├── video-script-generator.ts
│   │   ├── repurposing-engine.ts
│   │   ├── content-calendar.ts
│   │   └── crm-exporter.ts
│   ├── templates/              # Markdown templates per format
│   └── __tests__/              # Vitest test suite (102 tests)
│
├── scripts/
│   ├── cli.ts                  # Main CLI entry point
│   ├── demo.ts                 # Full pipeline demo
│   └── demo-framework.ts       # Framework generation demo
│
├── inputs/                     # Drop zone for content assets (not committed)
└── outputs/                    # Generated content (not committed)
```

---

## Setup

```bash
npm install
npm run build      # compile to dist/
npm run typecheck  # type check without emitting
npm test           # run all 102 tests
npm run test:coverage
```

---

## CLI usage

All services are accessible via `scripts/cli.ts`:

```bash
# Generate a structured brief from a raw idea
npx tsx scripts/cli.ts brief "<raw idea>"

# Generate content for a specific format
npx tsx scripts/cli.ts linkedin "<raw idea>" [short|medium|carousel_intro]
npx tsx scripts/cli.ts newsletter "<raw idea>"
npx tsx scripts/cli.ts carousel "<raw idea>" [5|7|10]
npx tsx scripts/cli.ts video "<raw idea>" [30|60|90]

# Review a draft
npx tsx scripts/cli.ts voice "<draft text>"       # exit 0 = pass, 1 = revise
npx tsx scripts/cli.ts inclusion "<draft text>"   # exit 0 = pass, 1 = revise, 2 = block

# Map repurposing opportunities for an existing asset
npx tsx scripts/cli.ts repurpose "<title>" "<type>" "<pillar>" "<funnel>" "<audience>"
# type: research_note | transcript | linkedin_post | newsletter | messy_notes | workshop_idea | article

# Calendar
npx tsx scripts/cli.ts calendar add "<date>" "<title>" "<channel>" "<pillar>" "<funnel>" "<cta>"
npx tsx scripts/cli.ts calendar export [json|markdown]
```

Exit codes are meaningful — agent workflows check `$?` to decide whether to proceed, revise, or halt.

---

## Content pipeline

```
INPUT
  → strategy-agent    (brief: pillar, funnel, audience, value categories)
  → content-agent     (draft scaffold for target format)
  → inclusion-review-agent  (flags power gaps, shallow language, harmful framing)
  → growth-agent      (CTA, calendar entry, repurpose map)
  → governance-agent  (status: reviewed)
  → JAMAAL            (only person who marks approved / published)
```

Inclusion review `block` status halts the pipeline. `revise` returns the draft with specific flags. Nothing proceeds to calendar without clearing both voice and inclusion checks.

---

## Domain layer

| Module | What it does |
|---|---|
| `content-pillars.ts` | Defines 5 pillars; keyword-based pillar recommender |
| `funnel-classifier.ts` | 6 funnel stages; scores and classifies ideas with confidence level |
| `audience-map.ts` | 7 audience segments; recommends primary audience from idea + pillar |
| `value-map-engine.ts` | 7 value categories; extracts business case from content |

**5 content pillars:**
1. Inclusive Design as Business Value
2. Human-Centered AI
3. Power Dynamics in Product Design
4. Accessibility Beyond Compliance
5. Inclusive Tech Club Builds

---

## Services layer

| Service | What it returns |
|---|---|
| `content-brief-generator` | Structured brief with classification, angles, risks, format recommendations |
| `voice-checker` | Score 0–100, banned phrase hits, weak hooks, rewrite suggestions |
| `inclusion-reviewer` | Pass / revise / block with per-category flags and recommended edits |
| `linkedin-post-generator` | Bracketed scaffold for short, medium, or carousel intro post |
| `newsletter-generator` | Sectioned newsletter structure with hook, body, CTA |
| `carousel-generator` | Slide-by-slide outline for 5, 7, or 10 slides |
| `video-script-generator` | Timed script for 30, 60, or 90 seconds |
| `repurposing-engine` | Ranked repurpose map with effort estimates and adaptation notes |
| `content-calendar` | In-memory calendar with status tracking; exports JSON or Markdown |
| `crm-exporter` | Structured rows for CRM nurture sequences |

Generators produce scaffolds with `[BRACKETED PROMPTS]` — they structure the work, not replace it.

---

## Approval statuses

`idea → briefed → drafted → reviewed → approved → published → repurposed`

Only `approved` and `published` can be set by Jamaal. The system enforces this at the type level.

---

## Architecture notes

- **No external APIs** — all classification is keyword and regex-based
- **Scaffolds, not generated prose** — brackets show what to write, not what it says
- **Pillar-first** — pillar assignment determines everything downstream (audience, funnel, formats, CTA)
- **Inclusion is flagged, not fixed** — the reviewer surfaces issues; Jamaal decides what to do
- **Exit codes carry workflow logic** — `0 / 1 / 2` map to proceed / revise / block
- **In-memory calendar** — no database; agents export to JSON or Markdown per session
- **Context-first** — `_context/` files are the source of truth; agents read them before generating

---

## Development

```bash
npm run test:watch     # vitest in watch mode
npm run lint           # eslint src --ext .ts
npm run demo           # full pipeline demo
npm run demo:framework # framework generation demo
```

---

## What this is not

- Not an AI writing tool — it generates structure, not prose
- Not a publishing platform — it has no CMS integration or scheduler
- Not multi-user — built for a single operator
- Not persistent — calendar state lives in memory per session; export before closing
