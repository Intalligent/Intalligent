app.service('PositionCategoriesModel' , function ($http, $q) {
    this.data = null;

    this.getPositionCategories_documents = function(params) {

    

        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/PositionCategories/find-all', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getPositionCategories_document = function($scope, id) {

    

        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/PositionCategories/find-one', params: {id: id}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                $scope._PositionCategories = data.item;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.addPositionCategories = function($scope, PositionCategories) {

    

        $http.post('/api/custom/PositionCategories/create', PositionCategories)
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

    this.editPositionCategories = function($scope, PositionCategories) {

    

        PositionCategories.id = PositionCategories._id;

        $http.post('/api/custom/PositionCategories/update/'+PositionCategories.id, PositionCategories)
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1)
                {
                    for (i = 0; i<this.data.items.length; i++) {
                        if (this.data.items[i]._id == PositionCategories._id) {
                            this.data.items[i] = PositionCategories;
                        }
                    }
                $scope.cancel();
                }
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.deletePositionCategories = function($scope, id) {

    


        $http({method: 'DELETE', url: '/api/custom/PositionCategories/delete/'+id, params: {id: id}})
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
