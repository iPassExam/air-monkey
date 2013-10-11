@echo off
setlocal EnableDelayedExpansion
cd /d %0\..
set "pwd=%cd%"

if "%1" == "" (
	echo Please specify website
) else (
	set SCMS_WEBSITE_FOLDER=%1
)

set SCMS_WEBSITE_FOLDER=!SCMS_WEBSITE_FOLDER:%%20= !
set "SCMS_HTML_OUT=true"

rem These are required for S3Sync
set "S3CONF=%SCMS_WEBSITE_FOLDER%"
set "SSL_CERT_DIR=%SCMS_WEBSITE_FOLDER%\s3certs\"
set "AWS_CALLING_FORMAT=SUBDOMAIN"

scms --publish --source '%SCMS_WEBSITE_FOLDER%'
endlocal