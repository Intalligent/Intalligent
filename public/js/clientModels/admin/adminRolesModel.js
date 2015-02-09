app.service('adminRolesModel' , function ($http, $q) {
    this.data = null;

    this.getRoles = function(params) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/admin/roles/find-all', params: params})
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

    this.getRole = function(id) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/admin/roles/find-one', params: {id: id}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                this.data = data.item;
                //hideLoader();
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
                //hideLoader();
            }));

        return d.promise;
    };

    return this;
});
