Player.factory('VK', function($http, Config, Utils) {
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
        auth: function(success, error) {
            chrome.identity.launchWebAuthFlow({
                url         : Config.oauth.vk.url + Utils.serialize(Config.oauth.vk.params),
                interactive : Config.oauth.interactive
            }, function(url) {
                var params = Utils.parseURL(url.replace(Config.oauth.vk.params.redirect_uri + "#", ""));

                if (!params.user_id || !params.access_token) {
                    error();
                    return false;
                }

                success(params.user_id, params.access_token);
            });
        },

        init: function(user, count, albumId) {
            API.user = {
                id: user.user_id,
                token: user.access_token
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