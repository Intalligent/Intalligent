app.service('EmployeesModel' , function ($http, $q) {
    this.data = null;

    this.getEmployees = function(params) {
        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/Employees/find-all', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getEmployee = function(id) {
        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/Employees/find-one', params: {id: id}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                this.data = data.item;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.addEmployee = function(data) {
        var d = $q.defer();

        //if (data.status) data.status = data.status.value;
        if (!data.autoAssessment) data.autoAssessment = false;
        if (!data.personalityAssessment) data.personalityAssessment = false;

        $http.post('/api/custom/Employees/create', data)
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1)  d.resolve(data); //window.location.hash = '/employees';
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));

        return d.promise;
    };

    this.editEmployee = function(data) {
        var d = $q.defer();

        data.id = data._id;

        //if (data.status) data.status = data.status.value;

        $http.post('/api/custom/Employees/update', data)
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1)  d.resolve(data); //window.location.hash = '/employees';
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));

        return d.promise;
    };

    this.deleteEmployee = function(id, deleteUser) {
        $http.post('/api/custom/Employees/delete', {_id: id, deleteUser: deleteUser})
        //$http({method: 'DELETE', url: '/api/custom/Employees/delete/'+id, params: {id: id}})
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: 'success'});
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.resetEmployee = function(id) {
        var d = $q.defer();

        $http.post('/api/custom/Employees/reset', {id: id})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                noty({text: data.msg,  timeout: 2000, type: 'success'});
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));

        return d.promise;
    };

    this.getEmployeeProfile = function() {
        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/Employees/get-employee-profile', params: {}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                /*if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }*/
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getFieldValues = function(fieldID) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/Employees/get-field-values', params: {fieldID: fieldID}})
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

