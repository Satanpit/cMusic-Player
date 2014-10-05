Player.factory('VK', function($http, $q, Config, Utils) {
    "use strict";

    var API = {
        get: function(method, params) {
            params.access_token = API.user.token;
            params.v = Config.api.vk.ver;

            return $http({
                method  : Config.api.vk.method,
                url	    : Config.api.vk.url + method,
                async	: Config.api.vk.async,
                params	: params
            });
        }
    };

    return {
        auth: function() {
            var deferred = $q.defer();

            chrome.identity.launchWebAuthFlow({
                url         : Config.oauth.vk.url + Utils.serialize(Config.oauth.vk.params),
                interactive : Config.oauth.interactive
            }, function(url) {
                var params = Utils.parseURL(url.replace(Config.oauth.vk.params.redirect_uri + "#", ""));

                if (params.user_id && params.access_token) {
                    deferred.resolve({
                        userId: params.user_id,
                        token: params.access_token
                    });
                }
                else {
                    deferred.reject();
                }
            });

            return deferred.promise;
        },

        init: function(user, count, albumId) {
            API.user = {
                id: user.id,
                token: user.token
            };

            return API.get('execute.init', {
                count: count,
                albumId: albumId
            });
        },

        audio: {
            get: function(count, offset, albumId) {
                return API.get('audio.get', {
                    album_id: albumId,
                    count	: count,
                    offset	: offset
                });
            }
        }
    }
});