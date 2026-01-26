---
name: revit-bridge-opencode
description: Communicate with the running DTCAI Revit add-in via its local HTTP bridge to run arbitrary Python recipes against a live document.
---

# DTCAI Revit Bridge (OpenCode)

This skill is dedicated _solely_ to talking to the DTCAI add-in’s local HTTP bridge once Revit 2025/2026 is running. It does not build or install the add-in—use the `dtc-addin-installer` skill for that. Here’s what this skill covers:

## Using the local bridge

1. Make sure Revit 2025 or 2026 is open so the add-in starts the HTTP bridge on `http://127.0.0.1:51337/execute`.
2. Retrieve the token that the add-in writes to `%APPDATA%\DTCAI\token.txt` (or set `DTC_AI_TOKEN` if you prefer). That token is required in the `x-dtc-token` header for every bridge request.
3. Use `scripts/send_to_revit_bridge.py` (packaged alongside this skill) or any HTTP client to POST JSON to the bridge:
   ```json
   {
     "code": "<your python>",
     "timeoutMs": 15000,
     "context": { "goal": "describe what you want" }
   }
   ```
   The bridge returns `{ success, stdout, result?, error?, traceback? }`. Always inspect `success`/`error` before trusting the result.
4. `code` runs with `app`, `doc`, and `__revit__` already injected, so your Python can treat them as provided objects.

## Helper script

`tools/revit-bridge/send.js` already handles token loading, JSON formatting, and timeout/error handling. Wrap it where needed, or call it directly from the plugin:

```bash
node tools/revit-bridge/send.js --code "print('hello from bridge')"
node tools/revit-bridge/send.js --file path\to\custom_script.py --timeout 20000
```

Use this skill whenever you need to send a new goal, automation script, or diagnostic into the running Revit add-in; leave the validated wall test to the companion `revit-bridge-test` skill.
