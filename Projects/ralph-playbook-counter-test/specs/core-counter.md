# Core counter requirements

## Files
- `counter.txt` lives in repo root.
- It contains a single integer on the first line.

## Library behavior (required)
Implement a small, deterministic library (suggested module: `counter_fixture.core`) that provides:

- `read_counter(path) -> int`
  - Reads the first line as an integer.
  - Errors if missing / non-integer.

- `write_counter(path, value: int) -> None`
  - Writes exactly the integer plus a trailing newline.

- `increment_counter(path) -> int`
  - Reads current value, adds exactly +1, writes it back, returns new value.

## Invariants (must hold)
- Values must be integers.
- Increment is exactly +1 (no skipping).
