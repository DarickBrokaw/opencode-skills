## Project: Counter Fixture (Ralph-loop playbook verification)

### Quick start (Windows PowerShell)
- Create venv: `py -m venv .venv`
- Activate: `.venv\Scripts\Activate.ps1`
- Install: `python -m pip install -U pip && python -m pip install -r requirements.txt`

### Quick start (bash/zsh)
- Create venv: `python -m venv .venv`
- Activate: `source .venv/bin/activate`
- Install: `python -m pip install -U pip && python -m pip install -r requirements.txt`

### Run
- CLI help: `python -m counter_fixture --help`
- Get value: `python -m counter_fixture get`
- Increment once: `python -m counter_fixture inc`
- Drive to target: `python -m counter_fixture run --target 10`

### Validation (must pass before committing in BUILD mode)
- Single command (preferred): `python tools/loopback_check.py`
- Equivalent manual commands:
  - Tests: `python -m pytest`
  - Lint: `python -m ruff check .`
  - Format: `python -m ruff format --check .`
