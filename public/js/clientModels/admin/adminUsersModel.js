/**
 * Created with JetBrains WebStorm.
 * User: hermenegildoromero
 * Date: 27/10/13
 * Time: 19:44
 * To change this template use File | Settings | File Templates.
 */

app.service('adminUsersModel' , function ($http, $q) {
    this.data = null;

    this.getUsers = function(params) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/admin/users/find-all', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
                //hideLoader();
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
                //hideLoader();
            }));

        return d.promise;
    };

    this.getUser = function(id) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/admin/users/find-one', params: {id: id}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
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

    this.addUser = function(data) {
        if (data.status) data.status = data.status.value;
        if (data.language) data.language = data.language.value;

        $http.post('/api/admin/users/create', data)
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1) window.location.hash = '/admin/users';
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.editUser = function(data) {
        data.id = data._id;
        if (data.status) data.status = data.status.value;
        if (data.language) data.language = data.language.value;

        $http({method: 'PUT', url: '/api/admin/users/update/'+data.id, params: data})
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1) window.location.hash = '/admin/users';
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.deleteUser = function(id) {
        $http({method: 'DELETE', url: '/api/admin/users/delete/'+id, params: {id: id}})
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: 'success'});
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.setStatus = function(data) {
        $http.post('/api/admin/users/set-status', data)
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: 'success'});
                if (data.result == 1) {
                    $("#"+data.id+"-status-"+data.status).removeClass("ng-hide");
                    $("#"+data.id+"-status-"+((data.status == 0) ? 1 : 0)).addClass("ng-hide");
                }
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.loadLanguages = function() {
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

    this.loadRoles = function() {
        var d = $q.defer();

        $http.get('/api/admin/roles/find-all')
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                //hideLoader();
            }))
            .error(angular.bind(this, function (data) {
                //hideLoader();
            }));
        return d.promise;
    };

    this.loadFilters = function() {
        var d = $q.defer();

        $http.get('/api/admin/configurations/find-user-filters')
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                //hideLoader();
            }))
            .error(angular.bind(this, function (data) {
                //hideLoader();
            }));
        return d.promise;
    };


    this.changeUser = function($window, username) {
        var d = $q.defer();

        $http.post('/api/login?s=change-user', {username: username})
            .success(angular.bind(this, function (data) {
                $window.location.href="/home";
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));

        return d.promise;
    };

    return this;
});
