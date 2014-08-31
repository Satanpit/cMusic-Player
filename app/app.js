var Player = angular.module('Player', ['ngAnimate']);

Player.config(function($sceProvider) {
    $sceProvider.enabled(false);
});

Player.factory('$exceptionHandler', function() {
    return function (exception, cause) {
        console.warn(exception.message + ' (caused by "' + cause + '")');
    };
});