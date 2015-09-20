Player.factory('utils', function(){
	
	loadImage = function(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';
		xhr.onload = function() {
			callback(URL.createObjectURL(xhr.response), xhr.response);
		};
		xhr.open('GET', url, true);
		xhr.send();
	};
	
	saveLocalImage = function(fileName, data, callback) {
		window.webkitRequestFileSystem(window.PERSISTENT, 0, function(fs) {
			fs.root.getFile(fileName, {
				create: true
			}, function(fileEntry) {
				fileEntry.createWriter(function(fileWriter) {
					fileWriter.onwriteend = function(e) {
						callback();
					};
					
					fileWriter.onerror = function(e) {
						callback()
					};
					
					fileWriter.write(data);
				});
			});
		});
	};
	
	getLocalImage = function(name, callback) {
		window.webkitRequestFileSystem(window.PERSISTENT, 0, function(fs) {
			fs.root.getFile(name, {}, function(fileEntery) {
				callback(fileEntery.toURL());
			}, function(error) {
				callback();
			});
		});
	}
	
	return {
		getLocalImageURL: function(url, callback) {
			if(url) {
				getLocalImage(hex_md5(url), function(image) {
					if(image) {
						callback(image);
					}
					else {
						loadImage(url.replace('/126/', '/126s/').replace('/64/', '/64s/'), function(image, blob) {
							saveLocalImage(hex_md5(url), blob, function(){});
							
							callback(image);
						});
					}
				});
			}
			else {
				callback(false);
			}
		}
	}
});