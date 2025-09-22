@echo off
cd /d "C:\Java\Projects\personal projects\gridster-trial"

:: Start Next.js silently in background
start /b npm run start

:: Wait for server to be ready
echo Waiting for Next.js server...
:waitloop
curl -s -o nul http://localhost:3000/api/getLayoutForScreen?screenId=screen1'
if errorlevel 1 (
    timeout /t 1 >nul
    goto waitloop
)

:: Start Electron curtain
npm run electron

echo Exit Code: %errorlevel%
pause
