@echo off
setlocal EnableDelayedExpansion
cd /d %0\..
set wd=%cd%

set "WEBSITES=%USERPROFILE%\Documents\websites"
IF NOT EXIST %WEBSITES% md %WEBSITES%

if "%1" NEQ "" (
	set "WEBSITES=%1"
)

set WEBSITES=!WEBSITES:%%20= !
echo WEBSITES = %WEBSITES%

cd /D "%WEBSITES%"

echo Opening Command Window
start cmd /K call "%wd%\menu-run.cmd"
exit

