Player.controller('PlayerCtrl', function($scope, $rootScope, $filter, $timeout, $interval, $templateCache, VK, LastFM, audio, stateManager, storage, utils){
	/**
	 * cMusic Player ver 2.0.3
	 * Глобальный контроллер приложения
	 *
	 * @author Alex Hyrenko
	 * @email alex.hyrenko@gmail.com
	 * @ver 2.0.3
	 */
	
	$rootScope.Init = function() {
		storage.get('vk_token', function(vk) {
			if(!vk.vk_token) {
				$scope.modal_content = 'views/login.html';
				$scope.$apply();
			}
			else {
				// Запускаем статистику Google Analytics
				service = analytics.getService('cMusic Player');
				tracker = service.getTracker('UA-47794396-1');
				
				tracker.sendAppView('Главная страница приложения');
				tracker.sendEvent('Запуск приложения', 'Запуск приложения');
				
				var timing = tracker.startTiming('Analytics Performance', 'Send Event');
				timing.send();
				
				// Установка флага трансляции статуса при инициализации
				storage.get('translation', function(obj) {
					$rootScope.isTranslation = obj.translation || false;
				});
				
				
				// Установка флага скроллинга при инициализации
				storage.get('scrobble', function(obj) {
					$rootScope.isScrobble = obj.scrobble || false;
				});
				
				// Отображать всплывающие окна при воспроизвидении следующего трека
				storage.get('notifications', function(obj) {
					$rootScope.isNotifications = obj.notifications || false;
				});
				
				// Загружаем плейлист и альбомы пользователя
				stateManager.set('tracksLoad');
		
				$scope.album_id 		= 0;
				$scope.playlistTracks	= {
					items: [],
					count: 0
				};
				
				VK.getAudioAndAlbums(50, function(result) {
					angular.forEach(result.response.tracks.items, function(item, index) {
						item.duration_sec 	= item.duration;
						item.duration 		= $filter('sec2min')(item.duration);
						$scope.playlistTracks.items.push(item);
					});
					
					$scope.playlistTracks.count 	= result.response.tracks.count;
					$scope.playlists 				= result.response.albums.items;
					
					stateManager.remove('tracksLoad');
				});
				
				$scope.content_template = 'views/my-library.html';
			}
		});
	};
	
	$rootScope.Captcha = function(captcha_img, captcha_sid, url) {
		
	};
	
	$scope.getVKAuthForm = function() {
		VK.auth(function(result) {
			$scope.modal_content = false;
			
			$rootScope.Init();
		});
	}

	// Выводим версию приложения
	$scope.appVersion = chrome.runtime.getManifest().version;

	// Устанавливаем плеер по умолчанию
	audio.setCurrentPlayer('my-player');
	
	// Проверяем, авторизирован ли пользователь на Last FM
	LastFM.user.isAuth(function(is_auth) {
		$scope.is_lastfm_auth = is_auth;
	});
	
	// Установка громкости при инициализации
	storage.get('volume', function(obj) {
		$scope.volume = obj.volume || 0.8;
	});
	
	var isNull = function(var_name) {
		return (!$scope[var_name] || $scope[var_name].length == 0) ? true : false;
	};
	
	$scope.Tracks = function(var_name, added_ids) {
		return {
			get: function(album_id, isLoadMoreItems, offset) {
				if(($scope[var_name] && !isLoadMoreItems) || stateManager.get('loadMoreTracks')) {
					return false;
				}
				else if($scope[var_name] && isLoadMoreItems) {
					offset = $scope[var_name].items.length;
					
					if($scope[var_name].items.length == $scope[var_name].count) {
						return false;
					}
					
					stateManager.set('loadMoreTracks');
				}
				else {
					$scope[var_name] = {
						items		: [],
						count		: 0
					};
					
					if(added_ids) {
						$scope[added_ids] = [];
					}
					
					stateManager.set('tracksLoad');
				}
				
				if($scope.isShuffle) {
					if($scope[var_name].count > 50) {
						offset = (Math.random() * (($scope[var_name].count - 50) - 1) + 1).toFixed(0);
					}
				}
				
				VK.get(50, offset || 0, album_id, function(result) {
					if($scope.isShuffle) {
						result.response.items.sort(function() {return 0.5 - Math.random()});
					}
					
					angular.forEach(result.response.items, function(item, index) {
						item.duration_sec 	= item.duration;
						item.duration 		= $filter('sec2min')(item.duration);
						
						if(album_id && added_ids) {
							$scope[added_ids].push(item.id);
						}
						
						$scope[var_name].items.push(item);
					});
					
					$scope[var_name].count = result.response.count;
					
					if($scope.isShuffle && $scope.currentTrack && $scope.isMyPlaylist && !isLoadMoreItems) {
						$scope[var_name].items.unshift($scope.currentTrack);
						$scope.tracks = $scope[var_name].items;
					}
					
					stateManager.remove('loadMoreTracks');
					stateManager.remove('tracksLoad');
				});
			},
			
			search: function(q, isLoadMoreItems, offset) {
				if(stateManager.get('loadMoreSearch')) {
					return false;
				}
				else if($scope[var_name] && isLoadMoreItems) {
					offset = $scope[var_name].items.length;
					
					if($scope[var_name].items.length == $scope[var_name].count) {
						return false;
					}
					
					stateManager.set('loadMoreSearch');
				}
				else {
					$scope[var_name] = {
						items		: [],
						count		: 0
					};
				}
				
				stateManager.set('searchLoad');
				
				$scope.isVkRecomendations	= false;
				
				if(angular.isObject(q)) {
					$scope.performer_only = q.type;
					query = q.name;
				}
				else {
					query = q;
				}
				
				VK.search(query, 50, offset, $scope.performer_only, function(result){
					angular.element('#search-input').val(query);
					
					angular.forEach(result.response.items, function(item) {
						item.duration_sec 	= item.duration;
						item.duration 		= $filter('sec2min')(item.duration);
						
						$scope[var_name].items.push(item);
					});
					
					if(!isLoadMoreItems) {
						$scope[var_name].count = result.response.count;
					}
					
					stateManager.remove('searchLoad');
					stateManager.remove('loadMoreSearch');
				});
			}
		}
	};
	
	$scope.Artist = function(artist) {
		return {
			getInfo: function(var_name, no_top_tracks) {
				if(isNull(var_name) || $scope[var_name].name != artist) {
					LastFM.artist.getInfo(artist, function(result) {
						$scope[var_name] = {
							name	: artist,
							image 	: result.artist.image[1],
							tags	: result.artist.tags.tag,
							bio		: result.artist.bio,
							count	: result.artist.stats.userplaycount
						}
						
						if(!no_top_tracks) {
							LastFM.artist.getTopTracks(artist, 10, 0, function(toptracks) {
								tracks = [];
								
								angular.forEach(toptracks.toptracks.track, function(track) {
									tracks.push('API.audio.search({"q": "' + artist + ' – ' + track.name + '", "count": 1})');
								});
								
								$scope[var_name].topTracks = {
									tracks		: [],
									tmp_tracks	: tracks,
									real_result	: toptracks.toptracks.track
								}
								
								execute($scope[var_name].topTracks);
							});
						}
					});
				}
				
				tracker.sendAppView('Открыа подробная инфа о исполнителе');
			},
			
			getTopTracks: function(var_name, count) {
				if(isNull(var_name)) {
					LastFM.artist.getTopTracks(artist, count || 10, 0, function(toptracks) {
						tracks = [];
						
						angular.forEach(toptracks.toptracks.track, function(track) {
							tracks.push('API.audio.search({"q": "' + artist + ' – ' + track.name + '", "count": 1})');
						});
						
						$scope[var_name] = {
							tracks		: [],
							tmp_tracks	: tracks,
							real_result	: toptracks.toptracks.track
						}
						
						execute($scope[var_name]);
					});
				}
			},
			
			getSimilar: function (var_name) {
				if(isNull(var_name)) {
					LastFM.artist.getSimilar(artist, 36, function(result){
						$scope[var_name] =  result.similarartists.artist;
					});
				}
				
				tracker.sendAppView('Вкладка похожих исполнителей');
			},
			
			getAlbums: function(var_name) {
				if(isNull(var_name)) {
					LastFM.artist.getTopAlbums(artist, 50, 0, function(result) {
						if(result.topalbums.album && result.topalbums.album.length > 0) {
							$scope[var_name] = [];
							
							angular.forEach(result.topalbums.album, function(item, index) {
								LastFM.album.getInfo(artist, item.name, function(tracks) {
									if(tracks.album.tracks.track.length > 4) {
										$scope[var_name].push({
											name		: item.name,
											artist		: item.artist.name,
											image		: item.image,
											count		: tracks.album.tracks.track.length,
											year		: new Date(tracks.album.releasedate).getFullYear()
										});
									}
								});
							});
						}
					});
				}
				
				tracker.sendAppView('Вкладка альбомов');
			},
			
			getAlbum: function(album, var_name) {
				stateManager.set('loadAlbum');
				
				LastFM.album.getInfo(artist, album, function(result) {
					tracks = [];
					
					angular.forEach(result.album.tracks.track, function(track) {
						tracks.push('API.audio.search({"q": "' + result.album.artist + ' – ' + track.name + '", "count": 1})');
					});
						
					$scope[var_name] = {
						name		: result.album.name,
						image		: result.album.image,
						count		: result.album.tracks.track.length,
						year		: new Date(result.album.releasedate).getFullYear(),
						playcount	: result.album.userplaycount,
						tracks		: [],
						tmp_tracks	: tracks,
						real_result	: result.album.tracks.track
					}
					
					if(stateManager.get('loadAlbum')) {
						stateManager.remove('loadAlbum');
						
						execute($scope[var_name]);
					}
				});
			},
			
			getEvents: function(var_name) {
				if(isNull(var_name)) {
					stateManager.set('loadEvents');
					
					LastFM.artist.getEvents(artist, 50, 0, function(result) {
						if(result.events.event && result.events.event.length > 0) {
							angular.forEach(result.events.event, function(item) {
								item.startDate 		= LastFM.parseDate(item.startDate);
								item.artists.artist = angular.isArray(item.artists.artist) ? item.artists.artist.slice(0, 4).join(', ') : item.artists.artist;
							});
							
							$scope[var_name] = result.events.event;
							
							stateManager.remove('loadEvents');
						}
						else {
							$scope[var_name] = false;
						}
					});
				}
				
				tracker.sendAppView('Вкладка событий');
			},
			
			getUserTracks: function(var_name) {
				if(isNull(var_name)) {
					VK.searchByUser(artist, 100, 1, function(result) {
						if(result.response.items.length > 0) {
							$scope[var_name] = [];
						
							angular.forEach(result.response.items, function(item) {
								item.duration_sec 	= item.duration;
								item.duration 		= $filter('sec2min')(item.duration);
								$scope[var_name].push(item);
							});
						}
						
						stateManager.set('userTracksLoaded');
					});
				}
			},
			
			getUserLib: function(var_name, isLoadMoreItems, page) {
				if(($scope[var_name] && !isLoadMoreItems) || stateManager.get('userLibLoad')) {
					return false;
				}
				else if($scope[var_name] && isLoadMoreItems) {
					page = ($scope[var_name].items.length / 36) + 1;
					
					if(page > $scope[var_name].pages) {
						return false;
					}
				}
				else {
					$scope[var_name] = {
						items: [],
						pages: 0
					}
				}
				
				LastFM.user.getTopArtists('', 36, page || 0, function(result){
					if(isLoadMoreItems) {
						angular.forEach(result.topartists.artist, function(item) {
							$scope[var_name].items.push(item);
						});
					}
					else {
						$scope[var_name] = {
							items: result.topartists.artist,
							pages: result.topartists['@attr'].totalPages
						}
					}
					
					stateManager.remove('userLibLoad');
				});
			},
			
			getTopArtists: function(var_name, isLoadMoreItems, page) {
				if(($scope[var_name] && !isLoadMoreItems) || stateManager.get('topArtistsLoad')) {
					return false;
				}
				else if($scope[var_name] && isLoadMoreItems) {
					page = ($scope[var_name].items.length / 36) + 1;
					
					if(page > $scope[var_name].pages) {
						return false;
					}
				}
				else {
					$scope[var_name] = {
						items: [],
						pages: 0
					}
				}
				
				LastFM.chart.getTopArtists(page || 0, 36, function(result) {
					if(isLoadMoreItems) {
						angular.forEach(result.artists.artist, function(item) {
							$scope[var_name].items.push(item);
						});
					}
					else {
						$scope[var_name] = {
							items: result.artists.artist,
							pages: result.artists['@attr'].totalPages
						}
					}
					
					stateManager.remove('topArtistsLoad');
				});
			}
		}
	};
	
	$scope.Recommended = function(var_name) {
		return {
			getArtists: function(isLoadMoreItems, page) {
				if(($scope[var_name] && !isLoadMoreItems) || stateManager.get('recommendedArtistsLoad')) {
					return false;
				}
				else if($scope[var_name] && isLoadMoreItems) {
					page = ($scope[var_name].items.length / 36) + 1;
					
					if(page > $scope[var_name].pages) {
						return false;
					}
				}
				else {
					tracker.sendAppView('Рекомендации - артисты');
				}
				
				stateManager.set('recommendedArtistsLoad');
				
				LastFM.user.getRecommendedArtists(36, page || 0, function(result) {
					if(page) {
						angular.forEach(result.recommendations.artist, function(item) {
							$scope[var_name].items.push(item);
						});
					}
					else {
						$scope[var_name] = {
							items: result.recommendations.artist,
							pages: result.recommendations['@attr'].totalPages
						}
					}
					
					stateManager.remove('recommendedArtistsLoad');
				});
			},
			
			getTracks: function(aid, isLoadMoreItems, offset) {
				if(($scope[var_name] && !isLoadMoreItems) || stateManager.get('recommendedTracksLoad')) {
					return false;
				}
				else if($scope[var_name] && isLoadMoreItems) {
					offset = $scope[var_name].items.length;
					
					if($scope[var_name].items.length == $scope[var_name].count) {
						return false;
					}
				}
				else {
					$scope[var_name] = {
						items: [],
						count: 0
					};
					
					tracker.sendAppView('Рекомендации - треки');
				}
				
				stateManager.set('recommendedTracksLoad');
				
				VK.getRecommendations(aid || 0, 50, offset || 0, function(result){
					angular.forEach(result.response.items, function(item) {
						item.duration_sec 	= item.duration;
						item.duration 		= $filter('sec2min')(item.duration);
						$scope[var_name].items.push(item);
					});
					
					if(!isLoadMoreItems) {
						$scope[var_name].count = result.response.count;
					}
					
					stateManager.remove('recommendedTracksLoad');
				});
			}
		}
	};
	
	$scope.User = function(var_name) {
		return {
			getLastFmUserInfo: function() {
				if(!$scope[var_name]) {
					LastFM.user.getInfo(function(result) {
						$scope[var_name] = result.user;
					});
				}
			},
			
			getVkUserInfo: function() {
				if(!$scope[var_name]) {
					VK.getUserInfo(function(result) {
						$scope[var_name] = result.response[0];
					});
				}
			}
		}
	};
	
	$scope.Events = function(var_name) {
		return {
			getGeoEvents: function(isLoadMoreItems, page) {
				if(($scope[var_name] && !isLoadMoreItems) || stateManager.get('geoEventsLoad')) {
					return false;
				}
				else if($scope[var_name] && isLoadMoreItems) {
					page = ($scope[var_name].items.length / 30) + 1;
					
					if(page > $scope[var_name].pages) {
						return false;
					}
				}
				else {
					$scope[var_name] = {
						items: [],
						pages: 0
					}
					
					tracker.sendAppView('Все события');
				}
				
				stateManager.set('geoEventsLoad');
				
				LastFM.geo.getEvents(30, page || 0, '', '', function(result) {
					angular.forEach(result.events.event, function(item) {
						item.startDate 		= LastFM.parseDate(item.startDate);
						item.artists.artist = angular.isArray(item.artists.artist) ? item.artists.artist.slice(0, 4).join(', ') : item.artists.artist;
						
						$scope[var_name].items.push(item);
					});
					
					if(!page) {
						$scope[var_name].pages = result.events['@attr'].totalPages;
					}
					
					stateManager.remove('geoEventsLoad');
				});
			},
			
			getRecommendedEvents: function(isLoadMoreItems, page) {
				if(($scope[var_name] && !isLoadMoreItems) || stateManager.get('recommendedEventsLoad') || !$scope.is_lastfm_auth) {
					return false;
				}
				else if($scope[var_name] && isLoadMoreItems) {
					page = ($scope[var_name].items.length / 30) + 1;
					
					if(page > $scope[var_name].pages) {
						return false;
					}
				}
				else {
					$scope[var_name] = {
						items: [],
						pages: 0
					}
					
					tracker.sendAppView('Рекомендованные события');
				}
				
				LastFM.user.getRecommendedEvents(30, page || 0, function(result) {
					angular.forEach(result.events.event, function(item) {
						item.startDate 		= LastFM.parseDate(item.startDate);
						item.artists.artist = angular.isArray(item.artists.artist) ? item.artists.artist.slice(0, 4).join(', ') : item.artists.artist;
						
						$scope[var_name].items.push(item);
					});
					
					if(!page) {
						$scope[var_name].pages = result.events['@attr'].totalPages;
					}
					
					stateManager.remove('recommendedEventsLoad');
				});
			},
			
			getUserEvents: function(isLoadMoreItems, page) {
				if(($scope[var_name] && !isLoadMoreItems) || stateManager.get('myEventsLoad') || !$scope.is_lastfm_auth) {
					return false;
				}
				else if($scope[var_name] && isLoadMoreItems) {
					page = ($scope[var_name].items.length / 30) + 1;
					
					if(page > $scope[var_name].pages) {
						return false;
					}
				}
				else {
					$scope[var_name] = {
						items: [],
						pages: 0
					}
					
					tracker.sendAppView('Мои события');
				}
				
				stateManager.set('myEventsLoad');
				
				LastFM.user.getEvents(30, page || 0, function(result) {
					angular.forEach(result.events.event, function(item) {
						item.startDate 		= LastFM.parseDate(item.startDate);
						item.artists.artist = angular.isArray(item.artists.artist) ? item.artists.artist.slice(0, 4).join(', ') : item.artists.artist;
						
						$scope[var_name].items.push(item);
					});
				
					if(!page) {
						$scope[var_name].pages = result.events['@attr'].totalPages;
					}
					
					stateManager.remove('myEventsLoad');
				});
			},
			
			getEvent: function(event_id) {
				LastFM.event.getInfo(event_id, function(result) {
					artists = [];
					
					if(angular.isArray(result.event.artists.artist)) {
						artists = result.event.artists.artist;
					}
					else {
						artists[0] = result.event.artists.artist;
					}
					
					result.event.artists.full = [];
					
					angular.forEach(artists, function(item) {
						LastFM.artist.getInfo(item, function(artist) {
							result.event.artists.full.push({
								name	: artist.artist.name,
								image	: artist.artist.image
							});
						});
					});
					
					result.event.status 	= 2;
					result.event.startDate 	= LastFM.parseDate(result.event.startDate);
					
					LastFM.user.getEvents(100, 0, function(my) {
						angular.forEach(my.events.event, function(item) {
							if(item.id == event_id) {
								result.event.status = item['@attr'].status;
							}
						});
					});
					
					$scope[var_name] = result.event;
				});
			}
		}
	};
	
	// Устанавливаем плейлист
	$scope.setAlbum = function(album_id) {
		if(album_id != $scope.album_id) {
			stateManager.set('loadPlaylist');
			$scope.playlistTracks	= false;
			$scope.album_id			= album_id;
			
			$scope.Tracks('playlistTracks').get(album_id);
			
			tracker.sendEvent('Пользователь выбрал плейлист', 'Пользователь выбрал плейлист');
		}
	}
	
	// Удаление трека из моих аудиозаписей
	$scope.deleteMyTrack = function(aid, owner_id, index, type) {
		VK.delete(aid, 0, function(result) {
			if(result.response == 1) {
				switch(type) {
					case 1: 
						$scope.playlistTracks.items.splice(index, 1);
					break;
				}
			}
		});
		
		tracker.sendEvent('Пользователь удалил трек', 'Пользователь удалил трек');
	}
	
	// Получаем все жанры ВК 
	$scope.getGenreList = function() {
		return VK.genreList;
	}
	
	// Редактирование трека из моих аудиозаписей
	$scope.editMyTrack = function(track, index, type) {
		$scope.modal_form 				= 'views/edit-my-track.html';
		$scope.editableTrack 			= track;
		$scope.editableTrack.genre_id 	= String($scope.editableTrack.genre_id);
		tracker.sendAppView('Форма редактирования трека');
	}
	
	// Сохраняем трек после редактирования
	$scope.saveTrackInfo = function() {
		VK.edit(
			$scope.editableTrack.id, 
			$scope.editableTrack.owner_id, 
			$scope.editableTrack.artist, 
			$scope.editableTrack.title, 
			$scope.editableTrack.genre_id == "undefined" ? 18 : $scope.editableTrack.genre_id, 
			function(result){
				$scope.modal_form = '';	
				tracker.sendEvent('Пользователь отредактировал трек', 'Пользователь отредактировал трек');
		});
	}
	
	$scope.modalClose = function() {
		$scope.modal_form = '';
		$scope.addedPlaylistTracks 		= [];
		$scope.currentPlaylistTracks 	= [];
	}
	
	$scope.addPlaylist = function() {
		$scope.addedPlaylistTracks 	= [];
		$scope.playlistName			= '';
		$scope.modal_form 			= 'views/add-playlist.html';
	}
	
	$scope.addToPlaylist = function(audio_id) {
		if($.inArray(audio_id, $scope.addedPlaylistTracks) != -1) {
			$scope.addedPlaylistTracks.splice($scope.addedPlaylistTracks.indexOf(audio_id), 1);
		}
		else {
			$scope.addedPlaylistTracks.push(audio_id);
		}
	}
	
	$scope.isAdded = function(audio_id) {
		if($.inArray(audio_id, $scope.addedPlaylistTracks) != -1) {
			return true;
		}
		else {
			return false;
		}
	}
	
	$scope.savePlaylist = function(album_id) {
		if(this.playlistName && this.playlistName.length > 0) {
			if(album_id && album_id > 0) {
				VK.deleteAlbum(album_id, function(result) {
					$scope.playlists.splice($scope.playlistIndex, 1);
				});
			}
			
			album_name = this.playlistName;
			
			VK.addAlbum(this.playlistName, function(result) {
				if(result.response.album_id) {
					VK.moveToAlbum(result.response.album_id, $scope.addedPlaylistTracks.join(','), function(res) {});
					
					$scope.modal_form = '';
				}
				
				$scope.playlists.unshift({
					album_id	: result.response.album_id,
					title		: album_name
				});
			});
		}
	}
	
	$scope.editPlaylist = function(album_id, title, index) {
		$scope.modal_form 				= 'views/edit-playlist.html';
		$scope.playlistName				= title;
		$scope.playlistAlbumId			= album_id;
		$scope.playlistIndex			= index;
		$scope.currentPlaylistTracks 	= false;
	}
	
	$scope.deletePlaylist = function(album_id) {
		if(album_id && album_id > 0) {
			VK.deleteAlbum(album_id, function(result) {
				$scope.playlists.splice($scope.playlistIndex, 1);
				$scope.modal_form = '';
			});
		}
	}
	
	// Добавляем трек из результатов поиска 
	$scope.addToMyPlaylist = function(track) {
		if(track.owner_id != $scope.owner_id) {
			VK.add(track.id || track.aid, track.owner_id, function(result) {
				if(result.response > 0) {
					track.id = result.response;
					$scope.playlistTracks.items.unshift(track);
				}
			});
			
			tracker.sendEvent('Пользователь добавил трек', 'Пользователь добавил трек');
		}
	}
	
	// Сортировка треков основного плейлиста
	$scope.myPlaylistSortable =  {
		update: function(e, ui) {
			$timeout(function() {
				current			= ui.item.scope();
				current_index 	= current.$index;

				VK.reorder(current.track.id, $scope.playlistTracks.items[current_index + 1].id, 0, function(result) {
					
				});
			}, 100);
		},
		axis: 'y'
	}
	
	/**
	 * Управление глобальными функциями плеера
	 */
	
	// Установка громкости
	$scope.$watch('volume', function(new_val, old_val){
		audio.volume(new_val);
		$rootScope.volume = new_val;
	});
	
	// Воспроизводится ли текущий трек
	$scope.isCurrentTrack = function(track) {
		return $scope.currentTrack === track;
	}
	
	currentTime = false;
	
	// Воспроизведение/пауза текущего трека
	$scope.Play = function(track, index, playlist) {
		if($scope.isCurrentTrack(track)) {
			audio.isPause() ? audio.play() : audio.pause();
			
			tracker.sendEvent('Пауза', 'Пауза');
		}
		else {
			if(currentTime) {
				clearInterval(currentTime);
			}
			
			if(playlist && playlist.id) {
				audio.set(track.url);
				audio.play();
				
				$scope.currentTrack 	= track;
				$scope.current_index 	= index;
			
				return false;
			}
			
			if(audio.getDuration() > 0 && $scope.tracks[$scope.current_index]) {
				$scope.tracks[$scope.current_index].duration = $filter('sec2min')(Math.round(audio.getDuration()));
			}
			
			if(playlist) {
				$scope.isMyPlaylist = false;
				
				if($scope.tracks !== playlist) {
					$scope.tracks = playlist;
				}
			}
			else {
				$scope.isMyPlaylist	= true;
				$scope.trackLyrics	= false;
				
				if($scope.$$childTail.artistContentType == 2) {
					$scope.getTrackLyrics(track);
				}
				
				if($scope.tracks !== $scope.playlistTracks.items) {
					$scope.tracks = $scope.playlistTracks.items;
				}
				
				if(!$scope.currentTrack || track.artist != $scope.currentTrack.artist) {
					$scope.topTracks						= [];
					$scope.userTracksByArtist				= [];
					
					$scope.$$childTail.artistContentType 	= 0;
					$scope.artistContentType 				= 0;
					$scope.content_template 				= 'views/played-info.html';
					$scope.playedInfoType 					= 'bio';
					$scope.playedSimilar					= false;
					$scope.playedAlbums						= false;
					$scope.playedEvenets					= false;
					
					$scope.Artist(track.artist).getInfo('currentArtistInfo', true);
				}
			}
			
			$scope.buffered = 0;
			
			if($scope.isTranslation) {
				if(track) {
					VK.setBroadcast(track.aid || track.id, track.owner_id);
				}
			}
			
			if($scope.isScrobble) {
				LastFM.track.updateNowPlaying(track.artist, track.title, track.duration_sec);
			}
			
			LastFM.track.getInfo(track.artist, track.title, function(data){
				if(!data.error) {
					if(data.track.album) {
						$scope.current_image = data.track.album.image;
					}
					else {
						$scope.current_image = 0;
					}
					
					if($rootScope.isNotifications && chrome.app.window.current().isMinimized()) {
						
						utils.getLocalImageURL($scope.current_image ? $scope.current_image[1]['#text'] : false, function(image) {
							chrome.notifications.getAll(function(result) {
								if(result[1]) {
									chrome.notifications.clear('1', function() {});
								}
								
								chrome.notifications.create('1', {
									type	: 'basic',
									title	: track.artist,
									message	: track.title,
									iconUrl	: image || 'icons/no-image.png',
									buttons	: [
										{'title' : 'Следующий трек' },
										{'title' : 'Предидущый трек' }
									]
								}, function() {});
							});
						});
					}
				}
			});
			
			audio.getTrackBitrate(track.url, track.duration_sec, function(bitrate) {
				$scope.currentTrack.bitrate = bitrate;
			});
			
			audio.set(track.url);
			audio.play();
			
			$scope.currentTrack 	= track;
			$scope.current_index 	= index;
		}
	}
	
	$scope.searchUserTracksByArtist = function(artist) {
		if(!$scope.userTracksByArtist || $scope.userTracksByArtist.length == 0) {
			VK.searchByUser(artist, 100, 1, function(result) {
				$scope.userTracksByArtist = [];
				angular.forEach(result.response.items, function(item) {
					item.duration_sec 	= item.duration;
					item.duration 		= $filter('sec2min')(item.duration);
					$scope.userTracksByArtist.push(item);
				});
			});
		}
	}
	
	// События (вынести их нахуй от сюда!)
	chrome.notifications.onButtonClicked.addListener(function (notificationId, index) {
		if(index == 0) {
			$scope.controlNext();
		} else {
			$scope.controlPrev();
		}
	});
	
	// Следим за текущим состоянием воспроизведения
	audio.get().bind("play", function() {
		currentTime = setInterval(function() {
			if(audio.get()[0].currentTime) {
				$scope.$apply(function() {
					$scope.currentTrack.duration = $filter('sec2min')(Math.round(audio.get()[0].currentTime).toFixed(2));
					$scope.played_progress = ((audio.get()[0].currentTime / audio.get()[0].duration) * 100).toFixed(3);
				});
				
				if($scope.isMyPlaylist == 1 && audio.get()[0].currentTime.toFixed(0) == 2 && $scope.topTracks.length == 0) {
					$scope.Artist($scope.currentTrack.artist).getTopTracks('topTracks');
				}
			}
		}, 1000);
		
		$scope.isPlay = true;
		$scope.$apply();
	}).bind('pause', function() {
		$scope.isPlay = false;
		clearInterval(currentTime);
		$scope.$apply();
	})
	
	// Переключение трека на следующий
	$scope.controlNext = function(){
		if($scope.tracks[$scope.current_index + 1] && $scope.current_index != undefined) {
			$scope.Play($scope.tracks[$scope.current_index + 1], $scope.current_index + 1, $scope.isMyPlaylist ? undefined : $scope.tracks);
		}
		else {
			$scope.Play($scope.tracks[0], 0, $scope.isMyPlaylist ? undefined : $scope.tracks);
		}
		
		tracker.sendEvent('Следующий трек', 'Следующий трек');
	}
	
	// Переключение трека на предидущий
	$scope.controlPrev = function(){
		if($scope.current_index > 0) {
			$scope.Play($scope.tracks[$scope.current_index - 1], $scope.current_index - 1, $scope.isMyPlaylist ? undefined : $scope.tracks);
			
			tracker.sendEvent('Предидущий трек', 'Предидущий трек');
		}
	}
	
	// Воспроизведение/пауза текущего трека
	$scope.controlPlay = function(){
		if($scope.current_index == undefined) { 
			$scope.Play($scope.playlistTracks.items[0], 0);
		}
		else {
			audio.isPause() ? audio.play() : audio.pause();
		}
	}
	
	// Установка трека на повторение
	$scope.repeatTrack = function() {
		$scope.isRepeatTrack = !$scope.isRepeatTrack;
	}
	
	// Режим случайного выбора трека
	$scope.shuffle = function() {
		$scope.playlistTracks = false;
		
		$scope.isShuffle = !$scope.isShuffle;
		
		$scope.Tracks('playlistTracks').get($scope.album_id);
	}
	
	// Установка времени воспроизведения
	$scope.setProgress = function(event) {
		if($scope.currentTrack) {
			audio.get()[0].currentTime = ((event.offsetX / event.currentTarget.clientWidth) * $scope.currentTrack.duration_sec).toFixed(2);
		}
	}
	
	// Выполняем нужные функции в конце воспроизведения
	audio.get().bind("ended", function(){
		if($scope.isScrobble) {
			LastFM.track.scrobble($scope.currentTrack.artist, $scope.currentTrack.title);
		}
		if($scope.isRepeatTrack) {
			if($scope.isScrobble) {
				LastFM.track.updateNowPlaying($scope.currentTrack.artist, $scope.currentTrack.title, $scope.currentTrack.duration_sec);
			}
			
			audio.get()[0].currentTime = 0;
			audio.play();
		}
		else {
			$scope.controlNext();
		}
	});
	
	// Отображаем процес буферизации
	audio.get().bind("progress", function(){
		if(audio.get()[0].buffered.length) {
			$scope.$apply(function() {
				$scope.buffered = Math.abs(parseInt((audio.get()[0].buffered.end(audio.get()[0].buffered.length - 1) / audio.get()[0].duration) * 100, 10));
			});
		}
	});
	
	/**
	 * Управление контентной частью приложения
	 */
	 
	
	//chrome.storage.sync.remove(['lastfm_session', 'lastfm_user'])
	// Отслеживаем авторизацию пользователя на LastFM
	$scope.$watch('is_lastfm_auth', function(new_val, old_val) {
		if(new_val) {
			$scope.userLibArtists = false;
			$scope.Artist().getUserLib('userLibArtists');
		}
	});
	
	// Вызов формы авторизации на LastFM
	$scope.GetLastfmAuthForm = function() {
		$scope.modal_content = 'views/lastfm-auth.html';
	}
	
	// Авторизация на LastFM
	$scope.LastfmAuth = function() {
		if(this.login != undefined && this.passw != undefined) {
			LastFM.user.auth(this.login, this.passw, function(result) {
				if(result.session) {
					$scope.modal_content 	= '';
					$scope.is_lastfm_auth	= true;
					
					$rootScope.isScrobble = false;
					$scope.scrobble();
					
					LastFM.user.getInfo(function(result) {
						$scope.lastfmUser = result.user;
					});
					
					tracker.sendEvent('Авторизация на LastFM');
				}
				else {
					$scope.message = 'Неверный логин или пароль';	
				}
			});
		}
	}
	
	// Установка скроблинга
	$scope.scrobble = function() {
		$rootScope.isScrobble 	= !$rootScope.isScrobble;
		
		if($scope.is_lastfm_auth) {
			if($rootScope.isScrobble && $scope.currentTrack) {
				LastFM.track.updateNowPlaying($scope.currentTrack.artist, $scope.currentTrack.title, $scope.currentTrack.duration_sec);
				
				tracker.sendEvent('Скробблинг включен');
			}
		}
		else {
			$scope.GetLastfmAuthForm();
		}
	}
	
	$scope.notifications = function() {
		$rootScope.isNotifications 	= !$rootScope.isNotifications;
	}
	
	// Установка трансляции трека в статусе пользователя
	$scope.translation = function() {
		$rootScope.isTranslation = !$rootScope.isTranslation;
		
		if($rootScope.isTranslation) {
			if($scope.currentTrack) {
				VK.setBroadcast($scope.currentTrack.aid);
			}
			
			tracker.sendEvent('Трансляция включена');
		}
		else {
			VK.setBroadcast('');
		}
	}
	
	/**
	 * Поиск еби его мать 
	 * жрать хочу, но эту херь надо доделать
	 */
	
	// Вызываем окно поиска
	$scope.showSearch = function() {
		$scope.isSearchShow		= !$scope.isSearchShow;
		this.q 					= '';
		
		if($scope.isSearchShow) {
			if(!$scope.searchTracks || $scope.count == 0) {
				$timeout(function() {
					$scope.Recommended('searchTracks').getTracks(0);
					
					//$scope.isContentShow 		= true;
					$scope.isVkRecomendations	= true;
				}, 500);
			}
		}
		else {
			$scope.searchTracks = false;
			$templateCache.remove('views/search.html');
		}
		
		tracker.sendAppView('Открыт поиск');
	}
	
	// Поиск исполнителя из основного плейлиста
	$scope.searchByArtist = function(artist) {
		$scope.searchBy(1);
		$scope.isVkRecomendations	= false;
		
		if($scope.isSearchShow) {
			$scope.Tracks('searchTracks').search(artist);
		}
		else {
			$scope.isSearchShow = true;
			$scope.Tracks('searchTracks').search(artist);
		}
	}
	
	$scope.searchBy = function(val) {
		$scope.performer_only = val;
	}
	
	$scope.$watch('performer_only', function(new_val, old_val) {
		if(old_val != undefined && new_val != old_val) {
			q = angular.element('#search-input').val();
			$scope.Tracks('searchTracks').search(q);
		}
	});
	
	// Поиск трека/исполнителя
	$scope.search = function(q) {
		$scope.isVkRecomendations	= false;
		
		$scope.Tracks('searchTracks').search(this.q);
	}
	
	// Подгружаем результаты поиска при скроле
	$scope.loadMoreSearchResult = function(){
		if($scope.isVkRecomendations) {
			$scope.Recommended('searchTracks').getTracks(0, 1);
		}
		else {
			$scope.Tracks('searchTracks').search(this.q, 1);
		}
	}
	
	// Автокомплит для поиска 
	$scope.getSearchAutocomplete = function(val) {
		if(val) {
			return LastFM.artist.search(val, 5, 0, function(result){
				searchAutocomplete = [];
				
				if(result.results.artistmatches.artist && result.results.artistmatches.artist.length > 0) {
					angular.forEach(result.results.artistmatches.artist, function(item){
						searchAutocomplete.push({
							name: item.name,
							type: 1
						});
					});
					
					return LastFM.track.search(val, 5, 0, function(result) {
						angular.forEach(result.results.trackmatches.track, function(item){
							searchAutocomplete.push({
								name: item.name,
								type: 0
							});
						});
						
						return searchAutocomplete;
					});
				}
				else {
					return false;
				}
			});
		}
	}
	
	// Закрываем окно поиска
	$scope.closeSearch = function() {
		$scope.isSearchShow		= false;
		//$scope.search_tracks	= [];
		$scope.search_template 	= '';
	}
	
	// Вызываем окно с подробной информацией об исполнителе
	// --
	$scope.artistMoreInfo = function(artist) {
		$scope.isArtistMoreInfoShow 		= true;
		$scope.performer_only				= 1;
		$scope.moreInfoSimilar 				= [];
		$scope.moreInfoArtistTopAlbums		= [];
		$scope.moreInfoArtistEvents			= [];
		$scope.moreInfoTopTracks			= [];
		$scope.$$childTail.moreInfoType		= 'bio';
		$scope.moreInfoType					= 'bio';
		$scope.artist_min_info				= [];
		$scope.moreInfoUserTracks			= [];
		$scope.albumTracks 					= false;
		
		$scope.Artist(artist).getInfo('artist_min_info');
	}
	
	$scope.toAlbumList = function() {
		$scope.albumTracks = false;
	}
	
	$scope.getTrackLyrics = function(track) {
		if(track.lyrics_id) {
			stateManager.set('loadTrackLyrics');
			
			VK.getLyrics(track.lyrics_id, function(result) {
				$scope.trackLyrics = result.response.text;
				stateManager.remove('loadTrackLyrics');
			});
		}
		else {
			$scope.trackLyrics = '';
		}
	}
	
	// Вывод рекомендаций по треку
	$scope.showTrackRecommendations = function(track) {
		if(!$scope.recommendTrack || track.id != $scope.recommendTrack.id) {
			$scope.recommendedTrackItems	= false;
			$scope.isRecommendedTracksShow 	= true;
			$scope.recommendTrack 			= track;
			$scope.recommendedTrackArtist	= false;
			
			$scope.Artist(track.artist).getInfo('recommendedTrackArtist', 1);
			$scope.Recommended('recommendedTrackItems').getTracks(track.id);
		}
	}
	
	// Закрываем окно похожих треков 
	$scope.closeTrackRecommendations = function() {
		$scope.isRecommendedTracksShow 	= false;
		$scope.recommendedTrackArtist 	= false;
		$scope.recommendedTrackItems 	= false;
	}
	
	// Вызываем окно с событиями 
	$scope.showEvents = function() {
		$scope.isEventsShow 	= !$scope.isEventsShow;
	}
	
	$scope.showMyRecommendations = function() {
		$scope.isRecommendsShow = !$scope.isRecommendsShow;
	}
	
	function execute(array) {
		$timeout(function() {
			VK.execute('return ['+ array.tmp_tracks.slice(0, 5).join(',') +'];', '', function(result) {
				angular.forEach(result.response, function(track, index) {
					if(track[1]) {
						track[1].duration_sec 	= track[1].duration;
						track[1].duration 		= $filter('sec2min')(track[1].duration);
						track[1].title			= array.real_result[index].name;
						track[1].artist			= array.real_result[index].artist.name;
						array.tracks.push(track[1]);
					}
				});
				
				array.tmp_tracks.splice(0, 5);
				array.real_result.splice(0, 5);
				
				if(array.tmp_tracks.length > 0) {
					execute(array);
				}
				else {
					stateManager.set('loadAlbum');
				}
			});
		}, 200);
	}
	
	// Закрываем инфу об исполнителе
	$scope.closeArtistMoreInfo = function() {
		$scope.isArtistMoreInfoShow			= false;
		$scope.search_tracks				= [];
		$scope.moreInfoSimilar 				= [];
		$scope.moreInfoArtistTopAlbums		= [];
		$scope.moreInfoArtistEvents			= [];
		$scope.artist_more_info_template 	= '';
		
		$templateCache.remove('views/artist-more-info.html');
	}
	
	// Закрываем окно событий
	$scope.closeEvents = function() {
		$scope.isEventsShow 	= false;
		$scope.events_template	= '';
		$scope.geoEvents		= [];
	}
	
	// Открываем окно библиотеки
	$scope.showMyLib = function() {
		$scope.isLibShow	= !$scope.isLibShow;
		
		if($scope.isLibShow && !$scope.artists) {
			//$scope.ContentInit(true);
			
			tracker.sendAppView('Библиотека пользователя');
		}
	}
	
	// Горячие клавиши
	$(window).on("keydown", function(event) {
		if(event.ctrlKey && event.which == 39) {
			$scope.controlNext();
			
			return false;
		}
		else if(event.ctrlKey && event.which == 37) {
			$scope.controlPrev();
			
			return false;
		}
		else if(event.ctrlKey && event.which == 32) {
			$scope.controlPlay();
			
			return false;
		}
		else if(event.ctrlKey && event.which == 38) {
			if($scope.volume < 1) {
				$scope.volume = $scope.volume + 0.1;
				$scope.$apply();
				
				return false;
			}
		}
		else if(event.ctrlKey && event.which == 40) {
			if($scope.volume > 0.1) {
				$scope.volume = $scope.volume - 0.1;
				$scope.$apply();
				
				return false;
			}
		}
	});
	
	$scope.getEventFull = function(event_id) {
		if(event_id > 0) {
			$scope.Events('eventFull').getEvent(event_id);
			
			$scope.modal_content = 'views/event-full.html';
		}
		else {
			$scope.eventFull 		= false;
			$scope.eventArtistTracks= false;
			$scope.modal_content 	= '';
			
			audio.setCurrentPlayer('my-player');
		}
	}
	
	$scope.attendEvent = function(event_id, status) {
		LastFM.event.attend(event_id, status, function(result) {
			$scope.eventFull.status = status;
			
			if($scope.userEvents) {
				$scope.userEvents = false;
				$scope.Events('userEvents').getUserEvents();
			}
		});
	}
	
	function _playArtist() {
		$timeout(function() {
			if($scope.eventArtistTracks.tracks.length) {
				!audio.isPause() ? audio.pause() : '';
			 
				audio.setCurrentPlayer('event-player');
				audio.set($scope.eventArtistTracks.tracks[0].url);
				audio.play();
				
				$scope.eventCurrentTrack	= $scope.eventArtistTracks.tracks[0];
				eventArtistTrackIndex 		= 0;
			}
			else {
				_playArtist();
			}
		}, 500);
	}
	
	$scope.playArtiist = function(artist) {
		if($scope.eventCurrentTrack && $scope.eventCurrentTrack.artist == artist) {
			audio.isPause() ? audio.play() : audio.pause();
			
			$scope.eventPlayIsPaused = audio.isPause();
		}
		else {
			$scope.eventArtistTracks = false;
			
			$scope.Artist(artist).getTopTracks('eventArtistTracks', 5);
			_playArtist();
		}
	}
	
	$scope.playArtistNext = function() {
		indx = $scope.eventArtistTracks.tracks[eventArtistTrackIndex + 1] ? eventArtistTrackIndex + 1 : 0;
		
		$scope.eventCurrentTrack	= $scope.eventArtistTracks.tracks[indx];
		eventArtistTrackIndex 		= indx;
		audio.set($scope.eventArtistTracks.tracks[indx].url);
		audio.play();
	}
	
	$scope.playArtistPrev = function() {
		indx = $scope.eventArtistTracks.tracks[eventArtistTrackIndex - 1] ? eventArtistTrackIndex - 1 : 4;
		
		$scope.eventCurrentTrack	= $scope.eventArtistTracks.tracks[indx];
		eventArtistTrackIndex 		= indx;
		audio.set($scope.eventArtistTracks.tracks[indx].url);
		audio.play();
	}
	
	$scope.showAboutPage = function() {
		if($scope.modal_content && $scope.modal_content != '') {
			$scope.modal_content = '';
		}
		else {
			$scope.modal_content = 'views/about.html';
		}
	}
	
	// Окно настроек приложения
	$scope.showSettings = function() {
		if($scope.modal_content && $scope.modal_content != '') {
			$scope.modal_content = '';
		}
		else {
			$scope.User('lastfmUser').getLastFmUserInfo();
			$scope.User('vkUser').getVkUserInfo();
			
			$scope.modal_content = 'views/settings.html';
		}
	}
	
	$scope.lastfmAuthClose = function() {
		$scope.modal_content = '';
	}
	
	$scope.logoutLastfm = function() {
		storage.remove(['lastfm_session', 'lastfm_user']);
		$scope.is_lastfm_auth = false;
	}
	
	chrome.app.window.current().onClosed.addListener(function(){
		tracker.sendEvent('Закрытие приложения', 'Закрытие приложения');
	});
});