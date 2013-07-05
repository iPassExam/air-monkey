@echo off
setlocal EnableDelayedExpansion
cd /d %0\..

set "COMMAND=update"
if NOT "%1" == "" (
	set "COMMAND=%1"
)

if "%2" == "" (
	echo Please specify the path of the folder to update
    goto:eof
) else (
	set CODE_PATH=%2
    set CODE_PATH=!CODE_PATH:%%20= !
)

for %%X in (svn.exe) do (set FOUND=%%~$PATH:X)
if defined FOUND (
    svn.exe %COMMAND% %CODE_PATH%
) else (
    echo No command lile tool found!
    echo please check the command tools option when installing TortoiseSVN
    start http://tortoisesvn.net/downloads.html
)
endlocal