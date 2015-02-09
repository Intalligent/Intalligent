'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('nodedream', ['ui.router','myApp.filters', 'myApp.services', 'myApp.directives']).
    config(['$stateProvider','$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/")

        $stateProvider
            .state('index',{
                url:'/',
                templateUrl : 'partial/public/index',
                controller : WebAppCtrl
            })
            .state('logout',{
                url:'/logout',
                templateUrl : 'partial/public/logout',
                controller : WebAppCtrl
            })

    }]);

angular.module('nodedream').run(['$http', '$rootScope', '$sce', function($http, $rootScope, $sce) {
    appRun($http, $rootScope, $sce);
}]);