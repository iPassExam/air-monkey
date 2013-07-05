var prefs = {
	isLaunch: function(param){
		if(param === undefined){ //Get
			if (data.local("isLaunch") == null)
				return true;
		}
		else { //Set
			if (data.local("isLaunch", param) != null)
				return true;
		}
		return false;
	},
	firstRun: function(value){
		if(value){ //Set
			return data.local("firstRun", value);	
		} else { //Get
			var firtRun = data.local("firstRun");
			if (firtRun == null)
				return true;
			else
				return util.convert.toBool(firtRun);
		}
	},
	currentVersion: function(){
		var appXmlParser = new DOMParser(); 
		var appXML = appXmlParser.parseFromString(air.NativeApplication.nativeApplication.applicationDescriptor, "text/xml").getElementsByTagName('application')[0];
		//var appName = appXML.getElementsByTagName("filename")[0].firstChild.data;   
		return appXML.getElementsByTagName("versionNumber")[0].firstChild.data;
	},
    currentGemVersion: function(x){
        if(x){ //Set
            return data.local("app.gem.version", x);
        }
        else { //Get
            var v = data.local("app.gem.version");
            if(v)
                return v;
            return 0;
        }
    },
	window: {
		x: function(x){
			if(x){ //Set
				return data.local("app.window.x", x);
			}
			else { //Get
				return data.local("app.window.x");
			}
		},
		y: function(y){
			if(y){ //Set
				return data.local("app.window.y", y);
			}
			else { //Get
				return data.local("app.window.y");
			}
		},
		width: function(w){
			if(w){ //Set
				return data.local("app.window.width", w);
			}
			else { //Get
				return data.local("app.window.width");
			}
		},
		height: function(h){
			if(h){ //Set
				return data.local("app.window.height", h);
			}
			else { //Get
				return data.local("app.window.height");
			}
		}
	}
};