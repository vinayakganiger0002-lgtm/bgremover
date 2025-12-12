@echo off
echo Initializing Git repository...
git init

echo.
echo Adding all files...
git add .

echo.
echo Making initial commit...
git commit -m "Initial commit: Instant Background Remover web application with API integration"

echo.
echo Done! Repository initialized and initial commit created.
echo.
echo NOTE: Your API key is included in script.js. Consider using environment variables for production.
pause

