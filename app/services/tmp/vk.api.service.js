Player.factory('VK', function($http, $rootScope, $timeout, storage){
	var options = {
		api_url		: 'https://api.vk.com/method/',
		client_id	: 3989655,
		scope		: 'audio,status,offline',
		redirect_url: "https://" + chrome.runtime.id + ".chromiumapp.org/cb",
		v			: '5.5',
		access_token: false,
		user_id		: false,
		queries 	: []
	};
	
	var call = function(method, params, callback) {
		if(options.access_token && options.user_id) {
			if(params.owner_id === false) {
				params.owner_id = options.user_id;
			}
			
			options.queries.push({
				method		: method,
				params		: params,
				callback	: callback
			});
			
			_call();
		}
		else {
			storage.get('vk_user_id', function(vk) {
				if(vk.vk_user_id > 0) {
					storage.get('vk_token', function(obj) {
						options.access_token 	= obj.vk_token;
						options.user_id			= vk.vk_user_id;
						
						$rootScope.owner_id		= vk.vk_user_id;
						
						call(method, params, callback);
					});
				}
			});
		}
	};
	
	var _call = function(flag) {
		if(options.queries.length > 1 && !flag) {
			return false;
		}
		
		$timeout(function() {
			obj = options.queries[0];
			
			$http({
				method	: 'GET',
				url		: options.api_url + obj.method + '?access_token=' + options.access_token,
				async	: false,
				params	: obj.params
			}).success(function(result) {
				options.queries.splice(0, 1);
				
				if(result.error) {
					switch(result.error.error_code) {
						case 5:
							storage.remove(['vk_token', 'vk_user_id']);
							options.access_token 	= false;
							options.user_id			= false;
							
							$rootScope.Init();
						break;
						case 14:
							$rootScope.Captcha(
								result.error.captcha_img, 
								result.error.captcha_sid, 
								options.api_url + obj.method + '?access_token=' + options.access_token
							);
						break;
					}
				}
				else {
					obj.callback(result);
				}
					
				if(options.queries.length) {
					_call(1);
				}
			});
		}, 800);
	};
	
	var parseQuery = function (str) {
		var parts = str.split("&");
		var output = {};
		var splitted, key;
		
		if (!str.length)
			return output;
		
		for (var i = 0; i < parts.length; i++) {
			splitted = parts[i].split("=");
			key = splitted.shift();
		
			if (output[key] !== undefined) {
				output[key] = [output[key]];
				output[key].push(splitted.join("="));
			} else {
				output[key] = splitted.join("=");
			}
		}
		
		return output;
	};
	
	var auth = function(callback) {
		storage.get('vk_user_id', function(vk) {
			if(vk.vk_user_id > 0) {
				storage.get('vk_token', function(obj) {
					options.access_token 	= obj.vk_token;
					options.user_id			= vk.vk_user_id;
					
					$rootScope.owner_id		= vk.vk_user_id;
					callback(vk.vk_user_id);
				});
			}
			else {
				params = $.param({
					client_id		: options.client_id,
					scope			: options.scope,
					redirect_uri	: options.redirect_url,
					v				: options.v,
					display			: "page",
					response_type	: "token"
				})
				
				chrome.identity.launchWebAuthFlow({
					url: "https://oauth.vk.com/authorize?" + params,
					interactive: true
				}, function (responseURL) {
					
					if (!responseURL) {
						console.log('Error: ' + responseURL);
						return;
					}
					
					var response = parseQuery(responseURL.replace(options.redirect_url + "#", ""));
					
					storage.set({
						'vk_token' 		: response.access_token,
						'vk_user_id'	: parseInt(response.user_id, 10)
					});
					
					options.access_token 	= response.access_token;
					options.user_id			= parseInt(response.user_id, 10);
					
					$rootScope.owner_id		= parseInt(response.user_id, 10);
					
					callback(options.user_id);
				});
			}
		});
	};
	
	return {
		get: function(count, offset, album_id, callback){
			call('audio.get', {
				owner_id	: options.user_id,
				album_id	: album_id,
				count		: count,
				offset		: offset,
				v			: '5.13'
			}, function(result){
				callback(result);
			});
		},
		
		getAlbums: function(count, offset, callback){
			call('audio.getAlbums', {
				owner_id	: options.user_id,
				count		: count,
				offset		: offset
			}, function(result){
				callback(result);
			});
		},
		
		addAlbum: function(title, callback) {
			call('audio.addAlbum', {
				title : title
			}, function(result){
				callback(result);
			});
		},
		
		editAlbum: function(album_id, title, callback) {
			call('audio.editAlbum', {
				album_id	: album_id,
				title 		: title
			}, function(result){
				callback(result);
			});
		},
		
		deleteAlbum: function(album_id, callback) {
			call('audio.deleteAlbum', {
				album_id	: album_id
			}, function(result){
				callback(result);
			});
		},
		
		moveToAlbum: function(album_id, audio_ids, callback) {
			call('audio.moveToAlbum', {
				album_id 	: album_id,
				audio_ids	: audio_ids
			}, function(result){
				callback(result);
			});
		},
		
		getLyrics: function(lyrics_id, callback) {
			call('audio.getLyrics', {
				lyrics_id	: lyrics_id,
			}, function(result){
				callback(result);
			});
		},
		
		getAudioAndAlbums: function(count, callback) {
			this.execute('return {tracks: API.audio.get({count: '+ count +'}), albums: API.audio.getAlbums()};', '5.8', callback);
		},
		
		search: function(q, count, offset, performer_only, callback){
			call('audio.search', {
				q				: q,
				count			: count,
				offset			: offset,
				//auto_complete	: 1,
				sort			: 2,
				search_own		: 1,
				performer_only	: performer_only,
				v				: '5.8'
			}, function(result){
				callback(result);
			});
		},
		
		searchByUser: function(q, count, performer_only, callback) {
			call('execute', {
				code: 	'var a = API.audio.search({"q":"'+ q +'","count":'+ count +', "search_own":1, "performer_only" :'+ performer_only +'}).items; '+
						'var b = API.audio.get({"audio_ids": a@.id}); return b;',
				v	: '5.13'
			}, function(result){
				if(callback) {
					
					callback(result);
				}
			});
		},
		
		getRecommendations: function(aid, count, offset, callback){
			call('audio.getRecommendations', {
				target_audio	: aid > 0 ? options.user_id + '_' + aid : 0,
				count			: count,
				user_id			: options.user_id,
				offset			: offset,
				v				: '5.13'
			}, function(result){
				callback(result);
			});
		},
		
		setBroadcast: function(aid, owner_id, callback){
			call('audio.setBroadcast', {
				audio	: aid > 0 ? owner_id + '_' + aid : 0
			}, function(result){
				if(callback) {
					callback(result);
				}
			});
		},
		
		add: function(audio_id, owner_id, callback) {
			call('audio.add', {
				audio_id	: audio_id,
				owner_id	: owner_id
			}, function(result){
				callback(result);
			});
		},
		
		edit: function(audio_id, owner_id, artist, title, genre_id, callback) {
			call('audio.edit', {
				audio_id	: audio_id,
				owner_id	: owner_id,
				artist		: artist,
				title		: title,
				genre_id	: genre_id
			}, function(result){
				if(callback) {
					callback(result);
				}
			});
		},
		
		reorder: function(audio_id, before, after, callback) {
			call('audio.reorder', {
				audio_id	: audio_id,
				before		: before,
				after		: after,
			}, function(result){
				if(callback) {
					callback(result);
				}
			});
		},
		
		delete: function(audio_id, owner_id, callback) {
			call('audio.delete', {
				audio_id	: audio_id,
				owner_id	: options.user_id
			}, function(result){
				if(callback) {
					callback(result);
				}
			});
		},
		
		getUserInfo: function(callback) {
			call('users.get', {
				user_ids	: options.user_id,
				fields		: 'photo_200,city,country',
				name_case	: 'Nom',
				v			: '5.8'
			}, function(result){
				if(callback) {
					callback(result);
				}
			});
		},
		
		execute: function(code, v, callback) {
			call('execute', {
				code: code,
				v	: v
			}, function(result){
				if(callback) {
					callback(result);
				}
			});
		},
		
		auth: function(callback) {
			return auth(callback);
		},
		
		logout: function(callback) {
			
		},
		
		genreList: {
			'1'		: 'Rock',
			'2'		: 'Pop',
			'3'		: 'Rap & Hip-Hop',
			'4'		: 'Easy Listening',
			'5'		: 'Dance & House',
			'6'		: 'Instrumental',
			'7'		: 'Metal',
			'8'		: 'Dubstep',
			'9'		: 'Jazz & Blues',
			'10'	: 'Drum & Bass',
			'11'	: 'Trance',
			'12'	: 'Chanson',
			'13'	: 'Ethnic',
			'14'	: 'Acoustic & Vocal',
			'15'	: 'Reggae',
			'16'	: 'Classical',
			'17'	: 'Indie Pop',
			'18'	: 'Other',
			'19'	: 'Speech',
			'21'	: 'Alternative',
			'22'	: 'Electropop & Disco'
		}
	}
});