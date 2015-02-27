chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
	id: 'parent',
	'bounds': {
		'width'		: 1200,
		'height'	: 800
	},
	frame		: 'none'
  });
});