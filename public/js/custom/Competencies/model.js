app.service('CompetenciesModel' , function ($http, $q) {
    this.data = null;

    this.getCompetencies_documents = function(params) {

    

        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/Competencies/find-all', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getCompetencies_document = function($scope, id) {

    

        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/Competencies/find-one', params: {id: id}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                $scope._Competencies = data.item;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.addCompetencies = function($scope, Competencies) {

    

        $http.post('/api/custom/Competencies/create', Competencies)
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

    this.editCompetencies = function($scope, Competencies) {

    

        Competencies.id = Competencies._id;
        $http({method: 'PUT', url: '/api/custom/Competencies/update/'+Competencies.id, params: Competencies})
        $http.post('/api/custom/Competencies/update/'+Competencies.id, Competencies)
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1)
                {
                    for (i = 0; i<this.data.items.length; i++) {
                        if (this.data.items[i]._id == Competencies._id) {
                            this.data.items[i] = Competencies;
                        }
                    }
                $scope.cancel();
                }
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.deleteCompetencies = function($scope, id) {

    


        $http({method: 'DELETE', url: '/api/custom/Competencies/delete/'+id, params: {id: id}})
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
