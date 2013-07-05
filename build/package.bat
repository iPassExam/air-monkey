@echo off
cls
cd /d %0\..
TITLE "Air Monkey Package"
setlocal

rem Compile mxml files to swf
::forfiles /s /m *.mxml /c "cmd /c amxmlc @path"

rem Get version
set vf=%temp%\v
.\tools\msxsl.exe ..\application.xml .\xslt\version.xsl > %vf%
set /p v=<%vf%
del %vf%
echo Setting version to %v%

rem Create build folder
set buildDir=%UserProfile%\Dropbox\Public\AirMonkey
if not exist %buildDir% mkdir %buildDir%

cd ..
echo Creating: Air-Monkey_%v%.exe (in Dropbox public folder)
adt -package -storetype pkcs12 -keystore cert\cert.p12 -storepass LetItAllOut -target native "%buildDir%\Air-Monkey_%v%.exe" application.xml app update-config.xml README.md
cd build

endlocal
echo Complete
pause