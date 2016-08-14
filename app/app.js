var Player = angular.module('Player', ['ui.bootstrap', 'ngAnimate', 'ui.sortable']).config(function($provide, $sceProvider) {
	$sceProvider.enabled(false);

	$provide.decorator('$window', function($delegate) {
		Object.defineProperty($delegate, 'history', {get: function () {
			return null;
		}});

		return $delegate;
	});
});