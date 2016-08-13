'use strict';

/**
 * @ngdoc overview
 * @name ecampusApp
 * @description
 * # ecampusApp
 *
 * Main module of the application.
 */
var app = angular.module('ecampusApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
]);

app.config(function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main'
        })
        .when('/about.html', {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl',
            controllerAs: 'about'
        })
        .when('/login.html', {
            templateUrl: 'views/login.html',
            controller: 'SecurityCtrl',
            controllerAs: 'Security'
        })
        .when('/restore-password.html', {
            templateUrl: 'views/restore-password.html',
            controller: 'SecurityCtrl',
            controllerAs: 'Security'
        })
        .when('/voting.html', {
            templateUrl: 'views/voting.html',
            controller: 'VotingCtrl',
            controllerAs: 'Voting'
        })
        .when('/debugger.html', {
            templateUrl: 'views/debugger.html',
            controller: 'DebuggerCtrl',
            controllerAs: 'Debugger'
        })
        .otherwise({
            redirectTo: '/'
        });

    //$locationProvider.html5Mode(true);

    Campus.setApiEndpoint('https://api-campus-kpi-ua.azurewebsites.net/');
});