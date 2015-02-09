app.service('PositionsModel' , function ($http, $q) {
    this.data = null;

    this.getPositions = function(params) {
        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/Positions/find-all', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getPosition = function(id) {
        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/Positions/find-one', params: {id: id}})
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

    this.getEvaluablePositions = function() {
        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/Positions/get-evaluable-positions', params: {}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                if (data.result == 0) {
                    noty({text: data.msg,  timeout: 2000, type: 'error'});
                    return;
                }
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.addPosition = function(data) {
        var d = $q.defer();

        //if (data.status) data.status = data.status.value;
        if (!data.autoAssessment) data.autoAssessment = false;
        if (!data.personalityAssessment) data.personalityAssessment = false;

        $http.post('/api/custom/Positions/create', data)
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1)  d.resolve(data); //window.location.hash = '/positions';
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));

        return d.promise;
    };

    this.editPosition = function(data) {
        var d = $q.defer();

        data.id = data._id;

        //if (data.status) data.status = data.status.value;

        $http.post('/api/custom/Positions/update', data)
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1)  d.resolve(data); //window.location.hash = '/positions';
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));

        return d.promise;
    };

    this.duplicatePosition = function(data) {
        var d = $q.defer();

        $http.post('/api/custom/Positions/duplicate', data)
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1)  d.resolve(data); //window.location.hash = '/positions';
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));

        return d.promise;
    };

    this.deletePosition = function(id) {
        $http.post('/api/custom/Positions/delete', {_id: id})
        //$http({method: 'DELETE', url: '/api/custom/Positions/delete/'+id, params: {id: id}})
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: 'success'});
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.loadPositions = function(loadAreas) {
        var d = $q.defer();
        var params = {sort: 'positionName'};

        if (loadAreas) {
            params['areas'] = true;
        }

        $http({method: 'GET', url: '/api/custom/Positions/find-all', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);

                //hideLoader();
            }))
            .error(angular.bind(this, function (data) {
                //hideLoader();
            }));
        return d.promise;
    };

    this.setStatus = function(data) {
        $http.post('/api/custom/Positions/set-status', data)
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: 'success'});
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    this.getAreaData = function(idPosition, id) {
        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/Positions/find-area', params: {id: id, position: idPosition}})
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

    return this;
});

