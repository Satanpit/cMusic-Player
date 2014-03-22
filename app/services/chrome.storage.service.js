Player.factory('storage', function(){
	return {
		get: function(name, callback) {
			chrome.storage.sync.get(name, function(obj) {
				callback(obj);
			});
		},
		
		set: function(obj){
			chrome.storage.sync.set(obj);
		},
		
		remove: function(keys, callback) {
			chrome.storage.sync.remove(keys, callback);
		},
		
		local: {
			set: function(obj, callback) {
				chrome.storage.local.set(obj, callback);
			},
			
			get: function(keys, callback) {
				chrome.storage.local.get(keys, callback);
			},
			
			clear: function(callback) {
				chrome.storage.local.clear(callback);
			}
		}
	}
});