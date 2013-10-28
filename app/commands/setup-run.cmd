@echo off
@echo *** Update Gems
@call gem update --system

@echo *** Static-CMS 
@call gem uninstal aproxacs-s3sync -i -x --force
@call gem install scms --no-ri --no-rdoc
@call gem install cprobert-s3sync --no-ri --no-rdoc

pause
exit