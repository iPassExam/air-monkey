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

set SCMS_WEBSITE_FOLDER=!SCMS_WEBSITE_FOLDER:%%20= !
set "SCMS_HTML_OUT=true"

::echo SCMS_WEBSITE_FOLDER = %SCMS_WEBSITE_FOLDER%
::echo mode = %mode%

cd /D %SCMS_WEBSITE_FOLDER%
scms -a watch -w '%SCMS_WEBSITE_FOLDER%' --server

:eof
endlocal