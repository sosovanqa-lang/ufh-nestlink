@echo off
title UFH NestLink
cd /d "%~dp0"

echo ==========================================
echo   UFH NestLink - starting up
echo ==========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [X] Node.js was not found.
  echo     Install the LTS version from https://nodejs.org
  echo     then close this window and run START-HERE again.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo [1/3] Installing dependencies. This takes about 20 seconds...
  call npm install --no-audit --no-fund
  if errorlevel 1 goto failed
) else (
  echo [1/3] Dependencies already installed.
)
echo.

echo [2/3] Building the database...
call npm run setup
if errorlevel 1 goto dbfailed
echo.

echo [3/3] Starting the server and creating demo accounts...
start "NestLink demo seed" cmd /c "timeout /t 6 >nul && npm run seed:demo && echo. && echo Demo accounts ready. You can close this window. && pause"
echo.
echo ==========================================
echo   Open http://localhost:3000 in your browser
echo.
echo   Sign in with password:  Nestlink#2026
echo     Student      202100101@ufh.ac.za
echo     Residence    nmabhena@ufh.ac.za
echo     Maintenance  ankosi@ufh.ac.za
echo.
echo   Keep THIS window open. Close it to stop.
echo ==========================================
echo.
call npm start
goto end

:dbfailed
echo.
echo ==========================================
echo   The database could not be built.
echo.
echo   Check that MySQL is running, and that the
echo   password in the .env file matches your
echo   MySQL root password.
echo.
echo   If your password contains a # character it
echo   MUST be wrapped in double quotes, like:
echo       DB_PASSWORD="MyPass22#"
echo ==========================================
echo.
pause
exit /b 1

:failed
echo.
echo Something went wrong during install. See the messages above.
pause
exit /b 1

:end
pause
