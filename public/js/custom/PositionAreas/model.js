app.service('PositionAreasModel' , function ($http, $q) {
    this.data = null;

    this.getPositionAreas_documents = function(params) {

    

        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/PositionAreas/find-all', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getPositionAreas_document = function($scope, id) {

    

        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/PositionAreas/find-one', params: {id: id}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                $scope._PositionAreas = data.item;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.addPositionAreas = function($scope, PositionAreas) {

    

        $http.post('/api/custom/PositionAreas/create', PositionAreas)
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1) {
                    this.data.items.push(data.item);
                }

                $scope.cancel();

            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.editPositionAreas = function($scope, PositionAreas) {

    

        PositionAreas.id = PositionAreas._id;

        $http.post('/api/custom/PositionAreas/update/'+PositionAreas.id, PositionAreas)
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1)
                {
                    for (i = 0; i<this.data.items.length; i++) {
                        if (this.data.items[i]._id == PositionAreas._id) {
                            this.data.items[i] = PositionAreas;
                        }
                    }
                $scope.cancel();
                }
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.deletePositionAreas = function($scope, id) {

    


        $http({method: 'DELETE', url: '/api/custom/PositionAreas/delete/'+id, params: {id: id}})
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
