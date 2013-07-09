@echo off
cd /d %0\..
echo Starting gem update
start cmd /K call "%cd%\setup-run.cmd"
exit