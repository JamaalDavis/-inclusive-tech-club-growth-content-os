"""
ITC Content OS — Hooks

Two modes:
  1. Claude Code hook handler  (called by .claude/settings.json)
  2. File watcher              (run: python .claude/agents/hooks.py watch)

Claude Code hook events:
  post-write   — fires after any Write tool call
  session-end  — fires when Claude stops

File watcher:
  Monitors /inputs/ for new files.
  On new file, prints the strategy-agent invocation command so you can run it.
"""

import sys
import os
import json
import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent  # project root

# ── Helpers ────────────────────────────────────────────────────

def log(msg: str) -> None:
    ts = datetime.datetime.now().strftime("%H:%M:%S")
    print(f"[hooks {ts}] {msg}", file=sys.stderr)

def outputs_dir_write(path: str) -> bool:
    """True if the written path is inside /outputs/"""
    return "outputs" + os.sep in path or "/outputs/" in path

def is_approved_or_published(path: str) -> bool:
    """Check if a file being written claims to be approved or published."""
    try:
        content = Path(path).read_text(encoding="utf-8")
        blocked_statuses = [
            "approval_status: approved",
            "approval_status: published",
            "status: approved",
            "status: published",
            "publish-ready",
            "ready to post",
            "ready to publish",
        ]
        lower = content.lower()
        for flag in blocked_statuses:
            if flag.lower() in lower:
                return True
        return False
    except Exception:
        return False

# ── Hook: post-write ───────────────────────────────────────────

def handle_post_write(path: str) -> None:
    if not path:
        return

    if not outputs_dir_write(path):
        return  # Only enforce governance on outputs/

    log(f"Write detected in outputs/: {path}")

    if is_approved_or_published(path):
        print(
            "\n⚠️  GOVERNANCE HOOK TRIGGERED\n"
            f"File: {path}\n"
            "This file contains 'approved' or 'published' status.\n"
            "Only Jamaal can mark content approved or published.\n"
            "The governance-agent should set status: reviewed.\n"
            "Check this file before proceeding.\n",
            file=sys.stderr,
        )
        sys.exit(1)  # Non-zero exit surfaces as a warning in Claude Code

    log(f"Output file written cleanly: {Path(path).name}")

# ── Hook: session-end ──────────────────────────────────────────

def handle_session_end() -> None:
    # Count files in outputs/ with status: drafted or reviewed
    drafted = []
    reviewed = []

    outputs_path = ROOT / "outputs"
    if outputs_path.exists():
        for f in outputs_path.rglob("*.md"):
            try:
                text = f.read_text(encoding="utf-8").lower()
                if "status: reviewed" in text:
                    reviewed.append(f.name)
                elif "status: drafted" in text:
                    drafted.append(f.name)
            except Exception:
                pass

    if drafted or reviewed:
        print(
            "\n─────────────────────────────────────────\n"
            "  ITC Content OS — Session Summary\n"
            "─────────────────────────────────────────",
            file=sys.stderr,
        )
        if reviewed:
            print(f"  ✓ Awaiting Jamaal review ({len(reviewed)} file(s)):", file=sys.stderr)
            for f in reviewed:
                print(f"      {f}", file=sys.stderr)
        if drafted:
            print(f"  ◌ Still in draft ({len(drafted)} file(s)):", file=sys.stderr)
            for f in drafted:
                print(f"      {f}", file=sys.stderr)
        print(
            "\n  No content is published until Jamaal approves it.\n"
            "─────────────────────────────────────────\n",
            file=sys.stderr,
        )

# ── File watcher ───────────────────────────────────────────────

def watch_inputs() -> None:
    """
    Poll /inputs/ for new files every 2 seconds.
    When a new file appears, print the command to invoke strategy-agent.
    Requires no external dependencies — uses basic polling.
    """
    inputs_path = ROOT / "inputs"
    inputs_path.mkdir(exist_ok=True)

    seen: set[str] = set(
        str(f) for f in inputs_path.iterdir() if not f.name.startswith(".")
    )

    print(
        f"\n👁  ITC Content OS — Watching {inputs_path}\n"
        "    Drop any file into /inputs/ to trigger the pipeline.\n"
        "    Accepted: .png, .jpg, .md, .txt, .json\n"
        "    Ctrl+C to stop.\n",
        file=sys.stderr,
    )

    try:
        import time

        while True:
            current: set[str] = set(
                str(f) for f in inputs_path.iterdir() if not f.name.startswith(".")
            )
            new_files = current - seen

            for file_path in new_files:
                path = Path(file_path)
                ext = path.suffix.lower()

                log(f"New file detected: {path.name}")

                if ext in {".png", ".jpg", ".jpeg", ".webp"}:
                    print(
                        f"\n📷  Image detected: {path.name}\n"
                        f"    Run strategy-agent with vision input:\n\n"
                        f"    The strategy-agent will read this image and extract content.\n"
                        f"    In Claude Code, say:\n\n"
                        f'    "Read the image at inputs/{path.name} and run the strategy-agent pipeline."\n',
                        file=sys.stderr,
                    )
                elif ext in {".md", ".txt"}:
                    content_preview = path.read_text(encoding="utf-8")[:120].replace("\n", " ")
                    print(
                        f"\n📄  Text file detected: {path.name}\n"
                        f"    Preview: {content_preview}...\n"
                        f"    In Claude Code, say:\n\n"
                        f'    "Read inputs/{path.name} and run the strategy-agent pipeline."\n',
                        file=sys.stderr,
                    )
                elif ext == ".json":
                    print(
                        f"\n📋  JSON brief detected: {path.name}\n"
                        f"    In Claude Code, say:\n\n"
                        f'    "Load the brief from inputs/{path.name} and run content-agent."\n',
                        file=sys.stderr,
                    )

                seen.add(file_path)

            time.sleep(2)

    except KeyboardInterrupt:
        print("\n  Watcher stopped.\n", file=sys.stderr)

# ── Entry point ────────────────────────────────────────────────

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""

    if cmd == "post-write":
        path = sys.argv[2] if len(sys.argv) > 2 else os.environ.get("TOOL_INPUT_PATH", "")
        handle_post_write(path)

    elif cmd == "session-end":
        handle_session_end()

    elif cmd == "watch":
        watch_inputs()

    else:
        print(
            "Usage:\n"
            "  python .claude/agents/hooks.py post-write <path>\n"
            "  python .claude/agents/hooks.py session-end\n"
            "  python .claude/agents/hooks.py watch\n",
            file=sys.stderr,
        )
