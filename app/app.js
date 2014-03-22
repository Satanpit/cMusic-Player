var Player = angular.module('Player', ['ui.bootstrap', 'ngAnimate', 'ui.sortable']).config(function($sceProvider) {
	$sceProvider.enabled(false);
});