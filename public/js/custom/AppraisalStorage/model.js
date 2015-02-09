app.service('AppraisalStorageModel' , function ($http, $q) {
    this.data = null;
    this.currentEvaluation = null;

    this.getAppraisalStorage_documents = function(params) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AppraisalStorage/find-all', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getAppraisalStorage_document = function($scope, id) {
        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/AppraisalStorage/find-one', params: {id: id}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                $scope._AppraisalStorage = data.item;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getEmployeeAppraisalStorage_documents = function(type, employee, limit) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AppraisalStorage/find-all-by-employee', params: {type: type, employee: employee, status: 2, limit: (limit) ? limit : 5}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getAppraisalStorage = function(toEmployee, byEmployee) {
        var d = $q.defer();

        this.currentEvaluation = null;

        $http({method: 'GET', url: '/api/custom/AppraisalStorage/find-one-by-employee', params: {toEmployee: toEmployee, byEmployee: byEmployee, status: 1}})
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

    this.saveAppraisalStorage = function($scope, employee, areas, status) {
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
            var appraisalStorage = this.currentEvaluation;

            appraisalStorage.id = appraisalStorage._id;
            appraisalStorage.appraisalEndDate = new Date();
            appraisalStorage.appraisalStatus = status;
            appraisalStorage.areasOverview = areasOverview;

            $http.post('/api/custom/AppraisalStorage/update/'+appraisalStorage.id, appraisalStorage)
                .success(angular.bind(this, function (data) {
                    d.resolve(data);
                    noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                    if (data.result == 1) this.currentEvaluation = appraisalStorage;
                }))
                .error(angular.bind(this, function (data) {
                    noty({text: 'Error',  timeout: 2000, type: 'error'});
                }));
        }
        else {
            var appraisalStorage = {};

            appraisalStorage.appraisalDate = new Date();
            appraisalStorage.appraisalEndDate = new Date();
            appraisalStorage.appraisalStatus = status;
            appraisalStorage.appraisalToEmployee = employee._id;
            appraisalStorage.appraisalToEmployeeName = employee.employeeName;
            appraisalStorage.appraisalToEmployeeUnit = employee.idunit;
            appraisalStorage.appraisalToEmployeeDepartment = employee.actualDepartment;
            appraisalStorage.appraisalToEmployeeBrand = employee.idbrand;
            appraisalStorage.appraisalByEmployee = $scope.myEmployee._id;
            appraisalStorage.appraisalByEmployeeName = $scope.myEmployee.employeeName;
            appraisalStorage.areasOverview = areasOverview;

            $scope.showLoader();

            $http.post('/api/custom/AppraisalStorage/create', appraisalStorage)
                .success(angular.bind(this, function (data) {
                    d.resolve(data);
                    noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                    if (data.result == 1) this.currentEvaluation = data.item;
                    $scope.hideLoader();
                }))
                .error(angular.bind(this, function (data) {
                    noty({text: 'Error',  timeout: 2000, type: 'error'});
                }));
        }

        return d.promise;
    };

    this.deleteAppraisalStorage = function($scope, id) {
        $http({method: 'DELETE', url: '/api/custom/AppraisalStorage/delete/'+id, params: {id: id}})
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1) $('#'+$scope.delete_id).remove();
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.getEmployeeAppraisalStorageBehaviourHistory = function(employee, employeeFrom, behaviour) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AppraisalStorage/get-behaviour-history', params: {employee: employee, employeeFrom: employeeFrom, behaviour: behaviour, limit: 5}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getEmployeeLastEvaluation = function(employee) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AppraisalStorage/get-last-evaluation', params: {employee: employee}})
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
