Player.factory('Audio', function() {
    "use strict";

    var settings = {
        preload: 'metadata'
    };

    var audio = {};

    return {
        create: function(name, src) {
            audio[name] = new Audio();
            audio[name].preload = settings.preload;
            if (src && typeof src === 'string') {
                audio[name].src = src;
            }

            return audio[name];
        },

        set: function(name, src) {
            audio[name].src = src;

            return this;
        },

        play: function(name) {
            audio[name].play();

            return this;
        }
    }
});