@echo off
title Lyrics Overlay
echo ========================================
echo    Lyrics Overlay - Starting...
echo ========================================
echo.

:: Start the WebSocket server in background
echo [1/2] Starting WebSocket server...
start /B node "%~dp0server\server.js"

:: Wait for server to start
timeout /t 2 /nobreak > nul

:: Start the Tauri app
echo [2/2] Starting Lyrics Overlay...
echo.
echo Press Ctrl+C to close when done.
echo.

cd /d "%~dp0"
npm run tauri dev
