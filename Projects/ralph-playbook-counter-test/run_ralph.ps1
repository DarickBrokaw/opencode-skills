#!/usr/bin/env pwsh
# Ralph-loop automated runner for Windows
# Usage: .\run_ralph.ps1 [plan|build] [maxIterations]

param(
    [string]$Mode = "build",
    [int]$MaxIterations = 5
)

$ErrorActionPreference = "Stop"
$Script:Iteration = 0

$PROMPT_FILE = if ($Mode -eq "plan") { "PROMPT_plan.md" } else { "PROMPT_build.md" }

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Ralph-Loop Automated Runner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Mode:   $Mode"
Write-Host "Prompt: $PROMPT_FILE"
Write-Host "Max:    $MaxIterations iterations"
Write-Host "========================================" -ForegroundColor Cyan

# Verify prompt file exists
if (-not (Test-Path $PROMPT_FILE)) {
    Write-Error "Error: $PROMPT_FILE not found"
    exit 1
}

# Reset counter for fresh test
"0" | Out-File -FilePath "counter.txt" -Encoding utf8
Write-Host "Counter reset to 0" -ForegroundColor Green

function Run-OpenCodeIteration {
    param([string]$PromptFile)
    
    $Script:Iteration++
    Write-Host "`n=== LOOP $($Script:Iteration) ===" -ForegroundColor Yellow
    
    try {
        $prompt = Get-Content -Path $PromptFile -Raw -Encoding utf8
        
        # Run opencode with prompt
        $process = Start-Process -FilePath "opencode" -ArgumentList @(
            "-p",
            "--dangerously-skip-permissions",
            "--output-format=stream-json",
            "--model", "opus"
        ) -PassThru -NoNewWindow -Wait
        
        $exitCode = $process.ExitCode
        Write-Host "OpenCode exit code: $exitCode" -ForegroundColor $(if ($exitCode -eq 0) { "Green" } else { "Red" })
        
        return $exitCode
        
    } catch {
        Write-Error "Error running iteration: $_"
        return 1
    }
}

# Run iterations
$success = $true
for ($i = 0; $i -lt $MaxIterations; $i++) {
    if ($Mode -eq "plan") {
        $result = Run-OpenCodeIteration -PromptFile "PROMPT_plan.md"
    } else {
        $result = Run-OpenCodeIteration -PromptFile "PROMPT_build.md"
    }
    
    if ($result -ne 0) {
        Write-Warning "Iteration $($Script:Iteration) failed with exit code $result"
        $success = $false
        break
    }
    
    # Push changes
    try {
        git add -A
        git commit -m "Ralph iteration $($Script:Iteration)" 2>&1 | Out-Null
        git push origin master 2>&1 | Out-Null
        Write-Host "Changes committed and pushed" -ForegroundColor Green
    } catch {
        Write-Warning "Git operations failed: $_"
    }
}

if ($success) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "  Ralph-Loop Completed Successfully!" -ForegroundColor Green
    Write-Host "  Total iterations: $Script:Iteration" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    
    # Final validation
    Write-Host "`nRunning final validation..." -ForegroundColor Cyan
    .\.venv\Scripts\python.exe -m pytest -v
    .\.venv\Scripts\python.exe -c "import subprocess; r=subprocess.run(['.venv\Scripts\ruff.exe', 'check', 'src/'], capture_output=True, text=True); Write-Host 'Ruff check:', ('PASS' if r.returncode -eq 0 else 'FAIL')"
    
    # Create tag
    $tagName = "0.0.$Script:Iteration"
    git tag $tagName
    Write-Host "Created git tag: $tagName" -ForegroundColor Green
    
    exit 0
} else {
    Write-Host "`n========================================" -ForegroundColor Red
    Write-Host "  Ralph-Loop Failed!" -ForegroundColor Red
    Write-Host "  Completed iterations: $Script:Iteration" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    exit 1
}
