@echo off
setlocal enabledelayedexpansion

:loop
if "%~1"=="" goto end
set "filename=%~n1"
ffmpeg -i "%~1" "!filename!.webp"
shift
goto loop

:end
endlocal
