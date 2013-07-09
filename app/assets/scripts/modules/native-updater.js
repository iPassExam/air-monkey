//http://www.adobe.com/devnet/air/articles/updating-air-apps-native-installer.html
var nativeUpdater = {
	updateDescLoader: null,
	updateFile: null,
	e: {
		onUpdateFound: "update.found",
		onDownloadComplete: "update.download.complete",
        onGemUpdateStart: "gem.update.start",
        onGemUpdateProgress: "gem.update.progress",
        onGemUpdateComplete: "gem.update.complete"
	},
	init: function(){
		//subscribe like this
		//$.subscribe(nativeUpdater.e.updateFound, function(){});
        $("#footnote").html("<span class='text-info'>Checking for updates!</span>");
        //console.log("checking for updates");

		var file = air.File.applicationDirectory.resolvePath("update-config.xml");
		var fileStream = new air.FileStream();
		fileStream.open(file, air.FileMode.READ);
		var configXmlParser = new DOMParser(); 
		var configXML = configXmlParser.parseFromString(fileStream.readUTFBytes(fileStream.bytesAvailable), "text/xml").getElementsByTagName('configuration')[0];
		var updateDescriptorURL = configXML.getElementsByTagName("url")[0].firstChild.data;   
		fileStream.close();
		nativeUpdater.download.updateDescriptor(updateDescriptorURL);
	},
	installUpdate: function() { 
		 // Running the installer using NativeProcess API 
		 var info = new air.NativeProcessStartupInfo;
		 info.executable = nativeUpdater.updateFile;
		 var process = new air.NativeProcess;
		 process.start(info);
		 
		 // Exit application for the installer to be able to proceed 
		 air.NativeApplication.nativeApplication.exit();
	},
    installGems: function(){
        $.publish(nativeUpdater.e.onGemUpdateStart);
        // run setup.cmd
        app.startNativeProcess(app.folder.gui.resolvePath("commands\\setup.cmd").nativePath, null, function(){
        	air.trace("Gem update complete");
        	window.setTimeout(function(){
				$.publish(nativeUpdater.e.onGemUpdateComplete);
        	}, 1500);
        }, function(data){
        	air.trace("Gem progress");
        	air.trace(data);
        	if(data){
            	$.publish(nativeUpdater.e.onGemUpdateProgress, data);
        	}
        });
    },
	download: {
		urlStream: null,
		fileStream: null,
		updateDescriptor: function(updateDescriptorURL) { 
			 nativeUpdater.updateDescLoader = new air.URLLoader;
			 nativeUpdater.updateDescLoader.addEventListener(air.Event.COMPLETE, nativeUpdater.handler.updateDescriptorComplete);
			 nativeUpdater.updateDescLoader.addEventListener(air.IOErrorEvent.IO_ERROR, nativeUpdater.handler.error);
			 nativeUpdater.updateDescLoader.load(new air.URLRequest(updateDescriptorURL));
		},
		update: function(updateUrl) { 
			 // Parsing file name out of the download url 
			 var fileName = updateUrl.substr(updateUrl.lastIndexOf("/") + 1);
			 air.trace("Update file: "+ fileName);
			 // Creating new file ref in temp directory 
			 nativeUpdater.updateFile = air.File.createTempDirectory().resolvePath(fileName);
			 // Using URLStream to download update file 
			 nativeUpdater.download.urlStream = new air.URLStream;
			 nativeUpdater.download.urlStream.addEventListener(air.Event.OPEN, nativeUpdater.handler.downloadOpen);
			 nativeUpdater.download.urlStream.addEventListener(air.ProgressEvent.PROGRESS, nativeUpdater.handler.downloadProgressHandler);
			 nativeUpdater.download.urlStream.addEventListener(air.Event.COMPLETE, nativeUpdater.handler.downloadCompleteHandler);
			 nativeUpdater.download.urlStream.addEventListener(air.IOErrorEvent.IO_ERROR, nativeUpdater.handler.error);
			 nativeUpdater.download.urlStream.load(new air.URLRequest(updateUrl));
		}
	},
	handler: {
		error: function(event) { 
			//do not uncomment
			console.log(event);
		},
		updateDescriptorComplete: function(event) { 
			var loader = air.URLLoader(event.currentTarget);
			 // Closing update descriptor loader 
			nativeUpdater.updateDescLoader.close();
			 
			var updateXmlParser = new DOMParser(); 
			var updateXML = updateXmlParser.parseFromString(loader.data, "text/xml").getElementsByTagName('update')[0];
			var updateVersion = updateXML.getElementsByTagName("versionNumber")[0].firstChild.data;   
			var updateUrl = updateXML.getElementsByTagName("url")[0].firstChild.data;

			air.trace("updateVersion: "+ updateVersion);
			air.trace("updateUrl: "+ updateUrl);
			var currentVersion = prefs.currentVersion();
			air.trace("currentVersion: "+ currentVersion);
            $("#footnote").html("version: "+ currentVersion);
			if (currentVersion < updateVersion){ 
				air.trace("Needs Update");
				$.publish(nativeUpdater.e.onUpdateFound, "<p>Current version = "+ currentVersion +"<br />New version = "+ updateVersion +"</p>");
				nativeUpdater.download.update(updateUrl);
                return;
			} 

            var latestGemVersion = 0;

            if(updateXML.getElementsByTagName("gemVersionNumber")[0]){
                latestGemVersion = updateXML.getElementsByTagName("gemVersionNumber")[0].firstChild.data;
                latestGemVersion = parseInt(latestGemVersion.replace(/\./g,""))
                var currentGemVersion = parseInt(prefs.currentGemVersion());

                air.trace("currentGemVersion: "+ currentGemVersion);
                air.trace("latestGemVersion: "+ latestGemVersion);
                
                if(currentGemVersion < latestGemVersion){
                    nativeUpdater.installGems();
                    prefs.currentGemVersion(latestGemVersion);
                    return;
                }
            }
            return;
		},
		downloadOpen: function(event){
			 // Creating new FileStream to write downloaded bytes into 
			nativeUpdater.download.fileStream = new air.FileStream;
			nativeUpdater.download.fileStream.open(nativeUpdater.updateFile, air.FileMode.WRITE);
		},
		downloadProgressHandler: function(){
			 // ByteArray with loaded bytes 
			 var loadedBytes = new air.ByteArray;
			 // Reading loaded bytes 
			 nativeUpdater.download.urlStream.readBytes(loadedBytes);
			 // Writing loaded bytes into the FileStream 
			 nativeUpdater.download.fileStream.writeBytes(loadedBytes);
		},
		 downloadCompleteHandler: function(event) { 
			$.publish(nativeUpdater.e.onDownloadComplete);
			 // Closing URLStream and FileStream 
			 nativeUpdater.download.urlStream.close();
			 nativeUpdater.download.fileStream.close();
			 // Installing update 
			 nativeUpdater.installUpdate();
		 }
	}
};



