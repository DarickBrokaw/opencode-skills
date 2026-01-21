"""CLI interface for counter_fixture."""

import sys
from pathlib import Path
from .core import read_counter, increment_counter

COUNTER_FILE = Path(__file__).parent.parent.parent / "counter.txt"


def main(argv=None) -> int:
    if argv is None:
        argv = sys.argv[1:]

    if not argv:
        print("Usage: python -m counter_fixture <command> [args]")
        return 1

    command = argv[0]

    if command == "get":
        try:
            value = read_counter(str(COUNTER_FILE))
            print(value)
            return 0
        except (FileNotFoundError, ValueError) as e:
            print(f"Error: {e}", file=sys.stderr)
            return 1

    elif command in ["--help", "-h", "help"]:
        print("Usage: python -m counter_fixture <command> [args]")
        print("Commands:")
        print("  get              - Print current counter value")
        print("  inc              - Increment counter by 1 and print new value")
        print("  run --target N   - Increment until reaching target value N")
        return 0

    elif command == "inc":
        try:
            new_value = increment_counter(str(COUNTER_FILE))
            print(new_value)
            return 0
        except (FileNotFoundError, ValueError) as e:
            print(f"Error: {e}", file=sys.stderr)
            return 1

    elif command == "run":
        if len(argv) < 2 or argv[1] != "--target":
            print("Usage: python -m counter_fixture run --target <value>", file=sys.stderr)
            return 1

        try:
            target = int(argv[2])
        except (IndexError, ValueError):
            print("Error: --target requires an integer value", file=sys.stderr)
            return 1

        try:
            while True:
                current = read_counter(str(COUNTER_FILE))
                if current >= target:
                    break
                increment_counter(str(COUNTER_FILE))

            final_value = read_counter(str(COUNTER_FILE))
            print(final_value)
            return 0
        except (FileNotFoundError, ValueError) as e:
            print(f"Error: {e}", file=sys.stderr)
            return 1

    else:
        print(f"Unknown command: {command}", file=sys.stderr)
        return 1
