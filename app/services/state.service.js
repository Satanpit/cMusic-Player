Player.factory('State', function($rootScope) {
    "use strict";

    $rootScope.state = [];

    return {
        set: function(key, value) {
            $rootScope.state[key] = value || true;

            return this;
        },

        get: function(key) {
            return $rootScope.state[key] || false;
        },

        remove: function(key) {
            $rootScope.state[key] = undefined;

            return this;
        }
    }
});