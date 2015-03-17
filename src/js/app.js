/*
* Copyright 2015 Alex Hyrenko <alex.hyrenko@gmail.com>
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
 */

(function() {
    "use strict";

    angular.module('cMusic', ['ngAnimate', 'pascalprecht.translate'])
        .config(function($translateProvider, $controllerProvider, $injector,  Config) {
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
        .directive('eventsWatch', EventsWatchDirective)
        .directive('clickDelegate', ClickDelegateDirective)
        .directive('uiScrollbar', ScrollBarDirective)

        .run(function(Storage, State, User) {
            Storage.get(['app', 'vk', 'lastFm']).then(function(data) {
                User.set(data);

            }).then(null, function() {
                State.set('showAuthProcess');
            });
        });

    /*$(document).ready(function() {
        angular.bootstrap(document, ['cMusic']).invoke(function(Config) {
            console.dir(Config);
        })
    });*/
})();