Player.controller('WindowCtrl', function($scope){
    var current = chrome.app.window.current();

    $scope.close = function() {
        current.close();
	};

    $scope.fullScreen = function(){
		if(current.isMaximized()) {
            current.restore();
		}
		else {
            current.maximize();
		}
	};

    $scope.minimize = function() {
        current.minimize();
	};
});