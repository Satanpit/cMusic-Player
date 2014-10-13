(function() {
    "use strict";

    angular.module('cMusic', ['ngAnimate', 'pascalprecht.translate'])
        .config(function($translateProvider, Config) {
            $translateProvider.useStaticFilesLoader({
                prefix: Config.lang.prefix,
                suffix: Config.lang.suffix
            });

            $translateProvider.preferredLanguage(
                Config.lang.support.indexOf(navigator.language) !== -1 ? navigator.language : Config.lang.default
            );
        })

        .constant('Config', Config)

        .value('User', {
            set: function(data) {
                this.settings = data;
            }
        })

        .factory('Utils', UtilsService)
        .factory('State', StateService)
        .factory('Storage', StorageService)
        .factory('VK', VkService)
        .factory('LastFM', LastFmService)
        .factory('Auth', AuthService)

        .controller('AppController', AppController)
        .controller('WindowController', WindowController)
        .controller('AuthController', AuthController)
        .controller('HeaderController', HeaderController)
        .controller('MenuController', MenuController)
        .controller('PlaylistController', PlaylistController)

        .directive('uiImage', ImageDirective)
        .directive('uiPlaylist', PlaylistDirective)

        .directive('toggle', ToggleDirective)

        .run(function(Storage, State, User) {
            Storage.get(['app', 'vk', 'lastFm']).then(function(data) {
                User.set(data);

            }).then(null, function() {
                State.set('showAuthProcess');
            });
        })
})();