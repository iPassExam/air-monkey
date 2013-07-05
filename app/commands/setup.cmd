@echo off
cls

@echo *** Update Gems
@call gem update --system

@echo *** Static-CMS 
@call gem install scms --no-ri --no-rdoc
