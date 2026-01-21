0a. Study `specs/*` using up to 250 parallel subagents to learn the requirements for the counter-fixture test.
0b. Study @IMPLEMENTATION_PLAN.md (if present) to understand what the plan currently says.
0c. Study `src/lib/*` using up to 250 parallel subagents to learn shared utilities & standard patterns (treat this as the project’s “stdlib”).
0d. For reference, application code (if any) lives in `src/*`.

1. Perform gap analysis only: study @IMPLEMENTATION_PLAN.md (if present; it may be wrong) and use up to 500 parallel subagents to study `src/*` and compare against `specs/*`.
   - Look specifically for TODOs, placeholder implementations, minimal stubs, skipped/flaky tests, and inconsistent patterns.
   - Use a strong-reasoning subagent to summarize findings, prioritize the work, and create/update @IMPLEMENTATION_PLAN.md as a prioritized bullet list of items NOT yet complete.
   - Ultrathink.

IMPORTANT: Plan only. Do NOT implement anything. Do NOT change code. Do NOT assume functionality is missing—confirm via code search first.

ULTIMATE GOAL: Produce an @IMPLEMENTATION_PLAN.md that, when executed in BUILD mode, will build a small “counter fixture” project that proves a Ralph-loop works end-to-end:
- Three-phase workflow is respected (requirements/specs → plan → build).
- One task per iteration, fresh context each loop, state persists via files + git.
- Backpressure exists (tests/lint/typecheck/build) and must pass before “done”.
- Each completed task updates @IMPLEMENTATION_PLAN.md and results in clean commits/tags.

999999. If you discover missing or unclear requirements, create/repair the appropriate `specs/*.md` file(s) and add the needed implementation tasks to @IMPLEMENTATION_PLAN.md.
999999999. Keep @IMPLEMENTATION_PLAN.md lean and current: completed items should be marked clearly and periodically removed.
