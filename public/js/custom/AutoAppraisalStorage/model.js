app.service('AutoAppraisalStorageModel' , function ($http, $q) {
    this.data = null;
    this.currentEvaluation = null;

    this.getAutoAppraisalStorage_documents = function(params) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AutoAppraisalStorage/find-all', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getAutoAppraisalStorage_document = function($scope, id) {
        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/AutoAppraisalStorage/find-one', params: {id: id}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                $scope._AutoAppraisalStorage = data.item;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getEmployeeAutoAppraisalStorage_documents = function(employee, limit) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AutoAppraisalStorage/find-all-by-employee', params: {employee: employee, status: 2, limit: (limit) ? limit : 1}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getAutoAppraisalStorage = function(employee) {
        var d = $q.defer();

        this.currentEvaluation = null;

        $http({method: 'GET', url: '/api/custom/AutoAppraisalStorage/find-one-by-employee', params: {employee: employee, status: 1}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    return;
                }
                this.currentEvaluation = data.item;
            }))
            .error(angular.bind(this, function (data) {
                this.currentEvaluation = null;
            }));

        return d.promise;
    };

    this.saveAutoAppraisalStorage = function($scope, employee, areas, status) {
        var d = $q.defer();
        var areasOverview = [], status = (status) ? status : 1;

        for (var i in areas) {
            var areaOverview = {}, behaviours = [];

            areaOverview.areaID = areas[i]._id;
            areaOverview.areaSubject = areas[i].areaName;
            areaOverview.areaWeightActive = areas[i].areaWeightActive;
            areaOverview.areaWeight = areas[i].areaWeight;

            for (var b in areas[i].behaviours) {
                if (areas[i].behaviours[b].selectedValue != -1) {
                    var behaviour = {};

                    behaviour.behaviourID = areas[i].behaviours[b]._id;
                    behaviour.behaviourSubject = areas[i].behaviours[b].behaviourName;
                    behaviour.behaviourValue = (areas[i].behaviours[b].selectedValue == -2) ? 0 : areas[i].behaviours[b].selectedValue;
                    behaviour.behaviourValueDescription = areas[i].behaviours[b].selectedValueDescription;
                    behaviour.behaviourValueColor = areas[i].behaviours[b].selectedValueColor;
                    behaviour.behaviourNotes = areas[i].behaviours[b].comments;
                    behaviour.behaviourMaxValue = 0;

                    for (var r in areas[i].behaviours[b].ratingConfiguration) {
                        if (areas[i].behaviours[b].ratingConfiguration[r].ratingValue > behaviour.behaviourMaxValue) {
                            behaviour.behaviourMaxValue = areas[i].behaviours[b].ratingConfiguration[r].ratingValue;
                        }
                    }

                    behaviour.behaviourPercent = Math.round((behaviour.behaviourValue/behaviour.behaviourMaxValue)*100);
                    behaviour.behaviourWeightActive = areas[i].behaviours[b].behaviourWeightActive;
                    behaviour.behaviourWeight = areas[i].behaviours[b].behaviourWeight;
                    behaviour.notApplicable = (areas[i].behaviours[b].selectedValue == -2);

                    behaviours.push(behaviour);
                }
            }

            if (behaviours.length > 0) {
                areaOverview.behaviours = behaviours;

                areasOverview.push(areaOverview);
            }
        }

        if (this.currentEvaluation) {
            var autoAppraisalStorage = this.currentEvaluation;

            autoAppraisalStorage.id = autoAppraisalStorage._id;
            autoAppraisalStorage.appraisalEndDate = new Date();
            autoAppraisalStorage.appraisalStatus = status;
            autoAppraisalStorage.areasOverview = areasOverview;

            $http.post('/api/custom/AutoAppraisalStorage/update/'+autoAppraisalStorage.id, autoAppraisalStorage)
                .success(angular.bind(this, function (data) {
                    d.resolve(data);
                    noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                    if (data.result == 1) this.currentEvaluation = autoAppraisalStorage;
                }))
                .error(angular.bind(this, function (data) {
                    noty({text: 'Error',  timeout: 2000, type: 'error'});
                }));
        }
        else {
            var autoAppraisalStorage = {};

            autoAppraisalStorage.appraisalDate = new Date();
            autoAppraisalStorage.appraisalEndDate = new Date();
            autoAppraisalStorage.appraisalStatus = status;
            autoAppraisalStorage.appraisalToEmployee = employee._id;
            autoAppraisalStorage.appraisalToEmployeeName = employee.employeeName;
            autoAppraisalStorage.appraisalToEmployeeUnit = employee.idunit;
            autoAppraisalStorage.appraisalToEmployeeDepartment = employee.actualDepartment;
            autoAppraisalStorage.appraisalToEmployeeBrand = employee.idbrand;
            autoAppraisalStorage.areasOverview = areasOverview;

            $http.post('/api/custom/AutoAppraisalStorage/create', autoAppraisalStorage)
                .success(angular.bind(this, function (data) {
                    d.resolve(data);
                    noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                    if (data.result == 1) this.currentEvaluation = data.item;
                }))
                .error(angular.bind(this, function (data) {
                    noty({text: 'Error',  timeout: 2000, type: 'error'});
                }));
        }

        return d.promise;
    };

    this.deleteAutoAppraisalStorage = function($scope, id) {
        $http({method: 'DELETE', url: '/api/custom/AutoAppraisalStorage/delete/'+id, params: {id: id}})
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1) $('#'+$scope.delete_id).remove();
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.getAutoAppraisalStorageBehaviourHistory = function(employee, behaviour) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AutoAppraisalStorage/get-behaviour-history', params: {employee: employee, behaviour: behaviour, limit: 5}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getLastAutoEvaluation = function(employee) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AutoAppraisalStorage/get-last-evaluation', params: {employee: employee}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    return this;
});
