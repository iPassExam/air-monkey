var app = {
	e: {

		onBuildStart: "build.start",
		onBuildProgress: "build.progress",
		onBuildComplete: "build.complete",
		onDeployStart: "deploy.start",
		onDeployProgress: "deploy.progress",
		onDeployComplete: "deploy.complete",
        onSvnUpdateStart: "svn.update.start",
        onSvnUpdateProgress: "svn.update.progress",
        onSvnUpdateComplete: "svn.update.complete"
	},
	folder: {
		root: air.File.applicationDirectory,
        gui: air.File.applicationDirectory.resolvePath("app")
	},
	website: {
		build: function(website, webdir, obj, action){
			air.trace("Building: "+ website);

			var buildScript = app.folder.gui.resolvePath("commands\\air-monkey-build.cmd").nativePath;

			var processArgs = new air.Vector["<String>"]();
            var builddir = util.file.toString(new air.File(webdir));
			processArgs.push(builddir); 
            
            // An action of edit will use the puild dir specified in websiteService.getEditWebsitePubFolder
            // Other action such as build and preview should use StaticCMS's default
            // SCMS will use the /compiled folder or use the options.build_dir from config.yml if it exists 
            // console.log(action);
            if(action == "cpreview"){
                buildScript = app.folder.gui.resolvePath("commands\\air-monkey-build-with-crunch.cmd").nativePath;
            }
            if(action == "edit"){
                var pub = websiteService.getEditWebsitePubFolder(website);
                if (!pub.isDirectory)
                    pub.createDirectory();

                processArgs.push("cms"); 
                processArgs.push(util.file.toString(pub)); 
            } else {
                processArgs.push("publish"); 
            }

			$.publish(app.e.onBuildStart);
			app.startNativeProcess(buildScript, processArgs, function(){
				$.publish(app.e.onBuildComplete, obj);
			}, function(data){
				$.publish(app.e.onBuildProgress, data);
			});
		},
		deploy: function(website, webdir, obj){
			air.trace("Deploying: "+ website);
			var deployScript = app.folder.gui.resolvePath("commands\\air-monkey-deploy.cmd").nativePath;

			var processArgs = new air.Vector["<String>"]();
			processArgs.push(util.file.toString(new air.File(webdir))); 

			$.publish(app.e.onDeployStart);
			app.startNativeProcess(deployScript, processArgs, function(){
				$.publish(app.e.onDeployComplete, obj);
			}, function(data){
				$.publish(app.e.onDeployProgress, data);
			});
		},
		debug: function(website){
			var appFolder = websiteService.folders.website(website);

			app.startNativeProcess(appFolder.resolvePath("debug.cmd").nativePath);
		},
        svnupdate: function(website, webdir, obj){
            air.trace("Updating "+ webdir);
            var svn = app.folder.gui.resolvePath("commands\\svn-update.cmd").nativePath;
            var processArgs = new air.Vector["<String>"]();
            processArgs.push("update"); 
            processArgs.push(util.file.toString(new air.File(webdir))); 

            $.publish(app.e.onSvnUpdateStart);
            app.startNativeProcess(svn, processArgs, function(){
                $.publish(app.e.onSvnUpdateComplete, obj);
            }, function(data){
                $.publish(app.e.onSvnUpdateProgress, data);
            });
        },
        svncommit: function(website, webdir, obj){
            air.trace("Commiting "+ webdir);
            var svn = app.folder.gui.resolvePath("commands\\svn.cmd").nativePath;

            var processArgs = new air.Vector["<String>"]();
            processArgs.push("commit"); 
            processArgs.push(util.file.toString(new air.File(webdir)));

            app.startNativeProcess(svn, processArgs);
        }
	},
	startNativeProcess: function (run, processArgs, successCallback, stdOutCallback){
		if(air.NativeProcess.isSupported)
		{
			var appToLaunch = new air.File(run);
			var nativeProcessStartupInfo = new air.NativeProcessStartupInfo();
			nativeProcessStartupInfo.executable = appToLaunch;

			if(processArgs != null)
				nativeProcessStartupInfo.arguments = processArgs;

			var nativeProcess = new air.NativeProcess();
			nativeProcess.addEventListener(air.ProgressEvent.STANDARD_OUTPUT_DATA, onOutputData);
			nativeProcess.addEventListener(air.ProgressEvent.STANDARD_ERROR_DATA, onErrorData);
			nativeProcess.addEventListener(air.NativeProcessExitEvent.EXIT, onExit);
			nativeProcess.start(nativeProcessStartupInfo);

			function onOutputData(event){
				var outputData = nativeProcess.standardOutput.readUTFBytes(nativeProcess.standardOutput.bytesAvailable);
				air.trace(outputData.toString());
				if(jQuery.isFunction(stdOutCallback))
					stdOutCallback.call(null, outputData.toString());
			}

			function onErrorData(event){
				console.log("Process Error:\n"+ nativeProcess.standardError.readUTFBytes(nativeProcess.standardError.bytesAvailable).toString());
			}

			function onExit(event){
				air.trace('Exited native app');
				if(jQuery.isFunction(successCallback))
					successCallback.call();
			}
		} else {
			air.trace("Native process execution is not supported");
		}
	},
	window: {
		shutDown: function(){
            try{
                var tempWebsiteEditDir = new air.File(data.local("tempEditDir"));
                data.local("tempEditDir", null)
                tempWebsiteEditDir.deleteDirectory(true);
            } catch (e) {
                console.log(e);
            }

			prefs.window.x(nativeWindow.x);
			prefs.window.y(nativeWindow.y);
			prefs.window.width(nativeWindow.width);
			prefs.window.height(nativeWindow.height);
			prefs.isLaunch(null);
		},
		exit: function(){
			var exitingEvent = new air.Event(air.Event.EXITING, false, true);
			air.NativeApplication.nativeApplication.dispatchEvent(exitingEvent);
			if (!exitingEvent.isDefaultPrevented()) { 
		        air.NativeApplication.nativeApplication.exit(); 
		    }
		}
	}
};