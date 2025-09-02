#!/bin/bash
# Cursor Agent deployment workflow

# This script can be run after Cursor Agent makes changes

echo "🚀 Deploying Cursor Agent changes..."

# 1. Add all changes
git add -A

# 2. Commit with descriptive message
git commit -m "Cursor Agent: Update forum features"

# 3. Push to GitHub
git push origin main

# 4. Trigger deployment (via GitHub Actions)
echo "GitHub Actions will now deploy to your server"
echo "Monitor at: https://github.com/YOUR-REPO/actions"