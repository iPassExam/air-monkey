@echo off
setlocal EnableDelayedExpansion
cd /d %0\..

if "%1" == "" (
	echo Please specify website
) else (
	set SCMS_WEBSITE_FOLDER=%1
)
set mode=publish
if NOT  "%2" == "" (
    set mode=%2
)
set "SCMS_PUBLISH_FOLDER="
if NOT "%3" == "" (
    set SCMS_PUBLISH_FOLDER=%3
    set SCMS_PUBLISH_FOLDER=!SCMS_PUBLISH_FOLDER:%%20= !
)
set SCMS_WEBSITE_FOLDER=!SCMS_WEBSITE_FOLDER:%%20= !
set "SCMS_HTML_OUT=true"

::echo Crunchie tasty mmm
cd /D %SCMS_WEBSITE_FOLDER%
scms -a crunch -m %mode% -w '%SCMS_WEBSITE_FOLDER%' 

endlocal