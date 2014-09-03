Player.constant('Config', {
    api: {
        vk: {
            url: 'https://api.vk.com/method/',
            clientId: 3989655,
            scope: 'audio,status,offline',
            ver: '5.13',
            requestLimit: 3
        },
        lastfm: {
            url: 'https://ws.audioscrobbler.com/2.0/',
            key: '4d1b3ad77378fa5c95fe3483b3caf97b',
            secret: 'b19a84c20f77a31b7113f128380d66d6',
            format: 'json'
        }
    },

    oauth: {
        redirectURL: 'https://' + chrome.runtime.id + '.chromiumapp.org/cb',
        vk: {
            url: 'https://oauth.vk.com/authorize?',
            display: 'page',
            responseType: 'token'
        }
    },

    analytics: {
        service: 'cMusic Player',
        tracker: 'UA-47794396-1'
    },

    user: {
        vkGetUserInfoParams: {
            fields: 'photo_200,city,country',
            nameCase: 'Nom'
        }
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