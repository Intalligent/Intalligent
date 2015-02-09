app.service('ProfessionalGroupsModel' , function ($http, $q) {
    this.data = null;

    this.getProfessionalGroups_documents = function(params) {

    

        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/ProfessionalGroups/find-all', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getProfessionalGroups_document = function($scope, id) {

    

        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/ProfessionalGroups/find-one', params: {id: id}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                $scope._ProfessionalGroups = data.item;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.addProfessionalGroups = function($scope, ProfessionalGroups) {

    

        $http.post('/api/custom/ProfessionalGroups/create', ProfessionalGroups)
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

    this.editProfessionalGroups = function($scope, ProfessionalGroups) {

    

        ProfessionalGroups.id = ProfessionalGroups._id;
        $http.post('/api/custom/ProfessionalGroups/update/'+ProfessionalGroups.id, ProfessionalGroups)
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1)
                {
                    for (i = 0; i<this.data.items.length; i++) {
                        if (this.data.items[i]._id == ProfessionalGroups._id) {
                            this.data.items[i] = ProfessionalGroups;
                        }
                    }
                $scope.cancel();
                }
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.deleteProfessionalGroups = function($scope, id) {

    


        $http({method: 'DELETE', url: '/api/custom/ProfessionalGroups/delete/'+id, params: {id: id}})
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
