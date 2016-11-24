'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:AttestationCtrl
 * @description
 * # AttestationCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
  .controller('AttestationCtrl', ['$scope', 'Api', function ($scope, Api) {
    $scope.errorMessageYears = '';
    $scope.errorMessageAttests = '';
    $scope.attestNumTyped = '';

    function LoadYears() {
      var url = 'Attestation/studyYear';
      Api.execute("GET", url)
        .then(function (response) {
            $scope.Years = response;
          },
          function () {
            $scope.errorMessageYears = "Не вдалося завантажити список навчальних років";
            $scope.Years = null;
          });
    }

    function LoadAttests() {
      var url = 'Attestation';
      Api.execute("GET", url)
        .then(function (response) {
            $scope.Attests = response;
          },
          function () {
            $scope.errorMessageAttests = "Не вдалося завантажити список атестацій";
            $scope.Attests = null;
          });
    }

    // ng-keyup="getTypedValue($select.search)"
    // $scope.getTypedValue = function (search) {
    //   $scope.attestNumTyped = search;
    // };

    $scope.Semesters = [
      {id: 1, name: 'Перший семестр'},
      {id: 2, name: 'Другий семестр'}
    ];

    LoadYears();
    LoadAttests();
  }]);
