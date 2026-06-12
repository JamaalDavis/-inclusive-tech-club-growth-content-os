# Product Requirements Document
## ITC Content OS — Inclusive Tech Club Growth Content Operating System

**Owner:** Jamaal Davis  
**Status:** Built — n8n setup in progress  
**Last updated:** 2026-06-12  

---

## 1. Problem

Jamaal produces content across LinkedIn, newsletters, carousels, and short video — all manually. The production process is slow, disconnected, and inconsistent. There is no systematic way to ensure every asset connects inclusive design to business value, sounds like Jamaal, and passes inclusion review before it goes anywhere near an audience.

The specific gaps:

- No structured brief process — ideas jump straight to drafts
- No voice enforcement — output drifts from Jamaal's established style
- No inclusion review — content with power gaps or harmful framing can slip through
- No visual production — carousel copy exists but designed slides do not
- No video production — scripts exist but no finished video assets
- No delivery workflow — finished content has no clear path to Jamaal's inbox for approval
- No publish gate — nothing prevents content from going live without human sign-off

---

## 2. Solution

A multi-agent content production OS that takes one raw idea and outputs a LinkedIn post, branded carousel slides, and an AI avatar video — all reviewed against voice and inclusion rules before Jamaal approves.

The system does not replace Jamaal's judgment. It removes the production weight so Jamaal's judgment is applied only where it matters: angle approval and final publish decision.

---

## 3. Operator

**Jamaal Davis** — sole operator, sole approver. No content is marked approved or published by any agent. Two gates require Jamaal's explicit action:

1. **Angle approval** — Jamaal confirms the brief direction before any drafting begins
2. **Publish approval** — Jamaal clicks approve before n8n posts to LinkedIn

---

## 4. Content Pillars

All content maps to one of five pillars:

1. Inclusive Design as Business Value
2. Human-Centered AI
3. Power Dynamics in Product Design
4. Accessibility Beyond Compliance
5. Inclusive Tech Club Builds

Pillar assignment happens at the brief stage and determines audience, funnel stage, format recommendations, and CTA downstream.

---

## 5. System Architecture

### Pipeline

```
Notion — idea added with Status: Ready
  ↓
n8n produce-workflow (Mon/Wed/Fri 8am or manual trigger)
  ↓
strategy-agent    → extract content atoms → generate brief → recommend angle
  ↓ [GATE: Jamaal approves angle via email]
content-agent     → LinkedIn copy + 7-slide carousel outline + 60s video script
                    → voice check must pass before handoff
  ↓
inclusion-review-agent → pass / revise / block
  ↓ [BLOCK: pipeline stops, Jamaal notified]
growth-agent      → CTA, calendar slot, CRM segment, repurpose options
  ↓
governance-agent  → verifies full pipeline ran, sets status: reviewed
  ↓
design-agent ─────→ Canva MCP: branded carousel slides       [parallel]
video-agent ──────→ HeyGen MCP: Jamaal avatar video          [parallel]
  ↓
delivery-agent    → packages all outputs, fires n8n webhook
  ↓
Jamaal receives approval email: copy + carousel + video + quality checks
  ↓ [GATE: Jamaal clicks Approve / Request Changes / Block]
n8n publish-workflow → posts to LinkedIn, updates Notion to Published
```

### Agent Responsibilities

| Agent | Stage | Output |
|---|---|---|
| `strategy-agent` | Brief + classification | Content atoms, brief, angle recommendation |
| `content-agent` | Draft copy + scripts | LinkedIn copy, carousel outline, video script |
| `inclusion-review-agent` | Inclusion check | Pass / revise / block verdict with flags |
| `growth-agent` | Growth metadata | CTA, calendar slot, CRM segment, repurpose map |
| `governance-agent` | Pipeline verification | Status: reviewed, governance manifest |
| `design-agent` | Visual production | Finished Canva carousel slides |
| `video-agent` | Video production | ElevenLabs voice audio → HeyGen avatar video with captions |
| `audio-agent` | Audio production | Standalone ElevenLabs audio clip for LinkedIn / podcast |
| `delivery-agent` | Delivery | Packaged approval bundle, n8n webhook |

### Content Atom Extraction (strategy-agent)

