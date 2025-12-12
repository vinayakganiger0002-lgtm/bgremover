# PowerShell script to initialize Git and make initial commit

Write-Host "Initializing Git repository..." -ForegroundColor Green
git init

Write-Host "`nAdding all files..." -ForegroundColor Green
git add .

Write-Host "`nMaking initial commit..." -ForegroundColor Green
git commit -m "Initial commit: Instant Background Remover web application with API integration"

Write-Host "`nDone! Repository initialized and initial commit created." -ForegroundColor Green
Write-Host "`nNOTE: Your API key is included in script.js. Consider using environment variables for production." -ForegroundColor Yellow

