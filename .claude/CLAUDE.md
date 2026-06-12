# ITC Content OS — Agent Orchestration

## How the agent system works

This project uses five specialized agents coordinated through this CLAUDE.md.
Each agent owns one stage of the content pipeline. No stage auto-advances — Jamaal approves each checkpoint.

## Pipeline order

```
INPUT (image / notes / transcript / idea)
  ↓
strategy-agent     → classifies, briefs, gets Jamaal approval on angle  [GATE: Jamaal must approve]
  ↓
content-agent      → drafts LinkedIn copy, carousel outline, video script; runs voice check
  ↓
inclusion-review-agent → flags issues, returns pass/revise/block         [GATE: block stops pipeline]
  ↓
growth-agent       → maps CTA, calendar slot, CRM segment, repurpose options
  ↓
governance-agent   → final hard check, sets status: reviewed
  ↓
design-agent       → Canva MCP: produces finished carousel slides from outline         (parallel)
video-agent        → ElevenLabs MCP: voice audio → HeyGen MCP: lip-synced avatar video (parallel)
audio-agent        → ElevenLabs MCP: standalone audio clip for LinkedIn / podcast       (parallel)
  ↓
delivery-agent     → packages all outputs, fires n8n webhook to Jamaal's inbox
  ↓
JAMAAL             → only human who can set status: approved → published
  ↓
n8n publish workflow → posts to LinkedIn on Jamaal's explicit approval
```

## Hard rules all agents must follow

1. **Never mark content `approved` or `published`.** Only Jamaal does that.
2. **Always read `_context/` before generating.** Especially `voice-style-and-rules.md` and `content-pillars.md`.
3. **Always run voice check and inclusion review before outputting a draft.**
4. **If inclusion review returns `block`, stop the pipeline. Do not continue to growth-agent.**
5. **Flag claims needing citation. Do not invent statistics.**
6. **Write outputs to `/outputs/[channel]/` with filename format: `YYYY-MM-DD-[slug].md`**
7. **design-agent, video-agent, and audio-agent never run if inclusion review returned `block`.**
8. **delivery-agent never fires the n8n webhook without a governance manifest at status `reviewed`.**
9. **video-agent never disables captions. Ever.**
10. **design-agent never rewrites copy. The words from content-agent are final.**

## Invoking skills

Skills live in `.claude/skills/`. Agents call them by reading the skill file and following its instructions.
Skills call the TypeScript rules engine via: `npx tsx scripts/cli.ts [command] [args]`

## Invoking sub-agents

Agents live in `.claude/agents/`. The strategy-agent is always the entry point.
Sub-agents are spawned using the Agent tool with the agent's markdown file as context.

## n8n Workflows

Two importable workflow JSON files live in `/n8n/`:

| File | Purpose |
|---|---|
| `produce-workflow.json` | Full pipeline: idea intake → all agents → Jamaal's inbox |
| `publish-workflow.json` | Approval handling: Jamaal approves → LinkedIn post |

**Environment variables required in n8n before activating:**
- `ANTHROPIC_API_KEY`
- `NOTION_CONTENT_IDEAS_DB`
- `JAMAAL_EMAIL`
- `LINKEDIN_PERSON_URN`
- `CONTENT_OS_PATH`
- `N8N_APPROVAL_WEBHOOK_URL`
- `N8N_DELIVERY_WEBHOOK_URL`

Import both workflows, configure credentials (Gmail, LinkedIn, Notion), set env vars, activate publish workflow first (to get its webhook URL), then activate produce workflow.

## Input formats accepted

Drop any of the following into `/inputs/`:
- PNG / JPG — framework, infographic, whiteboard photo
- `.md` — notes, research, messy draft
- `.txt` — transcript, voice note transcription
- `.json` — structured brief from a previous session

The hooks watcher detects new files and invokes the strategy-agent automatically.