Before writing the brief, `strategy-agent` extracts discrete atoms from the raw input:

- **Insights** — non-obvious observations with business implications, mapped to a content pillar
- **Objections** — beliefs the audience holds that the content challenges
- **Quotes** — verbatim lines worth preserving
- **Patterns** — recurring observations across multi-source inputs
- **Questions** — things the audience is actively asking

Each atom is tagged with a content pillar and recommended format. The brief draws from atoms — not raw input — producing sharper theses and stronger angle recommendations.

---

## 6. Integration Stack

| Tool | Role | How |
|---|---|---|
| **Claude API** | All 8 agents | HTTP Request nodes in n8n, `claude-sonnet-4-6` |
| **n8n Cloud** | Workflow orchestration | 2 importable workflows: produce + publish |
| **Notion** | Idea intake + status tracking | ITC Content Ideas database |
| **Canva MCP** | Carousel visual production | `design-agent` via Canva MCP tools |
| **ElevenLabs MCP** | Voice synthesis | `video-agent` (voice audio) + `audio-agent` (standalone clip) |
| **HeyGen MCP** | Avatar lip-sync | `video-agent` — lip-syncs avatar to ElevenLabs audio |
| **Gmail** | Approval email delivery | n8n Gmail OAuth2 node |
| **LinkedIn** | Final publish | n8n LinkedIn OAuth2 node |
| **GitHub** | Source control | `JamaalDavis/-inclusive-tech-club-growth-content-os` |

---

## 7. Content Formats

| Format | Generator | Lengths / Variants |
|---|---|---|
| LinkedIn post | `linkedin-post-generator.ts` | Short, medium, carousel intro |
| Newsletter | `newsletter-generator.ts` | Full section structure |
| Carousel | `carousel-generator.ts` + `design-agent` | 5, 7, or 10 slides with alt text + Canva slides |
| Video script | `video-script-generator.ts` + `video-agent` | 30, 60, or 90 seconds + ElevenLabs voice + HeyGen avatar video |
| Audio clip | `audio-agent` | Standalone MP3 from same script — LinkedIn audio post / podcast |
| Lead magnet | Template | Structured long-form |
| Nurture email | Template | CRM sequence format |

---

## 8. Voice and Inclusion Rules

### Voice Checker

- 51 banned phrases enforced
- Weak hooks flagged
- Vague claims flagged
- Score 0–100 with pass / revise verdict
- `content-agent` must pass voice check before handing off to `inclusion-review-agent`

### Inclusion Reviewer

- Flags: shallow language, power dynamics gaps, harmful framing, unverified claims
- Three verdicts: `pass` / `revise` / `block`
- `block` halts the pipeline — no exceptions
- Flags are documented, not hidden or silently fixed

### Hard rules enforced across all agents

1. No content marked `approved` or `published` by any agent — only Jamaal
2. Context files (`_context/`) read before every generation task
3. Voice check must pass before inclusion review
4. `block` verdict stops the pipeline — `growth-agent` is never called on a blocked piece
5. `design-agent` never rewrites copy — words from `content-agent` are final
6. `video-agent` never disables captions — ever
7. `delivery-agent` never fires the webhook without a governance manifest at status `reviewed`

---

## 9. Approval Statuses

```
idea → briefed → drafted → reviewed → approved → published → repurposed
```

`approved` and `published` are set only by Jamaal. The TypeScript type system enforces this.

---

## 10. n8n Workflows

### produce-workflow
- **Trigger:** Schedule (Mon/Wed/Fri 8am) or manual
- **Source:** Notion ITC Content Ideas database — pulls highest-priority `Ready` idea
- **Gate 1:** Sends brief to Jamaal via email; pipeline pauses until angle approval webhook fires
- **Gate 2 (internal):** `block` verdict from `inclusion-review-agent` stops execution and notifies Jamaal
- **Output:** Approval bundle delivered to Jamaal's inbox

### publish-workflow
- **Trigger:** Webhook — fired when Jamaal clicks approve / revise / block in approval email
- **Approve path:** Posts LinkedIn copy → updates Notion to `Published` → sends confirmation email
- **Revise path:** Sends acknowledgement email, flags content for revision
- **Block path:** Sends block confirmation, removes content from pipeline

