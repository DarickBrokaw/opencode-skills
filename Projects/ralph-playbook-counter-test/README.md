# Ralph playbook counter fixture (for ralph-loop plugin testing)

This repo is a **tiny, deterministic** project designed to verify the *full* Ralph Wiggum playbook workflow:
- requirements in `specs/*`
- planning via `PROMPT_plan.md` creating `IMPLEMENTATION_PLAN.md`
- building via `PROMPT_build.md` completing **one plan item per iteration** with validation + commit

## What you do
1) Put your OpenCode plugin under test at:
- `.opencode/plugins/ralph-loop.ts`  (project-local plugin dir)

OpenCode’s docs use `.opencode/plugins/` (plural). If your environment expects the legacy singular folder name, copy the same file to `.opencode/plugin/` as well. 

2) Initialize git:
- `git init`
- `git add -A`
- `git commit -m "chore: init counter fixture harness"`

3) (Optional) Create venv + install deps (see AGENTS.md)

4) Run your plugin in **PLAN** mode with `PROMPT_plan.md` as the prompt source.
- Pass if it creates/updates `IMPLEMENTATION_PLAN.md` and does **not** implement code.

5) Run your plugin in **BUILD** mode with `PROMPT_build.md` as the prompt source.
- Pass if it completes one plan item per iteration, runs validation, commits, and eventually satisfies specs.

## Evidence checklist
- `IMPLEMENTATION_PLAN.md` created by plan mode and shrinks to completion
- One commit per iteration during build
- Tests/lint/format gating via AGENTS.md

## References
- OpenCode plugin directories and load order are documented by OpenCode. 
- The Ralph Wiggum playbook pattern uses specs + plan/build prompts + shared implementation plan.
