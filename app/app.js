"use strict";

var Player = angular.module('Player', ['ngAnimate', 'pascalprecht.translate', 'ui.router']);

Player.config(function($stateProvider, $urlRouterProvider, $translateProvider, Config) {
    $translateProvider.useStaticFilesLoader({
        prefix: Config.lang.prefix,
        suffix: Config.lang.suffix
    });

    $translateProvider.preferredLanguage(
        Config.lang.support.indexOf(navigator.language) !== -1 ? navigator.language : Config.lang.default
    );

    $stateProvider.state('main', {
        url: "",
        views: {
            "header": {
                controller: "HeaderCtrl",
                templateUrl: "views/main/headerView.html"
            },
            "menu": {
                controller: "MenuCtrl",
                templateUrl: "views/main/menuView.html"
            },
            "playlist": {
                controller: "",
                templateUrl: "views/main/playlistView.html"
            },
            "content": {
                controller: "",
                templateUrl: "views/main/contentView.html"
            }
        }
    }).state('main.slide', {
        views: {
            "slide@": {
                templateUrl: "views/main/slideView.html"
            }
        }
    }).state('main.slide.news', {
        views: {
            "content": {
                template: "test"
            }
        },
        onEnter: function($state) {
            console.log($state.current.name);
        }
    });
}).run(function() {

});

Player.factory('$exceptionHandler', function() {
    return function (exception, cause) {
        console.warn(exception.message + ' (caused by "' + cause + '")');
    };
});

var $ = BikeJS;