---

## 11. Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `NOTION_CONTENT_IDEAS_DB` | `37ba261e-654e-8134-88fe-f3f470e230e5` |
| `JAMAAL_EMAIL` | `jamaal.davis3@gmail.com` |
| `LINKEDIN_PERSON_URN` | `urn:li:person:XXXXXXXX` |
| `CONTENT_OS_PATH` | Absolute path to this repo |
| `N8N_APPROVAL_WEBHOOK_URL` | From publish workflow webhook node |
| `N8N_DELIVERY_WEBHOOK_URL` | From produce workflow webhook node |

---

## 12. Security Requirements

- `.env` and all variants (`.env.*`, `*.env`) are gitignored — no real values committed
- `.env.example` documents required variables with no real values
- n8n stores credentials encrypted — no API keys hardcoded in workflow nodes
- Tokens shared in chat or documents must be rotated immediately after use
- No agent can schedule or auto-publish content

---

## 13. Accessibility Requirements

Every content asset must meet WCAG 2.1 AA minimum:

- **Carousels:** minimum 4.5:1 contrast, font size 16px minimum, no text embedded in images, alt text for every slide written as `"Slide X of Y. [full text]. [visual description]"`
- **Video:** captions required on every video — no exceptions, caption font minimum 22px, white on dark background, no flashing content (max 3 flashes/second)
- **Newsletters:** logical heading hierarchy
- **Lead magnets:** accessibility checklist attached

`governance-agent` verifies accessibility compliance before passing content to `delivery-agent`.

---

## 14. TypeScript Services

| Service | What it returns |
|---|---|
| `content-brief-generator` | Structured brief: pillar, funnel, audience, angles, risks, format recommendations |
| `voice-checker` | Score 0–100, banned phrase hits, weak hooks, rewrite suggestions |
| `inclusion-reviewer` | Pass / revise / block with per-category flags |
| `linkedin-post-generator` | Bracketed scaffold for short, medium, or carousel intro |
| `newsletter-generator` | Sectioned newsletter structure |
| `carousel-generator` | Slide-by-slide outline with alt text |
| `video-script-generator` | Timed script with caption guidance and scene direction |
| `repurposing-engine` | Ranked repurpose map with effort estimates |
| `content-calendar` | In-memory calendar with status tracking |
| `crm-exporter` | Structured rows for CRM nurture sequences |

**Test coverage:** 102 tests, Vitest, all passing.

---

## 15. CLI

All services accessible locally via `scripts/cli.ts`:

```bash
npx tsx scripts/cli.ts brief "<idea>"
npx tsx scripts/cli.ts linkedin "<idea>" [short|medium|carousel_intro]
npx tsx scripts/cli.ts carousel "<idea>" [5|7|10]
npx tsx scripts/cli.ts video "<idea>" [30|60|90]
npx tsx scripts/cli.ts voice "<draft text>"      # exit 0 = pass, 1 = revise
npx tsx scripts/cli.ts inclusion "<draft text>"  # exit 0 = pass, 1 = revise, 2 = block
npx tsx scripts/cli.ts calendar add "<date>" "<title>" "<channel>" "<pillar>" "<funnel>" "<cta>"
```

Exit codes carry workflow logic — agents check `$?` to proceed, revise, or halt.

---

## 16. Non-Goals

- This system does not write final copy — it generates structure and scaffolds
- This system does not auto-publish — Jamaal is the only publish action
- This system does not replace Jamaal's voice, judgment, or relationships
- This system does not support multiple operators — built for Jamaal only
- This system does not persist calendar state between sessions — export before closing

---

## 17. Success Metrics

| Metric | Target |
|---|---|
| Time from idea to approval-ready bundle | Under 30 minutes (automated) |
| Voice check pass rate on first draft | > 80% |
| Inclusion review block rate | < 5% (blocks mean briefs need work upstream) |
| Content output cadence | 3 posts per week (Mon/Wed/Fri) |
| Carousel slides produced per post | 7 slides, fully designed, accessibility-verified |
| Video assets produced per post | 1 avatar video, captioned, 60s |
| Jamaal's manual production time per post | < 10 minutes (review + approve only) |
