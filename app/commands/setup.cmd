@echo off
cls

@echo *** Update Gems
@call gem update --system

@echo *** Static-CMS 
@call gem uninstal aproxacs-s3sync -i -x --all --force
@call gem install scms --no-ri --no-rdoc
