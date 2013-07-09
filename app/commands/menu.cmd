@echo off
cd /d %0\..
set "WEBSITES=%USERPROFILE%\Documents\websites"
IF NOT EXIST %WEBSITES% md %WEBSITES%
cd /D %WEBSITES%
echo Opening Command Window
start cmd /K call "%cd%\menu-run.cmd"
exit