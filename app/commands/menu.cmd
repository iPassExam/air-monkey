@echo off
cd /d %0\..
set wd=%cd%
set "WEBSITES=%USERPROFILE%\Documents\websites"
IF NOT EXIST %WEBSITES% md %WEBSITES%
cd /D %WEBSITES%
echo Opening Command Window
start cmd /K call "%wd%\menu-run.cmd"
exit