Player.controller('AppCtrl', function($scope, VK, State, Config) {
    /**
     * Global app controller
     *
     * @author Alex Hyrenko
     * @email alex.hyrenko@gmail.com
     * @ver 3.0
     */

    /**
     * Get Chrome identity window
     * click event handler
     */
    $scope.getAuthFormVK = function() {
        VK.auth().then(function(data) {
            chrome.storage.sync.set({
                vk: {
                    id: data.userId,
                    token: data.token
                }
            });

            return VK.init(data, Config.app.itemsInPage.tracks.default * 2, 0);
        }).then(function(data) {
            console.log(data);
        });
    };

    /*chrome.storage.sync.get(['app', 'vk', 'lastFm'], function(data) {
        if (data.vk) {
            State.set('loaded');
        }
        else {
            State.set('loaded');
        }
    });*/
});