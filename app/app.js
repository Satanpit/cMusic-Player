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

        .factory('Utils', UtilsService)
        .factory('State', StateService)
        .factory('Storage', StorageService)
        .factory('VK', VkService)
        .factory('LastFM', LastFmService)
        .factory('Auth', AuthService)

        .controller('AppController', AppController)
        .controller('WindowController', WindowController)
        .controller('HeaderController', HeaderController)
        .controller('MenuController', MenuController)
        .controller('PlaylistController', PlaylistController)
        .controller('AuthController', AuthController)

        .directive('link', ImageDirective)
        .directive('toggle', ToggleDirective)
})();