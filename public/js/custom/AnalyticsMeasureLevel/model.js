app.service('AnalyticsMeasureLevelModel' , function ($http, $q) {
    this.data = null;

    this.getEmployeeAnalyticsMeasureLevel_documents = function(employee, type) {
        var d = $q.defer();
        //showLoader();

        var params = {employee: employee};

        if (type) {
            params['type'] = type;
        }

        $http({method: 'GET', url: '/api/custom/AnalyticsMeasureLevel/find-by-employee', params: params})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getEmployeeAnalyticsAreasEvolution = function(employee) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AnalyticsMeasureLevel/get-areas-evolution', params: {employee: employee}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getEmployeeAnalyticsTPEvolution = function(employee) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AnalyticsMeasureLevel/get-tp-evolution', params: {employee: employee}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getAreaAnalyticsEvolution = function(employee, area) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AnalyticsMeasureLevel/get-area-evolution', params: {employee: employee, area: area}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getEmployeeLastTPRating = function(employee) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AnalyticsMeasureLevel/get-last-tprating', params: {employee: employee}})
            .success(angular.bind(this, function (data) {
                d.resolve(data);
                this.data = data;
            }))
            .error(angular.bind(this, function (data) {
                this.data = null;
            }));

        return d.promise;
    };

    this.getPositionReport = function(params) {
        var d = $q.defer();
        //showLoader();

        $http({method: 'GET', url: '/api/custom/AnalyticsMeasureLevel/get-position-report', params: params})
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
