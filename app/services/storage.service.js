Player.factory('Storage', function($q) {
    "use strict";

    return {
        set: function(obj) {
            var deferred = $q.defer();

            chrome.storage.sync.set(obj, function() {
                deferred.resolve(obj);
            });

            return deferred.promise;
        },

        get: function(key) {
            var deferred = $q.defer();

            chrome.storage.sync.get(key, function(data) {
                if(Object.keys(data).length) {
                    deferred.resolve(data);
                }
                else {
                    deferred.reject(data);
                }
            });

            return deferred.promise;
        },

        remove: function(key) {
            var deferred = $q.defer();

            chrome.storage.sync.remove(key, function() {
                deferred.resolve(data);
            });

            return deferred.promise;
        }
    }
});