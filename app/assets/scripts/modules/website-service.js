// website servie
var websiteService = function(){
	
	var websites = {};
	//data.local("websites",null);
	websites = JSON.parse(data.local("websites"));
	if(websites == null)
		websites = {};

	var folders = {
		websites: air.File.documentsDirectory.resolvePath("Websites"),
		website: function(website){
			if(websites.hasOwnProperty(website))
				return new air.File(websites[website]);
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

	return {
		websites: websites,
		initialiseWebsites: initialiseWebsites,
		saveWebsite: saveWebsite,
		isStaticCMS: isStaticCMS,
		folders: folders
	}
}();