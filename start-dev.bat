@echo off
title Lyrics Overlay - Development
echo ========================================
echo    Lyrics Overlay - Development Mode
echo ========================================
echo.

:: Start the WebSocket server in a separate window
echo [1/2] Starting WebSocket server...
start "Lyrics Server" cmd /k "cd /d %~dp0server && node server.js"

:: Wait for server to start
timeout /t 2 /nobreak > nul

:: Start Tauri in development mode
echo [2/2] Starting Tauri Dev...
cd /d "%~dp0"
set PATH=%PATH%;%USERPROFILE%\.cargo\bin
npm run tauri dev
