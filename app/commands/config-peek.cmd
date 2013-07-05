@echo off
setlocal EnableDelayedExpansion
cd /d %0\..
set YAML=%1
set YAML=!YAML:%%20= !
set SETTING=%2
ruby get-config-setting.rb -c '%YAML%' -s '%SETTING%'
endlocal
exit