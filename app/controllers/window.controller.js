function WindowController() {
    var current = chrome.app.window.current();

    this.close = function() {
        current.close();
    };

    this.fullScreen = function(){
        if(current.isMaximized()) {
            current.restore();
        }
        else {
            current.maximize();
        }
    };

    this.minimize = function() {
        current.minimize();
    };
}