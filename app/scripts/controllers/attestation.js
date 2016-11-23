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

     $scope.attestNumTyped = '';

    function LoadYears() {
      var url = 'Attestation/studyYear';
      Api.execute("GET", url)
        .then(function (response) {
            $scope.Years = response;
          },
          function (result) {
            if (result.status === 401) {
              $scope.errorMessageYears = "Потрібно авторизуватися";
            } else {
              $scope.errorMessageYears = "Помилка на стороні сервера";
            }
          });
    }

    function LoadAttests() {
      var url = 'Attestation';
      Api.execute("GET", url)
        .then(function (response) {
            $scope.Attests = response;
          },
          function (result) {
            if (result.status === 401) {
              $scope.errorMessageYears = "Потрібно авторизуватися";
            } else {
              $scope.errorMessageYears = "Помилка на стороні сервера";
            }
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
