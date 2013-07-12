

function popMsg(head, body, foot){
	$("#message").modal('hide');
	$("#message-head").html(head);
	$("#message-body").html(body);
	$("#message-foot").html(foot);
	$("#message").modal('show');
}

$(function(){
	
	function bindEvents(){
        $(".website-build").live("click", function(e){ 
            e.preventDefault();
            var $this = $(this);
            var website = $this.attr("data-website");
            var webfolder = $this.attr("data-webfolder");
            var action = $this.attr("data-action");

            switch(action){
                case "edit":
                app.website.build(website, webfolder, this, "edit");
                break;
                default:
                app.website.build(website, webfolder, this, "build");
                break;
            }
        }); 

		$(".website-source").live("click", function(e){ 
			e.preventDefault();
			var $this = $(this);
			var website = $this.attr("data-website");
			var webfolder = $this.attr("data-webfolder");

			var webfolderObj = new air.File(); 
			webfolderObj.nativePath = webfolder;
			webfolderObj.openWithDefaultApplication();
		}); 

		$(".website-deploy").live("click", function(e){
			e.preventDefault();
			var $this = $(this);
			var website = $this.attr("data-website");
			var webfolder = $this.attr("data-webfolder");
			app.website.deploy(website, webfolder, this);
		});

        $(".website-update").live("click", function(e){
            e.preventDefault();
            var $this = $(this);
            var website = $this.attr("data-website");
            var webfolder = $this.attr("data-webfolder");
            app.website.svnupdate(website, webfolder, this);
        });

        $(".website-commit").live("click", function(e){
            e.preventDefault();
            var $this = $(this);
            var website = $this.attr("data-website");
            var webfolder = $this.attr("data-webfolder");
            app.website.svncommit(website, webfolder, this);
        });

		$("#import-existing").click(function(e){
			e.preventDefault();
			var folder = new air.File();
            folder.addEventListener(air.Event.SELECT, onFolderSelected);
            folder.browseForDirectory("Please select a Static-CMS website directory!");  
 
            function onFolderSelected(e) {
            	if(websiteService.isStaticCMS(folder.nativePath)){
            		var name=prompt("Please enter a label for website","");
					if (name!=null && name!=""){
		            	var newWebsite = new website(name, folder.nativePath);
		                if(websiteService.saveWebsite(newWebsite.name, newWebsite.folder)){
                            document.location = "app:/app/index.html";
                        }
	            	} else {alert("No name specified!")}
            		
            	} else {
            		alert("Folder doesn't contain a Static-CMS _config.yml file!");
            	}
            }
		});
	}

	function bindSubscriptions(){
		//Subscribe to ruby check events
		$.subscribe(rubyCheck.e.onRubyRequired, function(e){
			$("#rubyMessage").show();
			wsGridVM.showGrid(false);
		});
		$.subscribe(rubyCheck.e.onRubyInstalled, function(e){
			if(prefs.firstRun())
				nativeUpdater.installGems();
		});
		// Subscribe to native update events		
		$.subscribe(nativeUpdater.e.onUpdateFound, function(e, msg){
			popMsg("Update Found", msg, "<span class='pull-left'>Downloading...</span><span class='pull-right'><img src='app:/app/assets/images/page-loading.gif'/></span>");
		});
		$.subscribe(nativeUpdater.e.onDownloadComplete, function(e){
			prefs.firstRun("yes");
            prefs.isLaunch(null);
		});
		//Subscribe to Gem install events
		$.subscribe(nativeUpdater.e.onGemUpdateStart, function(e){
			wsGridVM.show(false);
			stdOutVM.header("Updating System");
			stdOutVM.print("<p><strong style='color: red;'>Please do not close Air Monkey while updating!</strong></p>");
			stdOutVM.show(true);
		});
		$.subscribe(nativeUpdater.e.onGemUpdateProgress, function(e, data){
			if(data){
				stdOutVM.print(data.replace(/\n/g, '<br />'));
				$(document).scrollTop($(document).height());
			}
		});
		$.subscribe(nativeUpdater.e.onGemUpdateComplete, function(e){
			prefs.firstRun("no");
			wsGridVM.show(true);
			stdOutVM.show(false);
			location.reload(); 
		});
		//Subscribe to build events
		$.subscribe(app.e.onBuildStart, function(){
			wsGridVM.show(false);
			stdOutVM.header("Building Website");
			stdOutVM.show(true);
		});
		$.subscribe(app.e.onBuildProgress, function(e, data){
            //var html = data.replace(/\n/g, '<br />');
            var html = data.replace(",", "%2C");
            html = html.trim().replace("\n","");
            if(!util.string.isBlank(html)){
                //console.log(typeof(html));
    			//stdOutVM.print(html);
                stdOutVM.print(html);
    			$(document).scrollTop($(document).height());
            }
		});
		$.subscribe(app.e.onBuildComplete, function(e, self){
			$a = $(self);
            var action = $a.attr("data-action");
			switch(action)
			{
			case "debug":
				var website = $a.attr("data-website");
				app.website.debug(website); 
				document.location = "app:/app/index.html"
			  	break;
			case "edit":
				setTimeout(function(){
					document.location = $a.attr("href");
				}, 500);
			  	break;
			case "preview":
                var pub = websiteService.folders.website($a.attr("data-website")).nativePath; 
                var index = new air.File(pub +"\\index.html"); 
                if(index.exists){
                    index.openWithDefaultApplication();
                } else {
                    alert("No index.html for website: "+ pub);
                }
                //document.location = "app:/app/index.html";
                stdOutVM.lines.push("<br /><div class='alert alert-success'><h4>Build Complete</h4><br /><a href='app:/app/index.html' class='btn btn-success btn-large'>return</a></div>");
            
			  	break;
			default:
			  	stdOutVM.lines.push("<br /><div class='alert alert-success'><h4>Build Complete</h4><br /><a href='app:/app/index.html' class='btn btn-success btn-large'>return</a></div>");
			}

			$(document).scrollTop($(document).height()+30);
		});
		//Subscribe to deploy events
		$.subscribe(app.e.onDeployStart, function(){
			wsGridVM.show(false);
			stdOutVM.header("Deploying Website");
			stdOutVM.show(true);
		});
		$.subscribe(app.e.onDeployProgress, function(e, data){
            //var html = data.replace(/\n/g, '<br />');
            var html = data.replace(",", "%2C");
            if(!util.string.isBlank(html)){
                stdOutVM.print(html);
    			$(document).scrollTop($(document).height());
            }
		});
		$.subscribe(app.e.onDeployComplete, function(e, self){
			stdOutVM.lines.push("<div class='alert alert-success'><h4>Publish Complete</h4><a href='app:/app/index.html' class='btn btn-success btn-large btn-block'>return</a></div>");
            $(document).scrollTop($(document).height()+30);
		});
        //Subscribe to svnupdate events
        $.subscribe(app.e.onSvnUpdateStart, function(){
            wsGridVM.show(false);
            stdOutVM.header("Updating Website");
            stdOutVM.show(true);
        });
        $.subscribe(app.e.onSvnUpdateProgress, function(e, data){
            if(!util.string.isBlank(data)){
                data = data.replace(/^M\s/,"<span class='text-success'>Merged: </span>");
                data = data.replace(/^A\s/,"<span class='text-info'>Added: </span>");
                data = data.replace(/^U\s/,"<span class='text-warning'>Updated: </span>");
                data = data.replace(/^D\s/,"<span class='text-error'>Deleted: </span>");
                data = data.replace(/^C\s/,"<span class='text-error'><strong><i class='icon-flag'></i>Conflict:</strong> </span>");
                //Will want to add formating for conflict here
                stdOutVM.print("<p>"+ data +"</p>");
                $(document).scrollTop($(document).height());
            }
        });
        $.subscribe(app.e.onSvnUpdateComplete, function(e, self){
            stdOutVM.lines.push("<div class='alert alert-success'><h4>Update Complete</h4><a href='app:/app/index.html' class='btn btn-success btn-large btn-block'>return</a></div>");
            $(document).scrollTop($(document).height()+30);
        });
	}
	
	bindSubscriptions();
	websiteService.initialiseWebsites();

	var websites = websiteService.websites;
	//websites = websiteService.saveWebsite("DropTest","C:/Users/cprobert/Dropbox/websites/my.test.com");

    function renderWebsite(w){
        var showPub = util.file.exists(websites[w]+"\\_s3config.yml");
        var isApp = util.file.exists(websites[w]+"\\debug.cmd");
        var hasIndex = util.file.contains(websites[w]+"\\_config.yml", "index.html");
        var hasSvn = util.file.exists(websites[w]+"\\.svn");
        wsGridVM.websites.push(new website(w, websites[w], showPub, isApp, hasIndex, hasSvn));
    }

	//setup websites view model
	ko.applyBindings(wsGridVM, document.getElementById('websites-grid'));
	// Setu std-out view model
	ko.applyBindings(stdOutVM, document.getElementById('std-out'));
	
    // Sort websites
    var mappedHash = Object.keys( websites ).sort(function( a, b ) {
        if (b < a) {
            return 1;
        }
        else if (a < b) {
            return -1;
        }
        else {
            return 0;
    }

    }).map(function( sortedKey ) {
        var associativeArray = {};
        associativeArray.name = sortedKey;
        associativeArray.value = websites[sortedKey];
        return associativeArray;
    });
    websites = {};
    for(var w in mappedHash) {
        websites[mappedHash[w].name] = mappedHash[w].value;
    }

    // Add websites to grid model
	for(var w in websites) {
        renderWebsite(w);
	}
	
	bindEvents();

	$("#footnote").html("version: "+ prefs.currentVersion());

	if(prefs.isLaunch()){
		prefs.isLaunch(true);
		//nativeUpdater.init();
		rubyCheck.init();

		// Reposition window (only run on open!!!)
		try {
			var x = prefs.window.x();
			if (x == null || x > air.Screen.mainScreen.bounds.width) {
				nativeWindow.x = 0;
			}
			else {
				nativeWindow.x = x;
			}
			
			var y = prefs.window.y();
			if (y == null || y > air.Screen.mainScreen.bounds.height) {
				nativeWindow.y = 0;
			}
			else {
				nativeWindow.y = y;
			}

			var width = prefs.window.width();
			if (width != null) {
				nativeWindow.width = width;
			}

			var height = prefs.window.height();
			if (height != null) {
				nativeWindow.height = height;
			}
		}
		catch(err){
			air.trace("Could not move window");
		}
	} 
});