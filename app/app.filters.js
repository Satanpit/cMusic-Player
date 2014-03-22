Player.filter('sec2min', function(){
	return function(seconds){		
		var hours 	= parseInt(seconds / 3600, 10) % 24,
            minutes = parseInt(seconds / 60, 10) % 60,
            secs 	= parseInt(seconds % 60, 10),
            result,
            fragment = (minutes < 10 ? '0' + minutes : minutes) + ':' + (secs  < 10 ? '0' + secs : secs);
        if (hours > 0) {
          result = (hours < 10 ? '0' + hours : hours) + ':' + fragment;
        } else {
          result = fragment;
        }
        return result;
	}
});

Player.filter('target', function() {
	return function(html) {
		html = angular.element(html);
		html.find('a').attr('target', '_blank');
		
		return html[0];
	}
});