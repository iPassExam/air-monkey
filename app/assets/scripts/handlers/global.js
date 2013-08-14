$(function(){
	//wire external links
	$(document).on("click", "a[href^='http://']", function(e){
			e.preventDefault();
			href = $(this).attr("href");
			page.openExternalURL(href)
	});

    $(document).on("click", "a[href^='file:///']", function(e){
            e.preventDefault();
            href = $(this).attr("href");
            href = href.replace("file:///", "");
            href = href.replace(/%20/g, " ");
            var webfolderObj = new air.File(); 
            webfolderObj.nativePath = href;
            webfolderObj.openWithDefaultApplication();
    });

	window.nativeWindow.addEventListener(runtime.flash.events.Event.CLOSING, app.window.exit);
	air.NativeApplication.nativeApplication.addEventListener(air.Event.EXITING, app.window.shutDown);
});