var rubyCheck = {
	e: {
		onRubyRequired: "ruby.required",
		onRubyInstalled: "ruby.installed"
	},
	init: function(){
		app.startNativeProcess(app.folder.gui.resolvePath("commands/get-path.cmd").nativePath, null, null, function(path){
			if(path.toLowerCase().indexOf("ruby") != -1){
				app.startNativeProcess(app.folder.gui.resolvePath("commands/ruby-version.cmd").nativePath, null, null, function(data){
					// ruby 1.9.2p290 (2011-07-09) [i386-mingw32]
					var rubyVersion = parseInt(data.replace("ruby ","").replace(/\./g,""));
					//console.log("Ruby version: "+ rubyVersion);
					if(rubyVersion >= 192){
						$.publish(rubyCheck.e.onRubyInstalled);
					} else {
						$.publish(rubyCheck.e.onRubyRequired);
					}
				});
			} else {
				//console.log("Ruby not in path");
				$.publish(rubyCheck.e.onRubyRequired);
			}
		});
	}
};