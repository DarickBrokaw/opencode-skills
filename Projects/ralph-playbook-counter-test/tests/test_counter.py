import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def run(cmd):
    r = subprocess.run(cmd, cwd=ROOT, text=True, capture_output=True)
    return r.returncode, r.stdout.strip(), r.stderr.strip()

def test_cli_help_exists():
    code, out, err = run([sys.executable, "-m", "counter_fixture", "--help"])
    # Expect help to exist eventually; initial state may fail until implemented.
    assert code == 0, f"CLI not implemented yet: code={code} out={out} err={err}"

def test_increment_exactly_one():
    # Ensure deterministic start
    (ROOT / "counter.txt").write_text("0\n", encoding="utf-8")
    code, out, err = run([sys.executable, "-m", "counter_fixture", "inc"])
    assert code == 0, f"inc failed: {out} {err}"
    assert out == "1"
    assert (ROOT / "counter.txt").read_text(encoding="utf-8").strip() == "1"
