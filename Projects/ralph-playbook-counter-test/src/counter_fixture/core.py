"""Core counter library functions."""


def read_counter(path: str) -> int:
    """Read the first line of counter file and return as integer."""
    with open(path, "r") as f:
        first_line = f.readline()
    return int(first_line.strip())


def write_counter(path: str, value: int) -> None:
    """Write integer value to counter file with trailing newline."""
    with open(path, "w") as f:
        f.write(f"{value}\n")


def increment_counter(path: str) -> int:
    """Read, increment by 1, write back, and return new value."""
    current = read_counter(path)
    new_value = current + 1
    write_counter(path, new_value)
    return new_value
