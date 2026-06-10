---
name: voice-checker
description: Run the automated voice check on any draft. Detects banned phrases, weak hooks, vague claims, and missing systems thinking. Returns score 0–100 and verdict pass/revise.
---

# Skill: Voice Checker

## Run the check
```bash
npx tsx scripts/cli.ts voice "<full draft text>"
```

Exit codes:
- `0` = pass (score ≥ 65)
- `1` = revise (score < 65)

## What the checker catches

**Banned phrases** — 30+ phrases that signal generic AI or corporate content:
delve, game-changing, revolutionize, seamless user experience, leverage synergies,
in today's fast-paced digital landscape, unlock the power, empower, innovative solution,
thought leader, at the end of the day, moving the needle, best practices, and more.

**Weak hooks** — openings that bury the point:
"I want to talk about...", "Today I want to...", "In this post...", "As we all know..."

**Vague claims** — unattributed statistics or sweeping generalizations:
"Studies show that...", "Most companies fail to...", "Research suggests..." (without citation)

**Missing systems thinking** — content that names symptoms without naming the system:
Should include at least one of: structural, power, incentive, default, policy, who benefits, who pays

## Interpreting the report

**Score ≥ 65, verdict: pass** — proceed to inclusion reviewer

**Score < 65, verdict: revise** — fix the specific flagged items, then re-run
Do not pass a failing draft to the inclusion reviewer.

## Common fixes

| Banned phrase | Replace with |
|---|---|
| "game-changing" | Name the specific impact |
| "delve" | explore, examine, break down |
| "seamless" | Name what actually works — "checkout that doesn't require a mouse" |
| "leverage" | use, apply, build on |
| "innovative" | Name the specific thing that's different |
| "empower" | Name the actual power transfer |

For weak hooks: start with the uncomfortable truth, the specific cost, or the direct challenge.
For vague claims: source the number or replace with `[CITATION NEEDED]`.
