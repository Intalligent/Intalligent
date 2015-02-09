app.service('adminConfigurationsModel' , function ($http, $q) {
    this.data = null;

    this.getConfigurations = function() {
        var d = $q.defer();

        //showLoader();

        $http({method: 'GET', url: '/api/admin/configurations/get-configurations', params: {}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                this.data = data;
                //hideLoader();
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
                //hideLoader();
            }));

        return d.promise;
    };

    this.saveConfigurations = function(data) {
        $http.post('/api/admin/configurations/save-configurations', data)
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1) window.location.hash = '/admin/configurations';
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    return this;
});
