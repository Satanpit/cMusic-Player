function AppController(VK, LastFM, State, Storage, Config, $q, $filter) {
    /**
     * Global app controller
     *
     * @author Alex Hyrenko
     * @email alex.hyrenko@gmail.com
     * @ver 3.0
     */

    this.version = Config.app.version;

    var items = [];
    for (var i = 0; i < 50; i++) {
        items.push('Test ' + i);
    }

    this.items = items;

    this.setStatus = function(status) {
        this.items[0] = items[0] + items[1] + status;
    }.bind(this);

    /*Object.observe(this.items, function(changes) {
        changes.forEach(function(item) {
            $('.event-title ul > li').eq(0).text(item.object[item.name]);
        });
    });*/


    Storage.get(['app', 'vk', 'lastFm']).then(function(data) {
        return $q.all([
            VK.init(data.vk, Config.app.itemsInPage.tracks.default * 2, 0),
            LastFM.init(data.lastFm, '', Config.app.itemsInPage.artists.lib, 0)
        ]);

    }).then(function(result) {
        this.tracks = result[0].tracks.items;

        LastFM.geo.getEvents(300, 0).then(function(result) {
            result.events.event.forEach(function(item) {
                var date = new Date(item.startDate);

                item.date = {
                    date: date.getDate(),
                    month: $filter('translate')('date.shortMonth.' + date.getMonth())
                };

                if (!angular.isArray(item.artists.artist)) {
                    item.artists.artist = new Array(item.artists.artist);
                }
            });

            console.log(result.events.event);

            this.events = result.events.event;
        }.bind(this));

        State.set('loaded');

    }.bind(this)).then(null, function(result) {
        console.log(result);
        State.set('auth', 1);
        State.set('loaded');
    });

   /* $scope.getNext = function() {
        State.set('auth', 3);
    };

    $scope.getAuthFormVK = function() {
        State.set('auth', 2);

        return;

        VK.auth().then(function(data) {
            return Storage.set({
                vk: {
                    userId: data.userId,
                    token: data.token
                }
            });

        }).then(function(data) {
            return VK.init(data.vk, Config.app.itemsInPage.tracks.default * 2, 0);

        }).then(function(result) {
            $scope.tracks = result.data.response.tracks.items;
            State.remove('authFormVK');
        });
    };

    $scope.LastFmAuth = function(login, pass) {
        LastFM.user.auth(login, pass).then(function(response) {
            return LastFM.init({
                name: response.data.session.name,
                session: response.data.session.key
            }, '', Config.app.itemsInPage.artists.lib, 0);
        }).then(null, function(error) {
            console.log(error);
        });
    };*/
}