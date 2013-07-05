@echo off
cls
cd /d %0\..
TITLE "Air Debug"
cd ..
adl application.xml
cd build

