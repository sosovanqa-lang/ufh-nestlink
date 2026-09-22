@echo off
title Stop UFH NestLink
echo Stopping any NestLink server running on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
  taskkill /F /PID %%a >nul 2>&1
  echo Stopped process %%a
)
echo Done.
timeout /t 2 >nul
