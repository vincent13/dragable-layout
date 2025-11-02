@echo off
:: -- Start Next.js silently in background
start "Next.js Server" /b cmd /c "npm run start"

:: -- Wait for server to be ready
echo Waiting for Next.js server...
:waitloop
curl -s -o nul http://localhost:3000/api/getLayoutForScreen?screenId=1
if errorlevel 1 (
    timeout /t 1 >nul
    goto waitloop
)

:: -- Start Electron
start "Electron App" cmd /c "npm run electron"

echo Done!
pause