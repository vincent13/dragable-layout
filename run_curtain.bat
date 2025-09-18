@echo off
cd /d "C:\Java\Projects\personal projects\gridster-trial"

:: Start Next.js silently in background
start /b npm run start

:: Wait 5 seconds for server to boot
timeout /t 5 >nul

:: Start Electron curtain
npm run electron

echo Exit Code: %errorlevel%
pause