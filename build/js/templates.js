angular.module("templates").run(["$templateCache", function($templateCache) {$templateCache.put("index.html","<!DOCTYPE html>\n<html lang=\"en\" data-ng-csp>\n<head>\n	<title>cMusic Player</title>\n    <meta charset=\"utf-8\">\n\n    <!-- inject:js -->\n    <!-- endinject -->\n\n    <!-- inject:css -->\n    <!-- endinject -->\n</head>\n<body class=\"app\" data-ng-app=\"cMusic\" data-ng-controller=\"AppController as app\">\n    <section data-ng-cloak>\n        <section data-ng-controller=\"AuthController as auth\" data-ng-init=\"auth.checkUserAuth()\">\n            <ng-include src=\"\'templates/auth/authView.html\'\" class=\"app-auth\" data-ng-if=\"auth.showAuthForm\"></ng-include>\n        </section>\n\n        <ng-include src=\"\'templates/main/headerView.html\'\"></ng-include>\n        <ng-include src=\"\'templates/main/menuView.html\'\"></ng-include>\n\n        <ui-playlist></ui-playlist>\n\n        <ng-include src=\"\'templates/main/contentView.html\'\"></ng-include>\n    </section>\n\n    <ui-loader whait=\"state.loaded\"></ui-loader>\n</body>\n</html>\n");
$templateCache.put("auth/authCompleteView.html","<section class=\"auth-complete\">\n    <section class=\"complete-header\">\n        <div class=\"cols\">\n            <div class=\"left\">\n                <ui-image data-image-src=\"{{auth.userData.photo_200}}\"></ui-image>\n            </div>\n            <div class=\"right\">\n                <h1>{{ \'login.complete.title\'|translate }}, {{ auth.userData.first_name }}</h1>\n                <div translate=\"login.complete.description\"></div>\n            </div>\n        </div>\n    </section>\n    <section class=\"complete-content\">\n        <div class=\"cols\">\n            <div class=\"left\">\n                <div class=\"checkbox\">\n                    <input type=\"checkbox\" id=\"settingsNotification\" data-ng-model=\"auth.settings.notification\" />\n                    <label data-checked=\"{{ \'settings.notification.yes\'|translate }}\" data-unchecked=\"{{ \'settings.notification.no\'|translate }}\" for=\"settingsNotification\"></label>\n                </div>\n                <div class=\"checkbox\">\n                    <input type=\"checkbox\" id=\"settingsScrobble\" data-ng-model=\"auth.settings.scrobble\" />\n                    <label data-checked=\"{{ \'settings.scrobble.yes\'|translate }}\" data-unchecked=\"{{ \'settings.scrobble.no\'|translate }}\" for=\"settingsScrobble\"></label>\n                </div>\n                <div class=\"checkbox\">\n                    <input type=\"checkbox\" id=\"settingsTranslate\" data-ng-model=\"auth.settings.translate\" />\n                    <label data-checked=\"{{ \'settings.translate.yes\'|translate }}\" data-unchecked=\"{{ \'settings.translate.no\'|translate }}\" for=\"settingsTranslate\"></label>\n                </div>\n                <div class=\"checkbox select\">\n                    <input data-ng-true-value=\"ru\" data-ng-false-value=\"en\" type=\"checkbox\" id=\"settingsLang\" data-ng-model=\"auth.settings.lang\" />\n                    <label data-checked=\"{{ \'settings.lang.ru\'|translate }}\" data-unchecked=\"{{ \'settings.lang.en\'|translate }}\" for=\"settingsLang\"></label>\n                </div>\n            </div>\n            <div class=\"right\">\n                <p>{{ \'settings.notification.name\'|translate }}</p>\n                <p>{{ \'settings.scrobble.name\'|translate }}</p>\n                <p>{{ \'settings.translate.name\'|translate }}</p>\n                <p>{{ \'settings.lang.name\'|translate }}</p>\n            </div>\n        </div>\n    </section>\n    <section class=\"complete-footer\">\n        <a data-ng-click=\"auth.saveSettings()\" class=\"btn green\">{{ \'login.complete.go\'|translate }}</a>\n        <a href=\"http://vk.com/cmusicplayer\" target=\"_blank\" style=\"margin-left: 40px\" class=\"link\">{{ \'login.complete.appGroup\'|translate }}</a>\n    </section>\n</section>");
$templateCache.put("auth/authLastFmView.html","<section class=\"auth-lastfm\">\n    <header>\n        <img src=\"img/lastfm-logo-120.png\"/>\n        {{ \'login.lastFm.title\'|translate }}\n    </header>\n    <p translate=\"login.lastFm.description\"></p>\n\n    <section class=\"cols\">\n        <section class=\"left\">\n            <h3 translate=\"login.lastFm.form.title\"></h3>\n\n            <input name=\"login\" data-ng-model=\"auth.lastFmLogin\" placeholder=\"{{ \'login.lastFm.form.login\'|translate }}\" type=\"text\">\n            <input name=\"login\" data-ng-model=\"auth.lastFmPass\" placeholder=\"{{ \'login.lastFm.form.pass\'|translate }}\" type=\"password\">\n\n            <div class=\"form-footer\">\n                <a data-ng-click=\"auth.loginLastFm()\" translate=\"login.lastFm.form.submit\" class=\"btn login\"></a>\n                <a href=\"http://www.lastfm.ru/join\" target=\"_blank\" translate=\"login.lastFm.registration\" class=\"link\"></a>\n                <a href=\"http://last.fm\" target=\"_blank\" class=\"link\">Last.FM</a>\n            </div>\n        </section>\n        <section class=\"right\">\n            <h3 translate=\"login.lastFm.scrobble.title\"></h3>\n\n            {{ \'login.lastFm.scrobble.description\'|translate }}\n\n            <a data-ng-click=\"auth.lastFmSkip()\" class=\"btn light\" translate=\"login.lastFm.skip\"></a>\n        </section>\n    </section>\n</section>");
$templateCache.put("auth/authView.html","<header class=\"app-header-window-controls\" data-ng-controller=\"WindowController as window\">\n    <a data-ng-click=\"window.minimize()\" class=\"window-minimize\"></a>\n    <a data-ng-click=\"window.fullScreen()\" class=\"window-full-screen\"></a>\n    <a data-ng-click=\"window.close()\" class=\"window-close\"></a>\n</header>\n<section class=\"app-auth-content\" data-ng-class=\"{hide: auth.showAuthForm == \'complete\'}\">\n    <section class=\"auth-item\" data-ng-if=\"auth.showAuthForm == \'vk\'\" data-ng-include=\"\'templates/auth/authVkView.html\'\"></section>\n    <section class=\"auth-item\" data-ng-if=\"auth.showAuthForm == \'lastFm\'\" data-ng-include=\"\'templates/auth/authLastFmView.html\'\"></section>\n    <section class=\"auth-item\" data-ng-if=\"auth.showAuthForm == \'settings\'\" data-ng-include=\"\'templates/auth/authCompleteView.html\'\"></section>\n</section>");
$templateCache.put("auth/authVkView.html","<section class=\"auth-vk\">\n    <header>\n        <img src=\"img/app-logo-120.png\"/>\n        cMusicPlayer\n    </header>\n    <p translate=\"login.vk.description\"></p>\n    <h3 translate=\"login.vk.listTitle\"></h3>\n\n    <ul class=\"list\">\n        <li translate=\"login.vk.list.0\"></li>\n        <li translate=\"login.vk.list.1\"></li>\n        <li translate=\"login.vk.list.2\"></li>\n        <li translate=\"login.vk.list.3\"></li>\n        <li translate=\"login.vk.list.4\"></li>\n        <li translate=\"login.vk.list.5\"></li>\n    </ul>\n    <div translate=\"login.vk.info\" class=\"info-box\"></div>\n    <footer>\n        <a data-ng-click=\"auth.showIdentityWindow()\" class=\"btn login\">{{ \'login.vk.enter\'|translate }}</a>\n        <div class=\"right\">\n            <div>{{ \'app.version\'|translate }} {{ app.version }}</div>\n            {{ \'app.developer\'|translate }}\n        </div>\n    </footer>\n</section>");
$templateCache.put("artist/artistHeaderView.html","<header class=\"artist-header\">\n    <ui-image data-src=\"http://userserve-ak.last.fm/serve/64s/8717489.jpg\"></ui-image>\n    <div class=\"name\">Five Finger Death Punch</div>\n\n    <ul class=\"tags\">\n        <li><a>metalcore</a></li>\n        <li><a>groove metal</a></li>\n        <li><a>metal</a></li>\n        <li><a>thrash metal</a></li>\n        <li><a>hardcore</a></li>\n    </ul>\n\n    <menu class=\"tabs\">\n        <li class=\"active\">\n            <a>Information</a>\n        </li>\n        <li>\n            <a>Tracks</a>\n        </li>\n        <li>\n            <a>Similar artists</a>\n        </li>\n        <li>\n            <a>Discography</a>\n        </li>\n        <li>\n            <a>Events</a>\n        </li>\n    </menu>\n</header>");
$templateCache.put("artist/artistInfoView.html","<section class=\"artist-info\">\n    <div class=\"bio\">\n        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum commodo mauris ut ullamcorper. Vestibulum vel dui libero. Nam id dolor nec leo placerat blandit eu pulvinar neque. Suspendisse maximus, leo ut tristique sodales, mauris mauris auctor nunc, eget condimentum sem odio eu nibh. Praesent rutrum elit dui. Nullam venenatis nulla nec purus tempus, a feugiat mi rhoncus. Duis sed augue eu sem dignissim euismod. Curabitur rhoncus, risus vel mollis congue, turpis nulla ornare lectus, nec malesuada nulla quam id metus. Etiam tempus fermentum sodales. Sed a dui dictum, aliquet diam sed, interdum augue. In lacus nisl, congue sed nisi sit amet, varius finibus lacus. Aliquam et blandit nibh, vitae bibendum est.\n    </div>\n    <div class=\"similar\">\n        <h2>Top similar artists</h2>\n\n        <ul class=\"artists-list\">\n            <li>\n                <a class=\"similar-1\">\n                    <ui-image src=\"http://userserve-ak.last.fm/serve/126s/47870299.jpg\"></ui-image>\n                    Stone Sour\n                </a>\n            </li>\n            <li>\n                <a class=\"similar-1\">\n                    <ui-image src=\"http://userserve-ak.last.fm/serve/126s/278081.jpg\"></ui-image>\n                    Disturbed\n                </a>\n            </li>\n            <li>\n                <a class=\"similar-2\">\n                    <ui-image src=\"http://userserve-ak.last.fm/serve/126s/177714.jpg\"></ui-image>\n                    All That Remains\n                </a>\n            </li>\n            <li>\n                <a>\n                    <ui-image src=\"http://userserve-ak.last.fm/serve/126s/46756175.jpg\"></ui-image>\n                    Avenged Sevenfold\n                </a>\n            </li>\n            <li>\n                <a class=\"similar-1\">\n                    <ui-image src=\"http://userserve-ak.last.fm/serve/126s/47870299.jpg\"></ui-image>\n                    Stone Sour\n                </a>\n            </li>\n            <li>\n                <a class=\"similar-1\">\n                    <ui-image src=\"http://userserve-ak.last.fm/serve/126s/278081.jpg\"></ui-image>\n                    Disturbed\n                </a>\n            </li>\n            <li></li><li></li> <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>\n        </ul>\n    </div>\n    <div class=\"albums\">\n        <h2>The best albums</h2>\n\n        <ul class=\"albums-list\">\n            <li>\n                <a>\n                    <ui-image src=\"http://userserve-ak.last.fm/serve/300x300/91064849.png\"></ui-image>\n                    War Is The Answer\n                    <div class=\"year\">2013</div>\n                </a>\n            </li>\n            <li>\n                <a>\n                    <ui-image src=\"http://userserve-ak.last.fm/serve/300x300/69325074.png\"></ui-image>\n                    American Capitalist\n                    <div class=\"year\">2011</div>\n                </a>\n            </li>\n            <li>\n                <a>\n                    <ui-image src=\"http://userserve-ak.last.fm/serve/300x300/91064027.png\"></ui-image>\n                    The Way Of The Fist\n                    <div class=\"year\">2008</div>\n                </a>\n            </li>\n            <li>\n                <a>\n                    <ui-image src=\"http://userserve-ak.last.fm/serve/300x300/91064849.png\"></ui-image>\n                    War Is The Answer\n                    <div class=\"year\">2013</div>\n                </a>\n            </li>\n\n        </ul>\n    </div>\n</section>");
$templateCache.put("common/authPageLastFmView.html","<div class=\"modal-page app-login-lastFm\" data-ng-class=\"{show: state.authFormLastFm}\">\n    <!--<section class=\"app-header-window-controls\" data-ng-controller=\"WindowCtrl\">\n        <a data-ng-click=\"minimize()\" class=\"window-minimize\"></a>\n        <a data-ng-click=\"fullScreen()\" class=\"window-full-screen\"></a>\n        <a data-ng-click=\"close()\" class=\"window-close\"></a>\n    </section>-->\n    <div class=\"modal-content\">\n        <header>\n            <img src=\"img/lastfm-logo-120.png\"/>\n            {{ \'login.lastFm.title\'|translate }}\n        </header>\n        <p translate=\"login.lastFm.description\"></p>\n\n        <section class=\"cols\">\n            <section class=\"left\">\n                <h3 translate=\"login.lastFm.form.title\"></h3>\n\n                <input name=\"login\" data-ng-model=\"lastFmLogin\" placeholder=\"{{ \'login.lastFm.form.login\'|translate }}\" type=\"text\">\n                <input name=\"login\" data-ng-model=\"lastFmPass\" placeholder=\"{{ \'login.lastFm.form.pass\'|translate }}\" type=\"password\">\n\n                <div class=\"form-footer\">\n                    <a translate=\"login.lastFm.form.submit\" class=\"btn login\"></a>\n                    <a href=\"http://www.lastfm.ru/join\" target=\"_blank\" translate=\"login.lastFm.registration\" class=\"link\"></a>\n                    <a href=\"http://last.fm\" target=\"_blank\" class=\"link\">Last.FM</a>\n                </div>\n            </section>\n            <section class=\"right\">\n                <h3 translate=\"login.lastFm.scrobble.title\"></h3>\n\n                {{ \'login.lastFm.scrobble.description\'|translate }}\n\n                <a class=\"btn light\" translate=\"login.lastFm.skip\"></a>\n            </section>\n        </section>\n    </div>\n</div>");
$templateCache.put("common/authPageVkView.html","<div class=\"modal-page app-login-vk\" data-ng-class=\"{show: state.authFormVK, hide: state.authFormLastFm}\">\n    <section class=\"app-header-window-controls\" data-ng-controller=\"WindowCtrl\">\n        <a data-ng-click=\"minimize()\" class=\"window-minimize\"></a>\n        <a data-ng-click=\"fullScreen()\" class=\"window-full-screen\"></a>\n        <a data-ng-click=\"close()\" class=\"window-close\"></a>\n    </section>\n    <div class=\"modal-content\">\n        <header>\n            <img src=\"img/app-logo-120.png\"/>\n            cMusicPlayer\n        </header>\n        <p translate=\"login.vk.description\"></p>\n        <h3 translate=\"login.vk.listTitle\"></h3>\n\n        <ul class=\"list\">\n            <li translate=\"login.vk.list.0\"></li>\n            <li translate=\"login.vk.list.1\"></li>\n            <li translate=\"login.vk.list.2\"></li>\n            <li translate=\"login.vk.list.3\"></li>\n            <li translate=\"login.vk.list.4\"></li>\n            <li translate=\"login.vk.list.5\"></li>\n        </ul>\n        <div translate=\"login.vk.info\" class=\"info-box\"></div>\n        <footer>\n            <a translate=\"login.vk.enter\" data-ng-click=\"getAuthFormVK()\" class=\"btn login\"></a>\n            <div class=\"right\">\n                <div>{{ \'app.version\'|translate }} {{ version }}</div>\n                {{ \'app.developer\'|translate }}\n            </div>\n        </footer>\n    </div>\n</div>");
$templateCache.put("events/eventsListView.html","<section data-ng-class=\"{show: app.events.length}\" data-ui-scrollbar data-ui-scrollbar-shadow-box=\".artist-header\" class=\"events\">\n    <ul class=\"events-list\" data-click-delegate data-events-watch>\n        <li data-ng-repeat=\"item in ::app.events\">\n            <div class=\"event-date\" data-month=\"{{ item.date.month }}\">\n                {{ item.date.date }}\n            </div>\n            <div class=\"event-title\">\n                <a href=\"#\">{{ item.title }}</a><br />\n                <ul>\n                    <li data-ng-repeat=\"artist in item.artists.artist\"> {{ artist }}</li>\n                </ul>\n            </div>\n            <div class=\"event-venue\">\n                {{ item.venue.name}}, {{ item.venue.location.street }}<br>\n                {{ item.venue.location.city }}\n            </div>\n            <ul class=\"event-options\">\n                <li data-click data-click-name=\"menu\" class=\"show\">\n                    <div></div>\n                </li>\n                <li data-click=\"app.setStatus(2)\" class=\"go\" data-title=\"I go it\"></li>\n                <li data-click=\"app.setStatus(1)\" class=\"possibly\"></li>\n                <li data-click data-click-name=\"more\" class=\"more\"></li>\n            </ul>\n        </li>\n    </ul>\n</section>");
$templateCache.put("main/contentView.html","<section class=\"app-content\">\n    <ng-include src=\"\'templates/artist/artistHeaderView.html\'\"></ng-include>\n    <ng-include src=\"\'templates/events/eventsListView.html\'\"></ng-include>\n</section>");
$templateCache.put("main/headerView.html","<header class=\"app-header\">\n    <section class=\"app-header-controls\">\n        <div class=\"play-controls\">\n            <a class=\"prev\"></a>\n            <a class=\"play\"></a>\n            <a class=\"next\"></a>\n\n            <a class=\"repeat active\"></a>\n            <a class=\"shuffle\"></a>\n        </div>\n\n        <div class=\"volume-controls\">\n            <input data-ng-model=\"volume\" type=\"range\" min=\"0\" max=\"1\" step=\"0.01\">\n        </div>\n\n        <div class=\"public-controls\">\n            <a class=\"scrobble\"></a>\n            <a class=\"translate\"></a>\n        </div>\n    </section>\n    <section class=\"app-header-track-info\">\n        <div class=\"track-bitrate\">320 kbit/s</div>\n\n        <div class=\"track-title\">\n            <strong>Five Finger Death Punch</strong> - <span>Cradle to the Grave</span>\n        </div>\n        <div class=\"track-progress-time\">00:53</div>\n        <div class=\"track-progress\">\n            <div style=\"width: 70%\" class=\"buffered\"></div>\n            <div style=\"width: 30%\" class=\"played\"></div>\n        </div>\n    </section>\n    <section class=\"app-header-window-controls\" data-ng-controller=\"WindowController as window\">\n        <a data-ng-click=\"window.minimize()\" class=\"window-minimize\"></a>\n        <a data-ng-click=\"window.fullScreen()\" class=\"window-full-screen\"></a>\n        <a data-ng-click=\"window.close()\" class=\"window-close\"></a>\n    </section>\n</header>");
$templateCache.put("main/menuView.html","<section data-ng-class=\"{show: isMenuShow}\" data-ng-controller=\"MenuController as menu\" class=\"app-menu\">\n    <menu>\n        <li>\n            <a data-toggle=\"isMenuShow\">\n                <div class=\"helper\"></div>\n            </a>\n            <div class=\"title\">cMusic</div>\n        </li>\n        <li>\n            <a translate=\"menu.news\" class=\"icon-menu-news\"></a>\n        </li>\n        <li>\n            <a translate=\"menu.search\" class=\"icon-menu-search\"></a>\n        </li>\n        <li>\n            <a translate=\"menu.lib\" class=\"icon-menu-lib\"></a>\n        </li>\n        <li>\n            <a translate=\"menu.recommends\" class=\"icon-menu-recommends\"></a>\n        </li>\n        <li class=\"alarm\">\n            <a translate=\"menu.events\" class=\"icon-menu-events\"></a>\n            <span class=\"count-alarms\">5</span>\n        </li>\n        <li>\n            <a translate=\"menu.about\" class=\"icon-menu-about\"></a>\n        </li>\n        <li>\n            <a translate=\"menu.settings\" class=\"icon-menu-settings\"></a>\n        </li>\n    </menu>\n</section>");
$templateCache.put("main/playlistView.html","<section data-ng-controller=\"PlaylistController as playlist\" class=\"app-playlist\">\n    <div class=\"playlist-options\">\n        <div class=\"search\">\n            <input autocomplete=\"off\" type=\"text\" data-ng-model=\"playlist.search\" placeholder=\"{{ \'playlist.search\'|translate }}\" name=\"q\">\n        </div>\n        <div class=\"playlists\">\n\n        </div>\n    </div>\n    <section data-ui-scrollbar class=\"tracks\">\n        <ul data-playlist=\"general\" class=\"tracks-list\">\n            <li data-ng-repeat=\"track in ::app.tracks\" data-url=\"{{ track.url }}\">\n                <i class=\"icon-play\"></i>\n                <a class=\"artist\">{{ track.artist }}</a> – <span class=\"track\">{{ track.title }}</span>\n                <div class=\"time\">{{ track.time }}</div>\n            </li>\n        </ul>\n    </section>\n</section>");
$templateCache.put("main/slideView.html","<section class=\"app-slide\">\n    <div class=\"app-slide-content\">\n\n    </div>\n</section>");}]);