@echo off
cls
cd /d %0\..
TITLE "Updating Air Monkey Version"
setlocal

rem Create build folder
set buildDir=%UserProfile%\Dropbox\Public\AirMonkey
if not exist %buildDir% mkdir %buildDir%

echo Updating descriptor
.\tools\msxsl.exe ..\application.xml .\xslt\update-descriptor.xsl -o "%buildDir%\update-descriptor.xml"

echo Updating download page
.\tools\msxsl.exe ..\application.xml .\xslt\download.xsl -o "%buildDir%\index.html"
.\tools\msxsl.exe ..\application.xml .\xslt\download.xsl -o "..\html\download.html"

endlocal
echo Complete
pause