(function() {
    "use strict";

    try {
        new WebSocket('ws://localhost:8081/livereload')
            .addEventListener('message', function(message) {
                var data = JSON.parse(message.data || "{ }");
                if (data.command !== 'reload') return false;

                window.focus();

                if (~data.path.indexOf('.css')) {
                    var doc = chrome.app.window.get('parent').contentWindow.document;

                    Array.prototype.forEach.call(doc.querySelectorAll('link[rel=stylesheet]'), function(item) {
                        var href = item.href,
                            random = Math.floor(Math.random() * Math.pow(10, 16));

                        if (~href.indexOf('?')) {
                            href = href.replace(/\?([\d]){15,16}/, '?' + random);
                        } else {
                            href += '?' + random;
                        }

                        item.href = '#breakingTheUrl';

                        item.setAttribute('href', href);
                    });
                } else {
                    chrome.runtime.reload();
                }
        });
    } catch (e) { }
}());