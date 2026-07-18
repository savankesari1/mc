param (
    [string]$Command = "bun run gsd:execute",
    [int]$MaxIterations = 20,
    [string]$CompletionFile = ".gsd/STATE.md",
    [string]$CompletionPromise = "DONE"
)

Write-Host "Starting Ralph Loop (Max Iterations: $MaxIterations)..." -ForegroundColor Cyan

for ($i = 1; $i -le $MaxIterations; $i++) {
    Write-Host "--- Iteration $i of $MaxIterations ---" -ForegroundColor Yellow
    
    # Run the command
    Invoke-Expression $Command
    
    # Check if we should stop
    if (Test-Path $CompletionFile) {
        $content = Get-Content $CompletionFile -Raw
        if ($content -match $CompletionPromise) {
            Write-Host "Completion promise '$CompletionPromise' found in $CompletionFile. Stopping loop." -ForegroundColor Green
            break
        }
    }
    
    # Git auto-commit if changes exist
    $status = git status --porcelain
    if ($status) {
        Write-Host "Changes detected. Committing..." -ForegroundColor Cyan
        git add .
        git commit -m "chore(ralph-loop): iteration $i auto-commit"
    } else {
        Write-Host "No changes detected in this iteration." -ForegroundColor Gray
    }
}

Write-Host "Ralph Loop finished." -ForegroundColor Green
