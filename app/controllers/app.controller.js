function AppController(Config) {
    /**
     * Global app controller
     *
     * @author Alex Hyrenko
     * @email alex.hyrenko@gmail.com
     * @ver 3.0
     */

    this.version = Config.app.version;

    /*Storage.get(['app', 'vk', 'lastFm']).then(function(data) {
        return $q.all([
            VK.init(data.vk, Config.app.itemsInPage.tracks.default * 2, 0),
            LastFM.init(null, '', Config.app.itemsInPage.artists.lib, 0)
        ]);

    }).then(function(result) {
        $scope.tracks = result[0].data.response.tracks.items;
        $scope.artists = result[1].data.artists.artist;

        State.set('loaded');

    }).then(null, function() {
        State.set('auth', 1);
        State.set('loaded');
    });

    $scope.getNext = function() {
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