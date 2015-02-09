app.controller('AdminLogsCtrl', function ($scope, adminLogsModel, $q) {
    $scope.submenu = '/partial/private/adminSubmenu';
    $scope.page = null;
    $scope.adminLogsModel = adminLogsModel;

    $scope.getLogs = function(page, search) {
        var params = {};

        params.page = (page) ? page : 1;

        if (search) params.search = search;

        $q.all([
            adminLogsModel.getLogs(params)
        ]).then(function(data) {
            $scope.page = adminLogsModel.data.page;
        });
    };

});
