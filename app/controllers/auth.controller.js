function AuthController($scope, Storage, VK, LastFM, Config) {
    "use strict";

    this.settings = {
        notification: Config.app.settings.notification,
        scrobble: Config.app.settings.scrobble,
        translate: Config.app.settings.translate,
        lang: Config.lang.default
    };

    this.checkUserAuth = function() {
        Storage.get(['app', 'vk', 'lastFm']).then(function(data) {
            $scope.$emit('user.auth', data);
        }.bind(this)).then(null, function() {
            this.showAuthForm = 'vk';
        }.bind(this));
    };

    this.showIdentityWindow = function() {
        VK.auth().then(function(data) {
            return Storage.set({
                vk: {
                    userId: data.userId,
                    token: data.token
                }
            });
        }).then(function(data) {
            this.showAuthForm = 'lastFm';

            return VK.user.get({
                id: data.vk.userId,
                token: data.vk.token
            })
        }.bind(this)).then(function(result) {

            this.userData = result.data.response[0];
        }.bind(this));
    };

    this.loginLastFm = function() {
        if (this.lastFmLogin && this.lastFmPass) {
            LastFM.user.auth(this.lastFmLogin, this.lastFmPass).then(function(response) {
                return Storage.set({
                    lastFm: {
                        name: response.session.name,
                        session: response.session.key
                    }
                });
            }).then(function(){
                this.showAuthForm = 'settings';

            }.bind(this)).then(null, function(error) {
                console.log(error);
            });
        }
    };

    this.lastFmSkip = function() {
        this.showAuthForm = 'settings';
    };

    this.saveSettings = function() {
        Storage.set({
            app: this.settings
        }).then(function() {
            this.showAuthForm = false;
        }.bind(this));

        //Storage.remove(['app', 'vk', 'lastFm']);
    };
}