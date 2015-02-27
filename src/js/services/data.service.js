function DataService() {
    "use strict";

    var model = {};

    return {
        set: function(object) {
            model = object;
        },

        get: function() {
            return model;
        }
    }
}