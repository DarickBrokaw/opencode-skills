# Validation + “done” definition (playbook gates)

A build iteration is only “good” when:
- `python -m pytest` passes
- `python -m ruff check .` passes
- `python -m ruff format --check .` passes

The project is “done” when:
- All specs in `specs/*` are satisfied
- `IMPLEMENTATION_PLAN.md` has no remaining incomplete work (empty or clearly marked complete)
- A git tag exists for the final green state (start at 0.0.0 and increment patch)
