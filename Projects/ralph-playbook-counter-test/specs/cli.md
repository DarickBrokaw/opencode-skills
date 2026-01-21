# CLI requirements

Provide a CLI runnable as:

- `python -m counter_fixture get`
  - Prints the current counter value (integer only, newline OK).

- `python -m counter_fixture inc`
  - Increments the counter by +1 and prints the new value.

- `python -m counter_fixture run --target 10`
  - Repeatedly increments until the counter becomes exactly the target.
  - Must stop exactly at target and must not overshoot.
  - Prints the final value (integer only).

Notes:
- The CLI must operate on `counter.txt` in repo root by default.
- Keep output minimal to make it easy to assert in tests.
