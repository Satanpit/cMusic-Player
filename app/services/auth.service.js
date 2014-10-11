function AuthService($q, VK, LastFM, Storage, Config) {
    "use strict";

    return {
        Init: function() {
            return Storage.get(['app', 'vk', 'lastFm']).then(function(data) {
                return $q.all([
                    VK.init(data.vk, Config.app.itemsInPage.tracks.default * 2, 0),
                    LastFM.init(null, '', Config.app.itemsInPage.artists.lib, 0)
                ]);
            });
        }
    }
}