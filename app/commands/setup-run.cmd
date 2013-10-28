@echo off
@echo *** Update Gems
@call gem update --system

@echo *** Static-CMS 
@call gem uninstal aproxacs-s3sync -i -x --force
@call gem install scms --no-ri --no-rdoc

@call gem update scms
@call gem update cprobert-s3sync

pause
exit