# DTCAI Revit Bridge Plugin for OpenCode

## Purpose
- Relay generated Python goals from OpenCode into the DTCAI add-in’s local bridge.
- Store each generated script under `scripts/goal-<timestamp>.py` so you can inspect or reuse it later.
- Return the bridge JSON response back into the OpenCode session.

## Command
- `/dtc-bridge goal <description>` — the assistant should reply with a JSON payload containing `code` (Python string) plus optional `context` metadata.

## Files
- Plugin code: `%APPDATA%\opencode\plugins\dtc-revit-bridge\.opencode\plugins\dtc-revit-bridge.ts`
- Stored scripts: `%APPDATA%\opencode\plugins\dtc-revit-bridge\scripts\goal-<timestamp>.py`

## Behavior
1. OpenCode provides the generated Python via the JSON command.
2. Plugin saves that code to the `scripts` folder for traceability.
3. Plugin posts the same code to `http://127.0.0.1:51337/execute` with the token header.
4. Plugin prints the bridge response (success/property/error/traceback) so you can confirm execution.

## Installation
1. Place the plugin folder under `%APPDATA%\opencode\plugins\dtc-revit-bridge`.
2. Restart OpenCode so the plugin loads.
3. Run `/dtc-bridge goal ...` with the generated JSON payload.

OpenCode auto-loads plugins from `%APPDATA%\opencode\plugins\*\.opencode\plugins\*.ts` and `<project>\.opencode\plugins\*.ts`.
