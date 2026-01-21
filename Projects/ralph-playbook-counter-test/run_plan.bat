@echo off
chcp 65001 >nul
echo Running Ralph-loop in PLAN mode...
cd /d "%~dp0"
.venv\Scripts\python.exe -c "
import sys
with open('PROMPT_plan.md', 'r', encoding='utf-8-sig') as f:
    prompt = f.read()
print('Prompt loaded successfully')
print(f'Prompt length: {len(prompt)} characters')
"
if %errorlevel% neq 0 (
    echo Failed to load prompt
    exit /b 1
)

.venv\Scripts\python.exe -c "
import subprocess
import sys

with open('PROMPT_plan.md', 'r', encoding='utf-8-sig') as f:
    prompt = f.read()

result = subprocess.run(
    ['opencode', '-p', '--dangerously-skip-permissions', '--model', 'opus'],
    input=prompt,
    capture_output=True,
    text=True,
    encoding='utf-8',
    cwd='.',
    timeout=180
)

print('Exit code:', result.returncode)
print('Output:')
print(result.stdout[-3000:] if len(result.stdout) > 3000 else result.stdout)
if result.stderr:
    print('Errors:', result.stderr[-500:])
"
