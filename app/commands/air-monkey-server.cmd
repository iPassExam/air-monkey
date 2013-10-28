@echo off
setlocal EnableDelayedExpansion
cd /d %0\..

if "%1" == "" (
	echo Please specify website
) else (
	set SCMS_WEBSITE_FOLDER=%1
)
set port=8700
if NOT  "%2" == "" (
    set port=%2
)
echo "<div class='alert alert-info'>Use <strong>[Ctrl] + [c]</strong> to stop</div>"

set SCMS_WEBSITE_FOLDER=!SCMS_WEBSITE_FOLDER:%%20= !
set "SCMS_HTML_OUT=true"

::echo SCMS_WEBSITE_FOLDER = %SCMS_WEBSITE_FOLDER%
echo port = %port%

cd /D %SCMS_WEBSITE_FOLDER%
scms --watch --serve --source '%SCMS_WEBSITE_FOLDER%' --port %port%

:eof
endlocal