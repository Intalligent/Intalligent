app.service('usersModel' , function ($http, $q) {
    this.data = null;

    this.getUser = function(id) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/users/get-user', params: {username: id}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    //noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                this.data = data.user;
                //hideLoader();
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
                //hideLoader();
            }));

        return d.promise;
    };

    this.getProfile = function() {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/users/get-profile'})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                this.data = data.profile;
                //hideLoader();
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
                //hideLoader();
            }));

        return d.promise;
    };

    this.createUser = function(data) {
        var d = $q.defer();

        data.id = data._id;

        $http.post('/api/users/create-user', data)
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));

        return d.promise;
    };

    this.editUser = function(data) {
        var d = $q.defer();

        data.id = data._id;

        $http.post('/api/users/update-user/'+data.id, data)
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));

        return d.promise;
    };

    this.editProfile = function(data) {
        data.id = data._id;

        $http({method: 'PUT', url: '/api/users/update-profile/'+data.id, params: data})
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1) window.location.hash = '/home';
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.loadLanguages = function(id) {
        var d = $q.defer();

        $http.get('/api/admin/languages/find-all')
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                //hideLoader();
            }))
            .error(angular.bind(this, function (data) {
                //hideLoader();
            }));
        return d.promise;
    };

    return this;
});
