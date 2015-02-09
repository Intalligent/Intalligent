app.controller('IntalligentCtrl', function ($scope, $rootScope, EmployeesModel, $stateParams, $q, $filter) {

    $scope.loadEmployeeProfile = function() {
        $q.all([
                EmployeesModel.getEmployeeProfile()
            ]).then(function(data) {
                $rootScope.myEmployee = EmployeesModel.data.employee;
                $rootScope.myUnit = (EmployeesModel.data.unit) ? EmployeesModel.data.unit : null;
                $rootScope.myBrand = (EmployeesModel.data.brand) ? EmployeesModel.data.brand : null;

                if ($rootScope.myBrand && $rootScope.myBrand.loadBrandCSS) {
                    //var customCSS = $('<link rel="stylesheet" href="'+$rootScope.myBrand.brandCSS+'">');

                    var customCSS = $('<style>'+$rootScope.myBrand.brandCSS+'</style>');

                    $('head').append(customCSS);
                }
                if ($rootScope.myBrand && $rootScope.myBrand.showBrandLogo) {

                    $('#brandHeaderLogo').attr('src', $rootScope.myBrand.brandLogo);
                    $('#brandHeaderLogo').show();
                }

            });
    };

});

var init = function () {
    $('body').append('<div class="hidden" id="intalligent-controller" ng-controller="IntalligentCtrl" ng-init="loadEmployeeProfile()"></div>');
};

init();