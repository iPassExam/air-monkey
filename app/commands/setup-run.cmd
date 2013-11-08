@echo off

ruby -v 
if %errorlevel%==0 goto Update
echo Please install Ruby (%errorlevel%)
start http://rubyinstaller.org/
echo.&pause&goto:eof

:Update
Rem Requires ruby
@echo *** Update Gems
@call gem update --system

@echo *** Static-CMS 
@call gem uninstal aproxacs-s3sync -i -x --force
@call gem install scms --no-ri --no-rdoc

@call gem update scms
@call gem update cprobert-s3sync

pause
exit