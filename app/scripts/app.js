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
app.run(configXeditable);

configRoutes.$inject = ['$routeProvider', '$locationProvider'];

function configXeditable(editableOptions, editableThemes) {
  editableThemes.bs3.inputClass = 'input-md';
  editableThemes.bs3.buttonsClass = 'btn-md';
  editableOptions.theme = 'bs3';
}

function configRoutes($routeProvider, $locationProvider) {

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
      templateUrl: 'views/socialForbidden.html',
      controller: 'SecurityCtrl',
      controllerAs: 'Security'
    })
    .when('/restorePassword.html', {
      templateUrl: 'views/restorePassword.html',
      controller: 'SecurityCtrl',
      controllerAs: 'Security'
    })
    .when('/voting', {
      templateUrl: 'views/voting.html',
      controller: 'VotingCtrl',
      controllerAs: 'Voting'
    })
    .when('/voting/profile/:id', {
      templateUrl: 'views/votingProfile.html',
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
      templateUrl: 'views/statisticNpp.html',
      controller: 'NppCtrl',
      controllerAs: 'npp'
    })
    .when('/statistic-zkm', {
      templateUrl: 'views/statisticZkm.html',
      controller: 'ZkmCtrl',
      controllerAs: 'zkm'
    })
    .when('/home', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      controllerAs: 'home'
    })
    .when('/bulletins-board', {
      templateUrl: 'views/bulletinsBoard.html',
      controller: 'HomeBulletinsBoardCtrl',
      controllerAs: 'board'
    })
    .when('/disciplines-choice-st', {
      templateUrl: 'views/disciplineChoiceStudent.html',
      controller: 'DisciplineChoiceStudentCtrl',
      controllerAs: 'disciplineChoiceStudent'
    })
    .when('/disciplines-choice-t', {
      templateUrl: 'views/disciplineChoiceTeacher.html',
      controller: 'DisciplineChoiceTeacherCtrl',
      controllerAs: 'disciplineChoiceTeacher'
    })
    .when('/settings', {
      templateUrl: 'views/settings.html',
      controller: 'SettingsCtrl',
      controllerAs: 'settings'
    })
    .when('/discipline-specialization', {
      templateUrl: 'views/disciplineSpecialization.html',
      controller: 'DisciplinesSpecializationCtrl',
      controllerAs: 'specialization'
    })
    .when('/discipline-proposition', {
      templateUrl: 'views/disciplineProposition.html',
      controller: 'DisciplinesPropositionCtrl',
      controllerAs: 'proposition'
    })
    .when('/discipline-block', {
      templateUrl: 'views/disciplineBlock.html',
      controller: 'DisciplinesBlockCtrl',
      controllerAs: 'block'
    })
    .when('/individual-plan', {
      templateUrl: 'views/individualPlan.html',
      controller: 'IndividualPlanCtrl',
      controllerAs: 'individualPlan'
    })
    .when('/discipline-fund', {
      templateUrl: 'views/disciplineFund.html',
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
    })
    .when('/np-specializations', {
      templateUrl: 'views/npSpecializations.html',
      controller: 'NpSpecializationsCtrl',
      controllerAs: 'NpSpec'
    });

  $locationProvider.html5Mode(true);
}
