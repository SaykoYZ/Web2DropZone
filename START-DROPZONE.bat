@echo off
setlocal
cd /d "%~dp0"
title DROPZONE GENERATOR

echo ==========================================
echo        DROPZONE GENERATOR
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed.
  echo Install Node.js and run this file again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm is not available.
  pause
  exit /b 1
)

echo [1/2] Installing dependencies...
call npm install
if errorlevel 1 (
  echo.
  echo [ERROR] npm install failed.
  pause
  exit /b 1
)

echo.
echo [2/2] Starting DropZone...
echo.
echo Local URL: http://localhost:3000
echo.
call npm run dev

pause
endlocal
