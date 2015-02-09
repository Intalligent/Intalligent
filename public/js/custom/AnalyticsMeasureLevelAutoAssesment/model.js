app.service('AnalyticsMeasureLevelAutoAssesmentModel' , function ($http, $q) {
    this.data = null;

    this.getEmployeeAnalyticsMeasureLevelAutoAssesment_documents = function(employee) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AnalyticsMeasureLevelAutoAssesment/find-by-employee', params: {employee: employee}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    /*this.getAnalyticsAreasEvolution = function(employee) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AnalyticsMeasureLevelAutoAssesment/get-areas-evolution', params: {employee: employee}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getAnalyticsTPEvolution = function(employee) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AnalyticsMeasureLevelAutoAssesment/get-tp-evolution', params: {employee: employee}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };*/

    this.getAreaAnalyticsEvolution = function(employee, area) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AnalyticsMeasureLevelAutoAssesment/get-area-evolution', params: {employee: employee, area: area}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getLastAutoTPRating = function(employee) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AnalyticsMeasureLevelAutoAssesment/get-last-tprating', params: {employee: employee}})
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
