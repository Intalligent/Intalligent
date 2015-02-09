app.service('adminCommunicationsModel' , function ($http, $q) {
    this.data = null;

    this.getCommunications = function(params) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/admin/communications/find-all', params: params})
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

    this.getCommunication = function(id) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/admin/communications/find-one', params: {id: id}})
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

    this.setStatus = function(data) {
        $http.post('/api/admin/communications/set-status', data)
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

    return this;
});
