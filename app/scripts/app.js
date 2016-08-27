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
    'ngTouch',
    'angular-input-stars'
]);

app.config(function ($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main'
        })
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'InformationCtrl',
            controllerAs: 'About'
        })
        .when('/contacts', {
            templateUrl: 'views/contacts.html',
            controller: 'InformationCtrl',
            controllerAs: 'Contacts'
        })
        .when('/privacy', {
          templateUrl: 'views/privacy.html',
          controller: 'InformationCtrl',
          controllerAs: 'privacy'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'SecurityCtrl',
            controllerAs: 'Security'
        })
        .when('/restore-password.html', {
            templateUrl: 'views/restore-password.html',
            controller: 'SecurityCtrl',
            controllerAs: 'Security'
        })
        .when('/voting', {
            templateUrl: 'views/voting.html',
            controller: 'VotingCtrl',
            controllerAs: 'Voting'
        })
        .when('/voting/profile/:id', {
            templateUrl: 'views/voting-profile.html',
            controller: 'VotingProfileCtrl',
            controllerAs: 'Voting'
        })
        .when('/debugger.html', {
            templateUrl: 'views/debugger.html',
            controller: 'DebuggerCtrl',
            controllerAs: 'Debugger'
        })
        .when('/statistic', {
          templateUrl: 'views/statistic.html',
          controller: 'StatisticCtrl',
          controllerAs: 'statistic'
        })        
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);

    //Campus.setApiEndpoint('https://api-campus-kpi-ua.azurewebsites.net/');
    //Campus.setApiEndpoint('http://localhost:56329/');
});