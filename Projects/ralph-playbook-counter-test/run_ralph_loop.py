#!/usr/bin/env python3
"""
Ralph-loop runner for Windows environments.
Simulates loop.sh functionality using subprocess to call opencode.
"""
import subprocess
import sys
import os
from pathlib import Path

def run_opencode(prompt_file, max_iterations=0):
    """Run Ralph-loop iterations."""
    iteration = 0
    
    # Get current git branch
    try:
        result = subprocess.run(['git', 'branch', '--show-current'], 
                              capture_output=True, text=True, cwd=os.getcwd())
        current_branch = result.stdout.strip()
    except Exception as e:
        print(f"Error getting git branch: {e}")
        current_branch = "master"
    
    print("========================================")
    print(f"Mode:   {'plan' if 'plan' in prompt_file else 'build'}")
    print(f"Prompt: {prompt_file}")
    print(f"Branch: {current_branch}")
    if max_iterations > 0:
        print(f"Max:    {max_iterations} iterations")
    print("========================================")
    
    # Verify prompt file exists
    if not Path(prompt_file).exists():
        print(f"Error: {prompt_file} not found")
        return 1
    
    while True:
        if max_iterations > 0 and iteration >= max_iterations:
            print(f"Reached max iterations: {max_iterations}")
            break
        
        iteration += 1
        print(f"\n=== LOOP {iteration} ===")
        
        # Run opencode with prompt from file
        try:
            with open(prompt_file, 'r') as f:
                prompt_content = f.read()
            
            # Run opencode in headless mode
            process = None
            try:
                with open(prompt_file, 'r', encoding='utf-8') as f:
                    prompt_content = f.read()
                
                # Run opencode in headless mode
                process = subprocess.Popen(
                    ['opencode', '-p',
                     '--dangerously-skip-permissions',
                     '--output-format=stream-json',
                     '--model', 'opus',
                     '--verbose'],
                    stdin=subprocess.PIPE,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    encoding='utf-8',
                    cwd=os.getcwd()
                )
                
                stdout, stderr = process.communicate(input=prompt_content, timeout=120)
                
                print("OpenCode output:")
                print(stdout[-2000:] if len(stdout) > 2000 else stdout)  # Last 2000 chars
                
                if stderr:
                    print("Stderr:", stderr[-500:] if len(stderr) > 500 else stderr)
                
            except subprocess.TimeoutExpired:
                if process:
                    process.kill()
                print("OpenCode timed out after 120 seconds")
                continue
            except Exception as e:
                print(f"Error running opencode: {e}")
                continue
        except Exception as e:
            print(f"Error running opencode: {e}")
            continue
        
        # Push changes after each iteration
        try:
            subprocess.run(['git', 'add', '-A'], cwd=os.getcwd(), check=False)
            subprocess.run(['git', 'commit', '-m', f'Ralph iteration {iteration}'], 
                          cwd=os.getcwd(), check=False)
            subprocess.run(['git', 'push', 'origin', current_branch], 
                          cwd=os.getcwd(), check=False)
            print("Changes committed and pushed")
        except Exception as e:
            print(f"Git operations failed: {e}")
        
        print(f"\n======= LOOP {iteration} =======\n")
    
    return 0

if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "build"
    max_iterations = int(sys.argv[2]) if len(sys.argv) > 2 else 0
    
    prompt_file = "PROMPT_plan.md" if mode == "plan" else "PROMPT_build.md"
    
    sys.exit(run_opencode(prompt_file, max_iterations))
