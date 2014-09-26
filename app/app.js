"use strict";

var Player = angular.module('Player', ['ngAnimate', 'pascalprecht.translate']);

Player.config(function($translateProvider, Config) {
    $translateProvider.useStaticFilesLoader({
        prefix: Config.lang.prefix,
        suffix: Config.lang.suffix
    });

    $translateProvider.preferredLanguage(
        Config.lang.support.indexOf(navigator.language) !== -1 ? navigator.language : Config.lang.default
    );
}).run(function() {

});

Player.factory('$exceptionHandler', function() {
    return function (exception, cause) {
        console.warn(exception.message + ' (caused by "' + cause + '")');
    };
});