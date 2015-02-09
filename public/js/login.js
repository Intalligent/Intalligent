'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('nodedream-login', ['ui.router','myApp.filters', 'myApp.services', 'myApp.directives', 'vcRecaptcha']).
    config(['$stateProvider','$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/")

        $stateProvider
            .state('login',{
                url:'/',
                templateUrl : 'partial/public/login',
                controller : PublicCtrl
            })
            /*.state('register',{
             url:'/register',
             templateUrl : 'partial/register',
             controller : PublicCtrl
             })*/
            .state('verify',{
                url:'/verify/:hash/:email',
                templateUrl : 'partial/public/verify',
                controller : PublicCtrl
            })
            /*.state('remember-password',{
             url:'/remember-password',
             templateUrl : 'partial/rememberPassword',
             controller : PublicCtrl
             })*/
            .state('change-password',{
                url:'/change-password/:hash',
                templateUrl : 'partial/public/changePassword',
                controller : PublicCtrl
            })
    }]);

angular.module('nodedream-login').run(['$http', '$rootScope', '$sce', function($http, $rootScope, $sce) {
    appRun($http, $rootScope, $sce);
}]);

