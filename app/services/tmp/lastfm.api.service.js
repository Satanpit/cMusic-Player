Player.factory('LastFMtmp', function($http, Utils){
	var options	= {
		api_key		: '4d1b3ad77378fa5c95fe3483b3caf97b',
		api_secret	: 'b19a84c20f77a31b7113f128380d66d6',
		api_url		: 'https://ws.audioscrobbler.com/2.0/',
		user		: false,
		session		: false
	};
	
	var call = function(method, params, callback, data, session, requestMethod, api_sig){
		params['api_key'] 	= options.api_key;
		params['method']	= method;

		if(requestMethod == 'POST' || api_sig) {
			params['api_sig'] = getApiSignature(Utils.assign(params, data))
		}
		
		params['format'] = 'json';

		return $http({
			method	: requestMethod || 'GET',
			url		: options.api_url + Utils.serialize(params),
			data	: Utils.serialize(data, true),
			headers	: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function(res){
			return callback(res.data);
		});
	};
	
	var getApiSignature = function(object){
		/*var keys   = [];
		var string = '';

		for(var key in params){
			keys.push(key);
		}

		keys.sort();

		for(var index in keys){
			var key = keys[index];

			string += key + params[key];
		}

		string += options.api_secret;*/

        return md5(Object.keys(object).sort().reduce(function(prev, current) {
            prev.push(current + object[current]);
            return prev;
        }, []).join('') + options.api_secret);
	};
	
	var isAuth = function(callback) {
		if(options.session) {
			callback(true)
		} 
		else {
			storage.get('lastfm_session', function(obj) {
				if(obj.lastfm_session) {
					storage.get('lastfm_user', function(user) {
						options.session = obj.lastfm_session;
						options.user 	= user.lastfm_user;
						
						callback(true);
					});
				}
				else {
					callback(false);
				}
			});
		}
	};
	
	return {
		chart: {
			getTopArtists: function(page, limit, callback) {
				call('chart.getTopArtists', {
					page	: page,
					limit	: limit,
					lang	: 'ru'
				}, function(result){
					callback(result);
				});
			}
		},
		
		artist: {
			getInfo: function(artist, callback){
				call('artist.getInfo', {
					artist		: artist,
					lang		: 'ru',
					username	: options.user || ''
				}, function(result){
					callback(result);
				});
			},
			
			getSimilar: function(artist, limit, callback){
				call('artist.getSimilar', {
					artist		: artist,
					limit		: limit,
					autocorrect	: 1,
					lang		: 'ru'
				}, function(result){
					return callback(result);
				});
			},
			
			getTopAlbums: function(artist, limit, page, callback) {
				call('artist.getTopAlbums', {
					artist		: artist,
					page		: page,
					limit		: limit,
					autocorrect	: 1,
					lang		: 'ru'
				}, function(result){
					return callback(result);
				});
			},
			
			getTopTracks: function(artist, limit, page, callback) {
				call('artist.getTopTracks', {
					artist		: artist,
					page		: page,
					limit		: limit,
					autocorrect	: 1,
					lang		: 'ru'
				}, function(result){
					return callback(result);
				});
			},
			
			getEvents: function(artist, limit, page, callback) {
				call('artist.getEvents', {
					artist		: artist,
					page		: page,
					limit		: limit,
					autocorrect	: 1,
					lang		: 'ru'
				}, function(result){
					return callback(result);
				});
			},
			
			search: function(artist, limit, page, callback) {
				return call('artist.search', {
					artist		: artist,
					limit		: limit,
					page		: page,
					autocorrect	: 1,
					lang		: 'ru'
				}, function(result){
					return callback(result);
				});
			}
		},
		
		album: {
			getInfo: function(artist, album, callback) {
				call('album.getInfo', {
					artist		: artist,
					album		: album,
					autocorrect	: 1,
					lang		: 'ru',
					username	: options.user || ''
				}, function(result){
					return callback(result);
				});
			}
		},
		
		track: {
			getInfo: function(artist, track, callback){
				call('track.getInfo', {
					artist		: artist,
					track		: track,
					autocorrect	: 1,
					lang		: 'ru'
				}, function(result){
					callback(result);
				});
			},
			
			getSimilar: function(track, artist, limit, callback) {
				call('track.getSimilar', {
					track		: track,
					artist		: artist,
					limit		: limit,
					autocorrect	: 1,
					lang		: 'ru'
				}, function(result){
					callback(result);
				});
			},
			
			updateNowPlaying: function(artist, track, duration) {
				call('track.updateNowPlaying', {}, function(result){
					
				}, {
					artist		: artist,
					track		: track,
					duration	: duration
				}, options.session, 'POST');
			},
			
			scrobble: function(artist, track) {
				call('track.scrobble', {}, function(result){
					
				}, {
					artist		: artist,
					track		: track,
					timestamp	: Math.floor(new Date().getTime()/1000)
				}, options.session, 'POST');
			},
			
			love: function(artist, track) {
				call('track.love', {}, function(result){
					
				}, {
					artist		: artist,
					track		: track
				}, options.session, 'POST');
			},
			
			unlove: function(artist, track) {
				call('track.unlove', {}, function(result){
					
				}, {
					artist		: artist,
					track		: track
				}, options.session, 'POST');
			},
			
			search: function(track, limit, page, callback) {
				return call('track.search', {
					track		: track,
					limit		: limit,
					page		: page,
					lang		: 'ru'
				}, function(result){
					return callback(result);
				});
			}
		},
		
		user: {
			getTopArtists: function(period, limit, page, callback) {
				call('user.getTopArtists', {
					user		: options.user,
					period		: period,
					limit		: limit,
					page		: page,
					lang		: 'ru'
				}, function(result){
					callback(result);
				});
			},
			
			getNewReleases: function(callback) {
				call('user.getNewReleases', {
					user		: options.user,
					lang		: 'ru'
				}, function(result){
					callback(result);
				});
			},
			
			getRecommendedArtists: function(limit, page, callback) {
				call('user.getRecommendedArtists', {
					limit		: limit,
					page		: page
				}, function(result){
					callback(result);
				}, false, options.session, 'POST', true);
			},
			
			getRecommendedEvents: function(limit, page, callback) {
				call('user.getRecommendedEvents', {
					limit		: limit,
					page		: page
				}, function(result){
					callback(result);
				}, false, options.session, 'POST', true);
			},
			
			getEvents: function(limit, page, callback) {
				call('user.getEvents', {
					user		: options.user,
					limit		: limit,
					page		: page,
					lang		: 'ru'
				}, function(result){
					callback(result);
				});
			},
			
			getInfo: function(callback) {
				call('user.getInfo', {
					user		: options.user,
					lang		: 'ru'
				}, function(result){
					callback(result);
				});
			},
			
			auth: function(user, passw, callback) {
				call('auth.getMobileSession', {}, function(result){
					callback(result)
				}, {
					username	: user,
					password	: passw
				}, options.session, 'POST');
			},
			
			isAuth: function(callback) {
				isAuth(callback);
			}
		},
		
		event: {
			attend: function(event, status, callback) {
				call('event.attend', {
					event		: event,
					status		: status
				}, function(result){
					callback(result);
				}, false, options.session, 'POST', true);
			},
			
			getInfo: function(event, callback) {
				call('event.getInfo', {
					event		: event
				}, function(result){
					callback(result);
				});
			}
		},
		
		geo: {
			getEvents: function(limit, page, tag, location, callback) {
				call('geo.getEvents', {
					limit		: limit,
					page		: page,
					tag			: tag,
					location	: location || '',
					lang		: 'ru'
				}, function(result){
					callback(result);
				});
			}
		},
		
		parseDate: function(date) {
			date 	= new Date(date);
			now		= new Date();
			
			var months 	= new Array("Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря");
			var days	= new Array('Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота');
			
			return {
				date	: date.getDate(),
				day		: days[date.getDay()],
				month	: months[date.getMonth()],
				year	: date.getFullYear(),
				time	: (date.getMinutes() == 0 ? '00' : date.getMinutes()),
				diff	: Math.round((date - now)/1000/86400)
			}
		}
	}
});