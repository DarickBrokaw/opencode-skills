0a. Study `specs/*` using up to 500 parallel subagents to learn the requirements for the counter-fixture test.
0b. Study @IMPLEMENTATION_PLAN.md.
0c. For reference, application code (if any) lives in `src/*`.

1. Your task is to implement functionality per `specs/*` using parallel subagents.
   - Follow @IMPLEMENTATION_PLAN.md and choose the single most important incomplete item to address this iteration.
   - Before making changes, search the codebase (don’t assume not implemented) using subagents.
   - You may use up to 500 parallel subagents for searches/reads and ONLY 1 subagent for build/tests (backpressure control).
   - Use strong-reasoning subagents when you hit debugging or architectural decisions.

2. Implement the chosen item completely (no stubs). Then run the required validation for that increment (tests/lint/typecheck/build) as defined in @AGENTS.md.
   - If required functionality is missing, it’s your job to add it per `specs/*`.
   - Ultrathink.

3. When you discover problems (bugs, missing requirements, mismatches), immediately update @IMPLEMENTATION_PLAN.md with the finding using a subagent.
   - When resolved, update the plan and remove/mark the item done.

4. When validation passes:
   - Update @IMPLEMENTATION_PLAN.md to reflect what’s now complete.
   - `git add -A`
   - `git commit` with a message describing what changed and *why*.
   - `git push` (optional if no remote)

99999. When writing docs or commit messages, capture the why (what failed, what changed, what made it pass).
999999. Single sources of truth: avoid migrations/adapters. If unrelated tests fail, fix them as part of the increment.
9999999. After you have zero build/test errors, create a git tag. If none exist, start at 0.0.0 then increment patch (0.0.1, 0.0.2, ...).
999999999. Keep @IMPLEMENTATION_PLAN.md current—future iterations depend on it to avoid repeating work.
9999999999. If you learn a new “how to run/build/test” detail, update @AGENTS.md (keep it brief and operational).
999999999999. Implement fully. Placeholders and stubs waste iterations.
