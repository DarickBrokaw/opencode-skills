"""Single-command validation wrapper referenced by AGENTS.md.

Runs: pytest, ruff check, ruff format --check.
Exits non-zero if any step fails.
Prints LOOPBACK_OK on success.
"""
import subprocess, sys

def run(cmd):
    p = subprocess.run(cmd, text=True)
    return p.returncode

def main():
    steps = [
        [sys.executable, "-m", "pytest"],
        [sys.executable, "-m", "ruff", "check", "."],
        [sys.executable, "-m", "ruff", "format", "--check", "."],
    ]
    for cmd in steps:
        code = run(cmd)
        if code != 0:
            return code
    print("LOOPBACK_OK")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
