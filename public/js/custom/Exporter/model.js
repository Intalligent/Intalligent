app.service('ExporterModel', function ($http, $q, $window) {
    this.data = null;


    this.export = function(params) {
        $window.open('/api/custom/Exporter/export?'+$.param(params));

        /*$http({method: 'GET', url: '/api/custom/Exporter/export', params: {}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});


            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            })); */
    };


    this.getExporter_documents = function(params) {

    

        var d = $q.defer();
        //showExporter();

        $http({method: 'GET', url: '/api/custom/Exporter/find-all', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getExporter_document = function($scope, id) {

    

        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/Exporter/find-one', params: {id: id}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                $scope._Exporter = data.item;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.addExporter = function($scope, Exporter) {
        var d = $q.defer();
    

        $http.post('/api/custom/Exporter/create', Exporter)
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1) {
                    this.data.items.push(data.item);
                }



            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
        return d.promise;
    };

    this.editExporter = function($scope, Exporter) {
        var d = $q.defer();
    

        Exporter.id = Exporter._id;
        $http.post('/api/custom/Exporter/update/'+Exporter.id, Exporter)
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1)
                {
                    for (i = 0; i<this.data.items.length; i++) {
                        if (this.data.items[i]._id == Exporter._id) {
                            this.data.items[i] = Exporter;
                        }
                    }

                }
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
        return d.promise;
    };

    this.deleteExporter = function($scope, id) {



        $http.post('/api/custom/Exporter/delete/'+id, {id: id})
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1) $('#'+$scope.delete_id).remove();

            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    return this;
});
