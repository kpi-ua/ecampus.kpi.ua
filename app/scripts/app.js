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
    'angular-input-stars',
    "xeditable",
	'ui.tree'
]);

app.run(function(editableOptions) {
    editableOptions.theme = 'bs3';
});

app.config(function($routeProvider, $locationProvider) {
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
        .when('/social-forbidden', {
            templateUrl: 'views/social-forbidden.html',
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
        .when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'AdminCtrl',
            controllerAs: 'admin'
        })
        .when('/statistic', {
            templateUrl: 'views/statistic.html',
            controller: 'StatisticCtrl',
            controllerAs: 'statistic'
        })
        .when('/statistic-npp', {
            templateUrl: 'views/statistic-npp.html',
            controller: 'NppCtrl',
            controllerAs: 'npp'
        })
        .when('/statistic-zkm', {
            templateUrl: 'views/statistic-zkm.html',
            controller: 'ZkmCtrl',
            controllerAs: 'zkm'
        })
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl',
            controllerAs: 'home'
        })
        .when('/bulletins-board', {
            templateUrl: "views/bulletins-board.html",
            controller: "HomeBulletinsBoardCtrl",
            controllerAs: 'board'
        })
        .when('/disciplines-choice', {
            templateUrl: "views/disciplines-choice.html",
            controller: "DisciplinesChoiceCtrl",
            controllerAs: 'choice'
        })
        .when('/settings', {
            templateUrl: 'views/settings.html',
            controller: 'SettingsCtrl',
            controllerAs: 'settings'
        })
        .when('/discipline-specialization', {
            templateUrl: 'views/discipline-specialization.html',
            controller: 'DisciplinesSpecializationCtrl',
            controllerAs: 'specialization'
        })
        .when('/discipline-proposition', {
            templateUrl: 'views/discipline-proposition.html',
            controller: 'DisciplinesPropositionCtrl',
            controllerAs: 'proposition'
        })
        .when('/discipline-block', {
            templateUrl: 'views/discipline-block.html',
            controller: 'DisciplinesBlockCtrl',
            controllerAs: 'block'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);
});
