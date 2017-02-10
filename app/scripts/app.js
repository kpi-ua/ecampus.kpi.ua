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
  'ui.tree',
  'ui.select',
  'xeditable',
  'checklist-model'
]);

app.config(configRoutes);
app.run(['$rootScope', 'api', appRun]);

appRun.$inject  = ['$rootScope', 'api'];
configRoutes.$inject  = ['$routeProvider', '$locationProvider'];

function configRoutes ($routeProvider, $locationProvider) {

  $locationProvider.hashPrefix('!');

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
      templateUrl: 'views/bulletins-board.html',
      controller: 'HomeBulletinsBoardCtrl',
      controllerAs: 'board'
    })
    .when('/disciplines-choice-st', {
      templateUrl: 'views/disciplines-choice-st.html',
      controller: 'DisciplinesChoiceCtrl',
      controllerAs: 'choiceSt'
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
    .when('/disciplines-choice-t', {
      templateUrl: 'views/disciplines-choice-t.html',
      controller: 'DisciplinesChoiceTCtrl',
      controllerAs: 'choiceT'
    })
    .when('/individual-plan', {
      templateUrl: 'views/individual-plan.html',
      controller: 'IndividualPlanCtrl',
      controllerAs: 'individualPlan'
    })
    .when('/discipline-fund', {
      templateUrl: 'views/discipline-fund.html',
      controller: 'DisciplineFundCtrl',
      controllerAs: 'disciplineFund'
    })
    .when('/rnp', {
      templateUrl: 'views/rnp.html',
      controller: 'RnpCtrl',
      controllerAs: 'rnp'
    })
    .when('/attestation', {
      templateUrl: 'views/attestation.html',
      controller: 'AttestationCtrl',
      controllerAs: 'attest'
    });

  $locationProvider.html5Mode(true);
}

function appRun($rootScope, api) {

  var deregister = $rootScope.$on('$routeChangeSuccess', function () {
    angular.element(document).ready(function () {
      var isLogged = api.getToken();
      if (isLogged) {
        api.changeIsSessionExpiredValue(api.removeToken());
      }
    });
  });

  $rootScope.$on('$destroy', deregister);
}
