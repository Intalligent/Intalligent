app.controller('SettingsCtrl', function ($scope, $q, $sce, $filter, $window, adminUsersModel) {
    $scope.submenu = '/partial/custom/Settings/SettingsSubmenu';

    $scope.changeUser = function(data) {
        adminUsersModel.changeUser($window, data.username)
    };
});

app.config(function($stateProvider) {

    $stateProvider.state('settings',{
        url:'/settings',
        templateUrl: '/partial/custom/Settings/index',
        controller: 'SettingsCtrl'
    })
    .state('settings-change-user',{
        url:'/settings/change-user',
        templateUrl: '/partial/custom/Settings/changeUser',
        controller: 'SettingsCtrl'
    })

});

