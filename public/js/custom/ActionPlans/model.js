app.service('ActionPlansModel' , function ($http, $q) {
    this.data = null;

    this.getActionPlans_documents = function(params) {

    

        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/ActionPlans/find-all', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getEmployeeActionPlans = function(employeeID, orderBy) {
        var d = $q.defer();

        var params = {employeeID: employeeID};

        if (orderBy)
            params['orderBy'] = orderBy;

        $http({method: 'GET', url: '/api/custom/ActionPlans/find-all-by-employee', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getIncompleteEmployeeActionPlans = function(employeeID) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/ActionPlans/find-incomplete-by-employee', params: {employeeID: employeeID}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getActionPlans_document = function($scope, id) {

    

        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/ActionPlans/find-one', params: {id: id}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                $scope._ActionPlans = data.item;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.addActionPlans = function($scope, ActionPlans) {
        var d = $q.defer();
    

        $http.post('/api/custom/ActionPlans/create', ActionPlans)
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

    this.editActionPlans = function($scope, ActionPlans) {
        var d = $q.defer();
    

        ActionPlans.id = ActionPlans._id;
        $http.post('/api/custom/ActionPlans/update/'+ActionPlans.id, ActionPlans)
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1)
                {
                    for (i = 0; i<this.data.items.length; i++) {
                        if (this.data.items[i]._id == ActionPlans._id) {
                            this.data.items[i] = ActionPlans;
                        }
                    }

                }
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
        return d.promise;
    };

    this.deleteActionPlans = function($scope, id) {



        $http.post('/api/custom/ActionPlans/delete/'+id, {id: id})
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
