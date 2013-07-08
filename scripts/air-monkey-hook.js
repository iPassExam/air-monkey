/// Author Courtenay Probert
/// Version 1.1

$(function() {
	function editMe(cms) {
		var view = $(cms).attr("data-view");
        if(!view)
            alert("View missing");
            
		var page = $(cms).attr("data-page");
        if(!page)
            alert("Page missing");
            
        try{
            if(window.parentSandboxBridge != undefined)
                window.parentSandboxBridge.editView(view, page);
            else
                alert("No Parent Sandbox Bridge");
        } catch (e) {
            alert(e);
        }
	}

	$("a[href^='http']")
		.attr('target','_blank')
		.click(function(e){
			e.preventDefault();
			href = $(this).attr("href")
			alert("Loading: "+ href);
			window.parentSandboxBridge.openExternalURL(href);
	});	

	$(".cms").each(function(i) {
		var $this = $(this);
		$this.addClass("cmsEdit");
		var bgColor = $(this).css("background-color");

		$this
		  .bind("dblclick", function() {
			editMe(this);
		  })
		  .attr("title", "Double click to edit")
		  .mouseover(function() {
			var htmlStr = $(this).html();
			if ($.trim(htmlStr) == "")
			  $this.html("Double click to add text");
			
			$(this)
			  .css({
				backgroundColor: 'AliceBlue',
				cursor: 'pointer'
			  });
		  })
		  .mouseout(function() {
			if ($this.html() == "Double click to add text")
			  $this.html("");
			
			$this.css({
			  backgroundColor: bgColor
			});
		 });
	});
});