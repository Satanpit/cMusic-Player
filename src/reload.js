(function() {
    "use strict";

    var config = {
        host: 'localhost:',
        port: 666
    };

    try {
        var connection = new WebSocket('ws://' + config.host + config.port + '/livereload');

        connection.onmessage = function(message) {
            if (message.data) {
                var data = JSON.parse(message.data);
                if (data && data.command === 'reload') {
                    chrome.runtime.reload();
                }
            }
        }
    } catch (e) { }
}());