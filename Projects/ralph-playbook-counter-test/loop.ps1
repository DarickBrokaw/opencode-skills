#!/usr/bin/env pwsh
# Windows PowerShell equivalent of loop.sh
# Usage: .\loop.ps1 [plan] [max_iterations]

param(
    [string]$Mode = "build",
    [int]$MaxIterations = 0
)

$PROMPT_FILE = if ($Mode -eq "plan") { "PROMPT_plan.md" } else { "PROMPT_build.md" }
$ITERATION = 0
$CURRENT_BRANCH = git branch --show-current

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "Mode:   $Mode"
Write-Host "Prompt: $PROMPT_FILE"
Write-Host "Branch: $CURRENT_BRANCH"
if ($MaxIterations -gt 0) {
    Write-Host "Max:    $MaxIterations iterations"
}
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verify prompt file exists
if (-not (Test-Path $PROMPT_FILE)) {
    Write-Error "Error: $PROMPT_FILE not found"
    exit 1
}

while ($true) {
    if ($MaxIterations -gt 0 -and $ITERATION -ge $MaxIterations) {
        Write-Host "Reached max iterations: $MaxIterations"
        break
    }

    # Run Ralph iteration with selected prompt
    # -p: Headless mode (non-interactive, reads from stdin)
    # --dangerously-skip-permissions: Auto-approve all tool calls
    # --output-format=stream-json: Structured output for logging/monitoring
    # --model opus: Primary agent uses Opus for complex reasoning
    # --verbose: Detailed execution logging
    Get-Content $PROMPT_FILE | opencode -p `
        --dangerously-skip-permissions `
        --output-format=stream-json `
        --model opus `
        --verbose

    # Push changes after each iteration
    git push origin $CURRENT_BRANCH 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to push. Creating remote branch..."
        git push -u origin $CURRENT_BRANCH 2>&1 | Out-Null
    }

    $ITERATION++
    Write-Host "`n`n======================== LOOP $ITERATION ========================`n"
}
