var netmon = function(){
    var isOnline = true;
    var networkMonitor = null;
    var monitorURL = null;

    air.NativeApplication.nativeApplication.addEventListener(air.Event.NETWORK_CHANGE, onNetworkChange);
    monitorURL = "https://dl.dropboxusercontent.com/u/4407314/AirMonkey/update-descriptor.xml";
    onNetworkChange();

    function onNetworkChange(e){
        air.trace("Network Change");
        setTimeout(function(){
            try { //Check resource availability 
                networkMonitor = new air.URLMonitor(new air.URLRequest(monitorURL));
                networkMonitor.addEventListener(air.StatusEvent.STATUS, alertNetworkChange);
                networkMonitor.start();
            } 
            catch (err) {
                //console.log("Error communicating with " + monitorURL);
                console.log(err);
                goneOffline();
            }
        }, 500);
    
    }

    function alertNetworkChange(e){
        air.trace("Network available = " + networkMonitor.available);
        if (networkMonitor.available) {
            comeOnline();
            nativeUpdater.init();
        } else {
            goneOffline();
        }
    }

    function goneOffline(){
            air.trace("Can not find: " + monitorURL);
            $(".fn-deploy").hide();
            $("#msg")
                .html("<div class='alert alert-error'><h4>Offline</h4><p>No network connection dectected!</p></div>")
                .show();
            isOnline = false;
    }

    function comeOnline(){
            air.trace("Online");
            $(".fn-deploy").show();
            $("#msg").hide();
            isOnline = true;
    }

    return {
        isOnline: isOnline
    }
}();

