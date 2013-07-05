@echo off
cd /d %0\..
set "WEBSITES=%USERPROFILE%\Documents\websites"
IF NOT EXIST %WEBSITES% md %WEBSITES%
start cmd /K call "%cd%\menu-env.bat"
