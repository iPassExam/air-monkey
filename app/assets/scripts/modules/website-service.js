// website servie
var websiteService = function(){
    //Create a temp dir for editing builds
    var tempEditDir = null;
    if(! data.local("tempEditDir")){
        tempEditDir = air.File.createTempDirectory();
        //console.log("Creating new temp dir: "+ tempEditDir.nativePath);
        data.local("tempEditDir", tempEditDir.nativePath);
    }

	var websites = {};
	websites = JSON.parse(data.local("websites"));
	if(websites == null)
		websites = {};

	var folders = {
		websites: air.File.documentsDirectory.resolvePath("Websites"),
		website: function(website){
			if(websites.hasOwnProperty(website)){
				return new air.File(websites[website]);
			}
			return new air.File();
		}
	}

	if (!folders.websites.isDirectory)
		folders.websites.createDirectory();

	function hasFolder(webFolder){
		var webFolders = [];
		$.each(websites, function(website, websiteFolder) { 
			webFolders.push(websiteFolder);
		});

		if (webFolders.indexOf(webFolder) != -1)
			return true;

		return false;
	}

	function isStaticCMS(folder){
		var websiteFolder = new air.File(folder);
		return websiteFolder.resolvePath("_config.yml").exists;
	}

	function initialiseWebsites(){
		//Check they still exist
		$.each(websites, function(website, websiteFolder) { 
			if(!util.file.exists(websiteFolder))
				delete websites[website]
		});
	    
		// Get the folders in the default websites dir
		var contents = folders.websites.getDirectoryListing(); 
		for (var i = 0; i < contents.length; i++) 
		{
			var website = contents[i].name;
			var websiteFolder = folders.websites.resolvePath(website).nativePath;

			if(isStaticCMS(websiteFolder)){
				if(!hasFolder(websiteFolder)){
					alert("Found new website: "+ website);
					websites[website] = websiteFolder;
				} 
			} else {
				air.trace("Skiping "+ websiteFolder +" doesn't contain _config.yml");
			}
		}

		saveWebsites();
		return websites;
	}
	

	function saveWebsites(){
		data.local("websites", JSON.stringify(websites));
	}

	function saveWebsite(website, websiteFolder){
		if(hasFolder(websiteFolder)){
			alert(website +" has already been imported.\n"+ websiteFolder);
			return false;
		} else {
			websites[website] = websiteFolder;
			saveWebsites();
			return true;
		}
	}

    function websiteHasCustomBuildDir(w){
        return util.file.contains(websites[w]+"\\_config.yml", "build_dir");
    }

    function customBuildDirProcessor(website, successCallback, failCallback){
        if(websiteHasCustomBuildDir(website)){
            var peek = app.folder.gui.resolvePath("commands\\config-peek.cmd").nativePath;
            var processArgs = new air.Vector["<String>"]();
                config = util.file.toString(new air.File(websiteService.websites[website]+ "\\_config.yml" ))
                processArgs.push(config); 
                processArgs.push("options.build_dir"); 

            app.startNativeProcess(peek, processArgs, null, function(data){
                if(data){
                    if (data == undefined){
                        if($.isFunction(failCallback))
                            failCallback.call();
                    } else if($.trim(data) == "empty"){
                        if($.isFunction(failCallback))
                            failCallback.call();
                    } else {
                        if($.isFunction(successCallback))
                            successCallback.call(undefined, data);
                    }
                } else {
                    console.log("No data when getting build dir");
                    if($.isFunction(failCallback))
                        failCallback.call();
                }
            });
        } else {
            if($.isFunction(failCallback))
                failCallback.call();
        }
    }

	function getEditWebsitePubFolder(website){
        var tempEditDir = new air.File(data.local("tempEditDir"));
        tempEditDir = tempEditDir.resolvePath(website);
        return tempEditDir;
	}

    function getDefaultWebsitePubFolder(website){
        return folders.website(website).resolvePath("_site");
    }

	return {
		websites: websites,
		initialiseWebsites: initialiseWebsites,
		saveWebsite: saveWebsite,
		isStaticCMS: isStaticCMS,
		getEditWebsitePubFolder: getEditWebsitePubFolder,
        getDefaultWebsitePubFolder: getDefaultWebsitePubFolder,
        customBuildDirProcessor: customBuildDirProcessor,
		folders: folders
	}
}();