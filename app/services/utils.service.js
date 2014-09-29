Player.factory('Utils', function() {
    "use strict";

    return {
        sec2time: function(items) {
            if (!items instanceof Array) throw Error('Items is not by array');

            items.map(function(item) {
                if (!item.duration)  throw Error('duration is not defined');

                var hours 	= parseInt(item.duration / 3600, 10) % 24,
                    minutes = parseInt(item.duration / 60, 10) % 60,
                    seconds = parseInt(item.duration % 60, 10),
                    fragment = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds  < 10 ? '0' + seconds : seconds);

                item.time = hours > 0 ? (hours < 10 ? '0' + hours : hours) + ':' + fragment : fragment;
            });

            return items;
        },

        serialize: function(object) {
            return '?' + Object.keys(object).reduce(function(a,k){a.push(k+'='+encodeURIComponent(object[k]));return a},[]).join('&')
        },

        parseURL: function(url) {
            var parts = url.split("&"),
                output = {},
                splitted, key;

            if (!url.length)
                return output;

            for (var i = 0; i < parts.length; i++) {
                splitted = parts[i].split("=");
                key = splitted.shift();

                if (output[key] !== undefined) {
                    output[key] = [output[key]];
                    output[key].push(splitted.join("="));
                } else {
                    output[key] = splitted.join("=");
                }
            }

            return output;
        }
    }
});