Player.controller('AppCtrl', function($scope, VK, State, Config) {
    chrome.storage.sync.get(['app', 'vk', 'lastFm'], function(data) {
        if (data.vk) {
            State.set('loaded');
        }
        else {
            State.set('loaded');
        }
    });
});