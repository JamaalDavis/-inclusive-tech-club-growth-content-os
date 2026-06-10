# Inclusive Tech Club — Growth Content OS

A TypeScript content operations system for planning, generating, reviewing, and publishing inclusive design content across LinkedIn, newsletters, carousels, short videos, lead magnets, and CRM nurture workflows — automated end-to-end via n8n, Canva, and HeyGen.

**Core principle:** The system generates drafts. Jamaal approves. No content is ever marked published without explicit human sign-off.

---

## What it does

- Classifies raw ideas against 5 content pillars, 6 funnel stages, 7 audience segments, and 7 value categories
- Generates structured content briefs, then drafts LinkedIn copy, carousel outlines (with alt text), and video scripts
- Runs every draft through a voice checker (51 banned phrases, weak hooks, vague claims) and an inclusion reviewer (shallow language, power gaps, harmful framing)
- Produces finished branded carousel slides via **Canva MCP**
- Produces AI avatar videos (Jamaal's face and voice) via **HeyGen MCP**
- Packages all outputs and fires an **n8n** webhook to Jamaal's email for review
- Posts to LinkedIn automatically when Jamaal clicks approve — and only then
- Maps existing assets to repurposing opportunities with effort estimates
- Manages a content calendar with an approval workflow
- Exports structured rows for CRM nurture sequences

---

## Tech stack

- **Language:** TypeScript 5.4, strict mode, ES2022
- **Runtime:** Node.js with ESM
- **Test:** Vitest (102 tests)
- **Lint:** ESLint with TypeScript support
- **Scripts:** `tsx` for direct TypeScript execution
- **Automation:** n8n Cloud (2 importable workflows)
- **Design:** Canva MCP
- **Video:** HeyGen MCP (avatar + voice clone)
- **Content DB:** Notion (ITC Content Ideas database)

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
├── .claude/
│   ├── agents/                 # Agent instruction files
│   │   ├── strategy-agent.md
│   │   ├── content-agent.md
│   │   ├── inclusion-review-agent.md
│   │   ├── growth-agent.md
│   │   ├── governance-agent.md
│   │   ├── design-agent.md     # Canva MCP — carousel slides
│   │   ├── video-agent.md      # HeyGen MCP — avatar video
│   │   └── delivery-agent.md   # Packages outputs + fires n8n webhook
│   └── skills/                 # Skill instruction files
│
├── n8n/
│   ├── produce-workflow.json   # Full pipeline: Notion idea → approval email
│   ├── publish-workflow.json   # Approval handler: approve/revise/block → LinkedIn
│   └── setup-guide.md          # Step-by-step n8n Cloud configuration
│
├── .env.example                # Required environment variables (no real values)
├── inputs/                     # Drop zone for content assets (not committed)
└── outputs/                    # Generated content (not committed)
```

---

## Content pipeline

```
Notion — add idea with Status: Ready
  ↓
n8n produce-workflow fires (Mon/Wed/Fri 8am or manual)
  ↓
strategy-agent    → content brief: pillar, funnel, audience, value categories
  ↓ [GATE: Jamaal approves angle via email]
content-agent     → LinkedIn copy + 7-slide carousel outline + 60s video script
                    runs voice check before handing off
  ↓
inclusion-review-agent → pass / revise / block
  ↓ [BLOCK stops pipeline, Jamaal notified]
growth-agent      → CTA, calendar slot, CRM segment, repurpose options
  ↓
governance-agent  → final pipeline verification, sets status: reviewed
  ↓
design-agent ─────→ Canva MCP: branded carousel slides (parallel)
video-agent ──────→ HeyGen MCP: Jamaal avatar video   (parallel)
  ↓
delivery-agent    → packages all outputs, fires n8n webhook
  ↓
Jamaal receives approval email with copy, carousel, video, and quality checks
  ↓ [GATE: Jamaal clicks Approve / Request Changes / Block]
n8n publish-workflow → posts to LinkedIn, updates Notion to Published
```

Inclusion review `block` halts the pipeline. Nothing reaches Jamaal without passing voice check and inclusion review. Nothing posts without Jamaal's explicit approval click.

---

## Agent team

| Agent | Stage | Tools |
|---|---|---|
| `strategy-agent` | Brief + classification | Claude API |
| `content-agent` | Draft copy + scripts | Claude API, voice checker |
| `inclusion-review-agent` | Flag issues | Claude API |
| `growth-agent` | CTA + calendar + CRM | Claude API |
| `governance-agent` | Final pipeline check | Claude API |
| `design-agent` | Carousel slides | Canva MCP |
| `video-agent` | Avatar video | HeyGen MCP |
| `delivery-agent` | Package + notify | n8n webhook |

---

## n8n Setup

See [n8n/setup-guide.md](n8n/setup-guide.md) for full step-by-step instructions.

**Quick summary:**
1. Add credentials in n8n Cloud: Anthropic (Header Auth), Gmail (OAuth2), LinkedIn (OAuth2), Notion (API key)
2. Set 7 environment variables (see `.env.example`)
3. Import `n8n/publish-workflow.json` → activate → copy webhook URL
4. Import `n8n/produce-workflow.json` → activate
5. Add an idea to Notion with Status: `Ready` → manual test run

**Required environment variables:**

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `NOTION_CONTENT_IDEAS_DB` | Notion content ideas database ID |
| `JAMAAL_EMAIL` | Approval email recipient |
| `LINKEDIN_PERSON_URN` | `urn:li:person:XXXXXXXX` |
| `CONTENT_OS_PATH` | Absolute path to this directory |
| `N8N_APPROVAL_WEBHOOK_URL` | From publish workflow webhook node |
| `N8N_DELIVERY_WEBHOOK_URL` | From produce workflow webhook node |

---

## CLI usage

All services are accessible via `scripts/cli.ts` for local runs outside n8n:

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

# Calendar
npx tsx scripts/cli.ts calendar add "<date>" "<title>" "<channel>" "<pillar>" "<funnel>" "<cta>"
npx tsx scripts/cli.ts calendar export [json|markdown]
```

Exit codes carry workflow logic — `0 / 1 / 2` map to proceed / revise / block.

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
| `carousel-generator` | Slide-by-slide outline for 5, 7, or 10 slides with alt text |
| `video-script-generator` | Timed script for 30, 60, or 90 seconds with caption guidance |
| `repurposing-engine` | Ranked repurpose map with effort estimates and adaptation notes |
| `content-calendar` | In-memory calendar with status tracking; exports JSON or Markdown |
| `crm-exporter` | Structured rows for CRM nurture sequences |

---

## Approval statuses

`idea → briefed → drafted → reviewed → approved → published → repurposed`

Only `approved` and `published` can be set by Jamaal. The system enforces this at the type level.

---

## Architecture notes

- **Scaffolds, not generated prose** — brackets show what to write, not what it says
- **Pillar-first** — pillar assignment determines everything downstream (audience, funnel, formats, CTA)
- **Inclusion is flagged, not fixed** — the reviewer surfaces issues; Jamaal decides what to do
- **Exit codes carry workflow logic** — `0 / 1 / 2` map to proceed / revise / block
- **Two hard gates** — angle approval and final publish approval require Jamaal's explicit action
- **Design and video are parallel** — Canva and HeyGen run simultaneously after governance passes
- **Fallback-safe** — if Canva or HeyGen fails, delivery-agent includes the error and pipeline continues to Jamaal with a manual fallback note
- **Context-first** — `_context/` files are the source of truth; agents read them before generating

---

## Development

```bash
npm install
npm test           # run all 102 tests
npm run test:watch # vitest in watch mode
npm run lint       # eslint src --ext .ts
```

---

## Security

- Never commit `.env` — all variants are gitignored (`.env`, `.env.*`, `*.env`)
- Use `.env.example` as the reference for required variables — it contains no real values
- n8n stores credentials encrypted; do not hardcode API keys in workflow nodes
- Rotate tokens after sharing them in any chat or document
