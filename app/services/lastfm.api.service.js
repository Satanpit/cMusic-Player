function LastFmService($http, $q, Utils, Config) {

    var API = {
        getApiSignature: function(params) {
            return md5(Object.keys(params).sort().reduce(function(tmp, current) {
                tmp.push(current + params[current]);
                return tmp;
            }, []).join('') + Config.api.lastFm.secret);
        },

        get: function(method, params, data) {
            var deferred = $q.defer();

            params.method = method;
            params.api_key = Config.api.lastFm.key;
            params.lang = 'ru';
            params.api_sig = API.getApiSignature(Utils.assign(params, data));
            params.format = Config.api.lastFm.format;

            $http({
                method  : Config.api.lastFm.method,
                url	    : Config.api.lastFm.url + Utils.serialize(params),
                async	: Config.api.lastFm.async,
                data: (data && typeof data === 'object') ? Utils.serialize(data, true) : '',
                headers	: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(response) {
                if (response.error) {
                    deferred.reject(response, false);
                }
                else {
                    deferred.resolve(response);
                }
            }).error(function(error) {
                deferred.reject(error, true);
            });

            return deferred.promise;
        }
    };

    return {
        init: function(user, period, limit, page) {
            if(!user || !user.name || !user.session) {
                return this.chart.getTopArtists(page, limit);
            }

            API.user = {
                name: user.name,
                session: user.session
            };

            return this.user.getTopArtists(period, limit, page);
        },

        user: {
            auth: function(login, pass) {
                return API.get('auth.getMobileSession', {}, {
                    username: login,
                    password: pass
                });
            },

            getTopArtists: function(period, limit, page) {
                return API.get('user.getTopArtists', {
                    user		: API.user.name,
                    period		: period,
                    limit		: limit,
                    page		: page
                });
            }
        },

        chart: {
            getTopArtists: function(page, limit) {
                return API.get('chart.getTopArtists', {
                    page	: page,
                    limit	: limit
                });
            }
        }
    }
}