chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
	id: 'parent',
	"resizable": false,
	'bounds': {
		'width'		: 1200,
		'height'	: 950
	},
	frame		: 'none',
	transparentBackground: true
  });
});