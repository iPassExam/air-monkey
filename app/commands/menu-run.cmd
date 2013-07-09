@echo off
cls
::cd /d %0\..
TITLE "Static CMS"
IF DEFINED SCMS_WEBSITE_ROOT (
    ECHO Website dir: %SCMS_WEBSITE_ROOT%
) ELSE (
    set "SCMS_WEBSITE_ROOT=%userprofile%\Documents\Websites"
)

::dir %SCMS_WEBSITE_ROOT%
scms --help
dir %websites% /AD/B/N
