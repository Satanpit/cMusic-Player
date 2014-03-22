Player.factory('stateManager', function($rootScope) {
	$rootScope.state = [];
	
	return {
		set: function(name) {
			$rootScope.state[name] = true;
		},
		
		get: function(name) {
			return $rootScope.state[name];
		},
		
		remove: function(name) {
			$rootScope.state[name] = undefined;
		}
	}
});