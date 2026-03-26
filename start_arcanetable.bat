@echo off
setlocal

cd /d "%~dp0"

where pnpm >nul 2>&1
if errorlevel 1 (
  echo pnpm is not installed or not on PATH.
  echo Install pnpm first, then run this again.
  pause
  exit /b 1
)

call pnpm build
if errorlevel 1 (
  echo Build failed.
  pause
  exit /b %errorlevel%
)

call pnpm serve --host 0.0.0.0 --port 3000
