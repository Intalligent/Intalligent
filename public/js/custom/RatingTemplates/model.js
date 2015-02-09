app.service('RatingTemplatesModel' , function ($http, $q) {
    this.data = null;

    this.getRatingTemplates = function(params) {
        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/RatingTemplates/find-all', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getRatingTemplate = function(id) {
        var d = $q.defer();

        $http({method: 'GET', url: '/api/custom/RatingTemplates/find-one', params: {id: id}})
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

    this.addRatingTemplate = function(data) {
        var d = $q.defer();

        $http.post('/api/custom/RatingTemplates/create', data)
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1)  d.resolve(data); //window.location.hash = '/rating-templates';
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));

        return d.promise;
    };

    this.editRatingTemplate = function(data) {
        var d = $q.defer();

        data.id = data._id;

        //if (data.status) data.status = data.status.value;

        $http.post('/api/custom/RatingTemplates/update', data)
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                noty({text: data.msg,  timeout: 2000, type: (data.result == 1) ? 'success' : 'error'});
                if (data.result == 1)  d.resolve(data); //window.location.hash = '/rating-templates';
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));

        return d.promise;
    };

    this.deleteRatingTemplate = function(id) {
        $http.post('/api/custom/RatingTemplates/delete', {_id: id})
        //$http({method: 'DELETE', url: '/api/custom/RatingTemplates/delete/'+id, params: {id: id}})
            .success(angular.bind(this, function (data) {
                noty({text: data.msg,  timeout: 2000, type: 'success'});
            }))
            .error(angular.bind(this, function (data) {
                noty({text: 'Error',  timeout: 2000, type: 'error'});
            }));
    };

    return this;
});

