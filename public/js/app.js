'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('nodedream-app', ['ui.router','myApp.filters', 'myApp.services', 'myApp.directives','countrySelect','currencySelect', 'checkboxList',
                                           'ui.sortable', 'colorpicker.module', 'vr.directives.slider', 'ngTouch', 'ui.bootstrap', 'textAngular']).
    config(['$stateProvider','$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/my-employee-profile")

        $stateProvider
            .state('home',{
                url:'/home',
                templateUrl : '/partial/private/home',
                controller : WebAppCtrl
            })
            .state('profile',{
                url:'/profile',
                templateUrl : '/partial/private/profile',
                controller : 'usersCtrl'
            })
            .state('admin',{
                url:'/admin',
                templateUrl: '/partial/private/admin',
                controller: 'AdminCtrl'
            })
            .state('admin-users',{
                url:'/admin/users',
                templateUrl: '/view/admin/users/index',
                controller: 'AdminUsersCtrl'
            })
            .state('admin-users-add',{
                url:'/admin/users/add',
                templateUrl: '/view/admin/users/add',
                controller: 'AdminUsersCtrl'
            })
            .state('admin-users-edit',{
                url:'/admin/users/edit/:user_id',
                templateUrl: '/view/admin/users/edit',
                controller: 'AdminUsersCtrl'
            })
            .state('admin-roles',{
                url:'/admin/roles',
                templateUrl: '/view/admin/roles/index',
                controller: 'AdminRolesCtrl'
            })
            .state('admin-roles-add',{
                url:'/admin/roles/add',
                templateUrl: '/view/admin/roles/add',
                controller: 'AdminRolesCtrl'
            })
            .state('admin-roles-edit',{
                url:'/admin/roles/edit/:role_id',
                templateUrl: '/view/admin/roles/edit',
                controller: 'AdminRolesCtrl'
            })
            .state('admin-configurations',{
                url:'/admin/configurations',
                templateUrl: '/view/admin/configurations/index',
                controller: 'AdminConfigurationsCtrl'
            })
            .state('admin-languages',{
                url:'/admin/languages',
                templateUrl: '/view/admin/languages/index',
                controller: 'AdminLanguagesCtrl'
            })
            .state('admin-languages-add',{
                url:'/admin/languages/add',
                templateUrl: '/view/admin/languages/add',
                controller: 'AdminLanguagesCtrl'
            })
            .state('admin-languages-edit',{
                url:'/admin/languages/edit/:language_id',
                templateUrl: '/view/admin/languages/edit',
                controller: 'AdminLanguagesCtrl'
            })
            .state('admin-languages-translations',{
                url:'/admin/languages/translations/:language_id',
                templateUrl: '/view/admin/languages/translations',
                controller: 'AdminLanguagesCtrl'
            })
            .state('admin-communications',{
                url:'/admin/communications',
                templateUrl: '/view/admin/communications/index',
                controller: 'AdminCommunicationsCtrl'
            })
            .state('admin-communications-add',{
                url:'/admin/communications/add',
                templateUrl: '/view/admin/communications/add',
                controller: 'AdminCommunicationsCtrl'
            })
            .state('admin-communications-edit',{
                url:'/admin/communications/edit/:communication_id',
                templateUrl: '/view/admin/communications/edit',
                controller: 'AdminCommunicationsCtrl'
            })
            .state('admin-files',{
                url:'/admin/files',
                templateUrl: '/view/admin/files/index',
                controller: 'AdminFilesCtrl'
            })
            .state('admin-files-upload',{
                url:'/admin/files/upload',
                templateUrl: '/view/admin/files/upload',
                controller: 'AdminFilesCtrl'
            })
            .state('admin-files-edit',{
                url:'/admin/files/edit/:file_id',
                templateUrl: '/view/admin/files/edit',
                controller: 'AdminFilesCtrl'
            })
            .state('admin-logs',{
                url:'/admin/logs',
                templateUrl: '/view/admin/logs/index',
                controller: 'AdminLogsCtrl'
            })

            /* do not remove or edit this line */ /* ##NODE_DREAM_CUSTOM_CONTROLLERS## */
            .state('nodedreamdesigner',{
                url:'/nddesigner/new',
                templateUrl: '/view/admin/nodedream/designer',
                controller: 'nodeDreamCtrl'
            })
    }]);

angular.module('nodedream-app').run(['$http', '$rootScope', '$sce', '$window', function($http, $rootScope, $sce, $window) {
    $rootScope.logout = function() {
        $http({method: 'DELETE', url: '/api/logout'}).
            success(function(data, status, headers, config) {
                $window.location.href="/public#/logout";
            }).
            error(function(data, status, headers, config) {
                //console.log(data);
            });
    }
    $rootScope.notificationsDropdown = '/partial/notificationsDropdown';

    appRun($http, $rootScope, $sce);
}]);

app.config(['$tooltipProvider', function($tooltipProvider){
    $tooltipProvider.options({
        placement: 'top',
        animation: true,
        popupDelay: 0,
        appendToBody: true});
}]);

