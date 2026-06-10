# /inputs — Drop zone for the strategy-agent pipeline

Drop any source asset here. The file watcher detects it and tells you exactly what to say to Claude Code to start the pipeline.

## Accepted formats

| Format | What it triggers |
|---|---|
| `.png` / `.jpg` | Vision extraction → strategy-agent reads the image |
| `.md` | Text extraction → strategy-agent reads the notes |
| `.txt` | Transcript or voice note → strategy-agent extracts ideas |
| `.json` | Pre-structured brief → skip to content-agent |

## To start the watcher

```bash
python .claude/agents/hooks.py watch
```

Leave it running in a terminal. Every new file gets a prompt you can paste into Claude Code.

## Manual pipeline trigger (no watcher)

In Claude Code, tell the strategy-agent directly:

```
Read the image at inputs/my-framework.png and run the strategy-agent pipeline.
```

or

```
Read inputs/my-notes.md and run the strategy-agent pipeline.
```

## Files in this folder are not committed to git

See `.gitignore`. Outputs go to `/outputs/` after the pipeline runs.
