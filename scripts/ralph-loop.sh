#!/usr/bin/env bash

COMMAND=${1:-"bun run gsd:execute"}
MAX_ITERATIONS=${2:-20}
COMPLETION_FILE=${3:-".gsd/STATE.md"}
COMPLETION_PROMISE=${4:-"DONE"}

echo "Starting Ralph Loop (Max Iterations: $MAX_ITERATIONS)..."

for ((i=1; i<=$MAX_ITERATIONS; i++)); do
    echo "--- Iteration $i of $MAX_ITERATIONS ---"
    
    # Run the command
    eval "$COMMAND"
    
    # Check completion condition
    if [ -f "$COMPLETION_FILE" ]; then
        if grep -q "$COMPLETION_PROMISE" "$COMPLETION_FILE"; then
            echo "Completion promise '$COMPLETION_PROMISE' found in $COMPLETION_FILE. Stopping loop."
            break
        fi
    fi
    
    # Git auto-commit
    if [ -n "$(git status --porcelain)" ]; then
        echo "Changes detected. Committing..."
        git add .
        git commit -m "chore(ralph-loop): iteration $i auto-commit"
    fi
done

echo "Ralph Loop finished."
