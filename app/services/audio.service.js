Player.factory('audio', function($http) {
	var parent_block 	= '#players';
	var current_player	= '';
	var my_player		= $('#my-player');
	var current_track	= '';
	var is_playing		= false;
	
	return {
		setCurrentTrack: function(data) {
			this.current_track = data;
		},
		
		getCurrentTrack: function() {
			return current_track;
		},
		
		set: function(src) {
			this.current_player.attr('src', src);
		},
		
		get: function(){
			return this.current_player;
		},
		
		play: function(){
			this.current_player[0].play();
			is_playing = true;
		},
		
		pause: function() {
			this.current_player[0].pause();
		},
		
		stop: function() {
			this.current_player[0].pause();
			this.current_player[0].currentTime = 0;
		},
		
		volume: function(volume) {
			this.current_player[0].volume = volume;
		},
		
		getDuration: function() {
			return this.current_player[0].duration;
		},
		
		isPause: function() {
			return this.current_player[0].paused;
		},
		
		isPlaying: function() {
			return is_playing;
		},
		
		isEnded: function() {
			return this.current_player[0].ended;
		},
		
		setCurrentPlayer: function(player_id) {
			$('audio').removeClass('current-player');
			$('#' + player_id).addClass('current-player');
			
			this.current_player = $('#' + player_id);
		},
		
		getCurrentPlaylist: function(){
			return current_player.data('playlist');
		},
		
		getTrackBitrate: function(url, duration, callback) {
			$http.head(url).success(function(data, status, headers, config) {
				length 	= headers('Content-Length')
				bitrate = Math.floor((parseInt(length) / duration / 125));
				
				switch(bitrate) {
					case 318: case 319: case 321: case 322: case 323: 
						bitrate = 320;
					break;
					case 190: case 191: case 193:  case 194:
						bitrate = 192;
					break;
					case 126: case 127: case 129: case 130:
						bitrate = 128;
					break;
				}
				
				return callback(bitrate);
			});
		}
	}
});