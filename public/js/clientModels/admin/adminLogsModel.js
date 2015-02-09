app.service('adminLogsModel' , function ($http, $q) {
    this.data = null;

    this.getLogs = function(params) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/admin/logs/find-all', params: params})
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

    return this;
});
