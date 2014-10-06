Player.controller('AppCtrl', function($scope, VK, State, Storage, Config) {
    /**
     * Global app controller
     *
     * @author Alex Hyrenko
     * @email alex.hyrenko@gmail.com
     * @ver 3.0
     */


    /**
     * Check user authorization
     */
    Storage.get(['app', 'vk', 'lastFm']).then(function(data) {
        return VK.init(data.vk, Config.app.itemsInPage.tracks.default * 2, 0);
    }).then(function(result) {
        $scope.tracks = result.data.response.tracks.items;
        State.set('loaded');
    }).then(null, function() {
        State.set('loaded');
        State.set('authFormVK');
    });

    /**
     * Get Chrome identity window
     * click event handler
     */
    $scope.getAuthFormVK = function() {
        VK.auth().then(function(data) {
            return Storage.set({
                vk: {
                    userId: data.userId,
                    token: data.token
                }
            });
        }).then(function(data) {
            return VK.init(data.vk, Config.app.itemsInPage.tracks.default * 2, 0);
        }).then(function(result) {
            $scope.tracks = result.data.response.tracks.items;
            State.remove('authFormVK');
        });
    };
});