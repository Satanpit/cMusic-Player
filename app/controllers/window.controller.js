Player.controller('WindowCtrl', function($scope, $rootScope, storage){
	$scope.close = function() {
		storage.set({
			'volume'		: $rootScope.volume,
			'scrobble'		: $rootScope.isScrobble,
			'translation'	: $rootScope.isTranslation,
			'notifications'	: $rootScope.isNotifications
		});
		
		chrome.app.window.current().close()
	}
	
	$scope.fullscreen = function(){
		if(chrome.app.window.current().isMaximized()) {
			chrome.app.window.current().restore();
			$rootScope.isMaximized = false;
		}
		else {
			chrome.app.window.current().maximize();
			$rootScope.isMaximized = true;
		}
		
		$rootScope.isSecure = false;
	}
	
	$scope.minimize = function() {
		chrome.app.window.current().minimize();
	}
	
	$scope.secure = function() {
		$rootScope.isSecure = !$rootScope.isSecure;
		
		if($rootScope.isSecure) {
			chrome.app.window.current().resizeTo(540, screen.height)
			chrome.app.window.current().moveTo(screen.width, 0);
		}
		else {
			chrome.app.window.current().resizeTo(1200, 950);
			chrome.app.window.current().moveTo((screen.width - 1200) / 2, 30);
		}
	}
});