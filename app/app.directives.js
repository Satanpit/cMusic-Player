Player.directive('autoscrolling', function(){
	return {
		restrict: 'A',
		
		link: function(scope, elem, attr) {
			var raw = elem[0];
			
			scope.$watch('currentTrack', function() {
				if(attr.autoscrolling == 'true') {
					_parent			= elem.parent().parent()
					_parentScroll	= _parent[0].scrollTop;
					_parentHeight 	= _parent[0].clientHeight;
					_elemOffsetTop	= raw.offsetTop;
					_elemHeight		= raw.clientHeight;
					
					if((_elemOffsetTop + _elemHeight) >= ((_parentHeight / 2) + _parentScroll)) {
						_parent.animate({
							scrollTop: _elemOffsetTop - ((_parentHeight / 2) - _elemHeight)
						});
					}
					else if((_elemOffsetTop + _elemHeight) < (_elemOffsetTop + _parentScroll + (_elemHeight / 2))) {
						_parent.animate({
							scrollTop: _elemOffsetTop - ((_parentHeight / 2) - _elemHeight)
						});
					}
				}
			})
		}
	}
});

Player.directive('image', function($rootScope, storage, utils){
	return {
		restrict:'A',
		
		link: function(scope, elem, attr) {
			attr.$observe('image', function() {
				if(attr.image) {
					utils.getLocalImageURL(attr.image, function(url) {
						elem[0].src = url;
					});
				}
				else {
					elem[0].src = 'icons/no-image.png'
				}
			});
		}
	}
});

Player.directive('scroll', function(){
	return {
		restrict: 'A',
		link: function(scope, elm, attr) {
			var raw = elm[0];
			elm.bind('scroll', function() {
				if (raw.scrollTop + raw.offsetHeight >= (raw.scrollHeight - (raw.scrollTop / 4))) {
					scope.$apply(attr.scroll);
				 }
			});
		}
	};
});

zindex = 2;
Player.directive('zindex', function() {
	return {
		restrict: 'A',
		link: function(scope, elm, attr) {
			elm.css('z-index', ++zindex);
		}
	};
});