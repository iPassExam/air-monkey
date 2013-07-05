/**
 * @author cprobert
 */
// App Methods
function SetUpSysTray(){
    if (air.NativeApplication.supportsSystemTrayIcon) {
        window.nativeWindow.addEventListener(runtime.flash.events.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING, nwMinimized); 
        
        var iconLoader = new runtime.flash.display.Loader();
        iconLoader.contentLoaderInfo.addEventListener(air.Event.COMPLETE, iconLoadComplete);
        var icon = app.folder.gui.resolvePath("assets\\images\\logo-16.png");
        iconLoader.load(new air.URLRequest(icon.nativePath));
        
        air.NativeApplication.nativeApplication.icon.addEventListener("click", function(event){ Dock(); });
    }
}
// Event Handlers
function iconLoadComplete(event){
    if(air.NativeApplication.supportsSystemTrayIcon){
            air.NativeApplication.nativeApplication.icon.bitmaps = new Array(event.target.content.bitmapData);
            air.NativeApplication.nativeApplication.icon.tooltip = "Air-Monkey";
            air.NativeApplication.nativeApplication.icon.menu = new air.NativeMenu();
            
                // Create Menu Items
                var openCommand = new air.NativeMenuItem("Toggle");
                openCommand.addEventListener(air.Event.SELECT,function(event){
                    Dock();
                });
                
                var sep = new air.NativeMenuItem("", true);
                
                var exitCommand = new air.NativeMenuItem("Exit");
                exitCommand.addEventListener(air.Event.SELECT,function(event){
                    air.NativeApplication.nativeApplication.exit();
                });
                
            // Add Items to menu
            air.NativeApplication.nativeApplication.icon.menu.addItem(openCommand);
            air.NativeApplication.nativeApplication.icon.menu.addItem(sep);
            air.NativeApplication.nativeApplication.icon.menu.addItem(exitCommand);
    }
}
// Overrides
/* On Native Window Minimized */
function nwMinimized(nativeWindowDisplayStateEvent) {
    if(nativeWindowDisplayStateEvent.afterDisplayState == runtime.flash.display.NativeWindowDisplayState.MINIMIZED) {
        nativeWindowDisplayStateEvent.preventDefault();
        Dock();
    }
}

function Dock() {
    window.nativeWindow.visible = !window.nativeWindow.visible;
}