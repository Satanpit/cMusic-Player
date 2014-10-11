function UtilsService($http, $q) {
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

        serialize: function(object, notStart) {
            return (!notStart ? '?' : '') + Object.keys(object).reduce(function(a,k){
                a.push(k+'='+encodeURIComponent(object[k]));
                return a
            },[]).join('&');
        },

        assign: function(obj1, obj2) {
            if (typeof obj1 === 'object' && typeof obj2 === 'object') {
                var tmp = angular.copy(obj1);
                Object.keys(obj2).forEach(function(key) {
                    tmp[key] = obj2[key];
                });
                return tmp;
            } else {
                if (typeof obj1 === 'object') return obj1;
            }

            throw Error('obj1 is not object');
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
        },

        loadBlobImage: function(url) {
            var xhr = new XMLHttpRequest(),
                deferred = $q.defer();

            xhr.responseType = 'blob';
            xhr.onload = function() {
                deferred.resolve(window.webkitURL.createObjectURL(xhr.response));
            };
            xhr.open('GET', url, true);
            xhr.send();

            return deferred.promise;
        }
    }
}