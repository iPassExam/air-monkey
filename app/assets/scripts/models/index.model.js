function website(name, folder, showPublish, isApp, hasIndex) {
	if(showPublish === undefined)
		showPublish = false
    if(isApp === undefined)
        isApp = false
	if(hasIndex === undefined)
        hasIndex = false

    var self = this;
    self.name = name;
	self.folder = folder;
	self.editURL = "app:/app/web-loader.html?website="+ name +"&webfolder="+ folder;
	self.showPublish = showPublish;
    self.debug = isApp;
    self.hasIndex = hasIndex;

    if(isApp){
        self.action = "debug";
    } else {
        self.action = hasIndex ? "edit" : "build"
    }
    
}

var wsGridVM = {
    websites: ko.observableArray([]),
    show: ko.observable(true)
};

function stdout(line){
    var self = this;
    self.print = line;
}

var stdOutVM = {
    header: ko.observable(),
    lines: ko.observableArray([]),
    show: ko.observable(false),
    print: function(me){
        $("#console").append(me);
    }
};