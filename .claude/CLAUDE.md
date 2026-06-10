# ITC Content OS — Agent Orchestration

## How the agent system works

This project uses five specialized agents coordinated through this CLAUDE.md.
Each agent owns one stage of the content pipeline. No stage auto-advances — Jamaal approves each checkpoint.

## Pipeline order

```
INPUT (image / notes / transcript / idea)
  ↓
strategy-agent     → classifies, briefs, gets Jamaal approval on angle
  ↓
content-agent      → drafts the asset(s), calls skills
  ↓
inclusion-review-agent → flags issues, returns pass/revise/block
  ↓
growth-agent       → maps CTA, calendar, repurpose options
  ↓
governance-agent   → final hard check, sets status: reviewed
  ↓
JAMAAL             → only human who can set status: approved → published
```

## Hard rules all agents must follow

1. **Never mark content `approved` or `published`.** Only Jamaal does that.
2. **Always read `_context/` before generating.** Especially `voice-style-and-rules.md` and `content-pillars.md`.
3. **Always run voice check and inclusion review before outputting a draft.**
4. **If inclusion review returns `block`, stop the pipeline. Do not continue to growth-agent.**
5. **Flag claims needing citation. Do not invent statistics.**
6. **Write outputs to `/outputs/[channel]/` with filename format: `YYYY-MM-DD-[slug].md`**

## Invoking skills

Skills live in `.claude/skills/`. Agents call them by reading the skill file and following its instructions.
Skills call the TypeScript rules engine via: `npx tsx scripts/cli.ts [command] [args]`

## Invoking sub-agents

Agents live in `.claude/agents/`. The strategy-agent is always the entry point.
Sub-agents are spawned using the Agent tool with the agent's markdown file as context.

## Input formats accepted

Drop any of the following into `/inputs/`:
- PNG / JPG — framework, infographic, whiteboard photo
- `.md` — notes, research, messy draft
- `.txt` — transcript, voice note transcription
- `.json` — structured brief from a previous session

The hooks watcher detects new files and invokes the strategy-agent automatically.
