Player.constant('Config', {
    api: {
        vk: {
            url: 'https://api.vk.com/method/',
            ver: '5.25',
            method: 'GET',
            async: true,
            requestLimit: 3
        },
        lastFm: {
            url: 'https://ws.audioscrobbler.com/2.0/',
            key: '4d1b3ad77378fa5c95fe3483b3caf97b',
            secret: 'b19a84c20f77a31b7113f128380d66d6',
            format: 'json'
        }
    },

    oauth: {
        interactive: true,
        vk: {
            url: 'https://oauth.vk.com/authorize',
            params: {
                client_id		: 3989655,
                scope			: 'audio,status,offline',
                redirect_uri	: 'https://' + chrome.runtime.id + '.chromiumapp.org/cb',
                v				: '5.25',
                display			: "page",
                response_type	: "token"
            }
        }
    },

    analytics: {
        service: 'cMusic Player',
        tracker: 'UA-47794396-1'
    },

    user: {

    },

    lang: {
        default: 'ru',
        prefix: 'lang/',
        suffix: '.json',
        support: ['ru', 'en']
    },

    app: {
        volume: 0.8,
        imageLocalCache: true,
        syncGoogleDrive: true,
        notifications: {
            enable: true,
            type: 'basic'
        },
        autocomplete: {
            enable: true,
            artists: 5,
            tracks: 5
        },
        itemsInPage: {
            tracks: {
                default: 50,
                top: 10,
                user: 100
            },
            artists: {
                lib: 36,
                similar: {
                    top: 4,
                    all: 36
                }
            },
            albums: {
                top: 3,
                all: 50
            },
            events: {
                artist: 50,
                user: 30
            }
        }
    }
});