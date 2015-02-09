app.service('ActionCategoriesModel' , function ($http, $q) {
    this.data = null;

    this.getActionCategories_documents = function(params) {

    

        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/ActionCategories/find-all', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getActionCategories = function() {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/ActionCategories/find-all', params: {sort: 'actionCategory'}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getActionCategories_document = function($scope, id) {

    

        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/ActionCategories/find-one', params: {id: id}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                $scope._ActionCategories = data.item;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.addActionCategories = function($scope, ActionCategories) {

    

        $http.post('/api/custom/ActionCategories/create', ActionCategories)
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

    this.editActionCategories = function($scope, ActionCategories) {

    

        ActionCategories.id = ActionCategories._id;

        $http.post('/api/custom/ActionCategories/update/'+ActionCategories.id, ActionCategories)
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1)
                {
                    for (i = 0; i<this.data.items.length; i++) {
                        if (this.data.items[i]._id == ActionCategories._id) {
                            this.data.items[i] = ActionCategories;
                        }
                    }
                $scope.cancel();
                }
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.deleteActionCategories = function($scope, id) {

    


        $http({method: 'DELETE', url: '/api/custom/ActionCategories/delete/'+id, params: {id: id}})
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
