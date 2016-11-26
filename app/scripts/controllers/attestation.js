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
    $scope.errorMessageGroups = '';
    $scope.attestPeriodId = '';
    $scope.Semesters = [
      {id: 1, name: 'Перший семестр'},
      {id: 2, name: 'Другий семестр'}
    ];

    $scope.setPill = function (newPill) {
      $scope.pill = newPill;
    };

    $scope.isSet = function (pillNum) {
      return $scope.pill === pillNum;
    };
    
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

    function generateUrlForAttestPeriod(year, semester, attestNum) {
      return 'Attestation/period?dcStudingYearId=' + year + '&semesterYear=' + semester +'&dcLoadId=' + attestNum;
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

    $scope.getAttestationPeriodId = function (dcStudingYearId, semesterYear, dcLoadId) {
      var url = generateUrlForAttestPeriod(dcStudingYearId, semesterYear, dcLoadId);
      console.log(url);
      Api.execute("GET", url)
        .then(function (response) {
            $scope.attestationPeriodId = response;
          },
          function () {
            $scope.Attests = null;
          });
    };

    $scope.LoadGroups = function (namePattern) {
      if (namePattern.length > 1) {
        var url = 'Attestation/group/find/' + namePattern;
        // url + namePattern (2 first symbol of group)
        Api.execute("GET", url)
          .then(function (response) {
              $scope.errorMessageGroups = "";
              $scope.Groups = response;
            },
            function () {
              $scope.errorMessageGroups = "Не вдалося завантажити список груп";
              $scope.Groups = null;
            });
      }
      else {
        $scope.errorMessageGroups = "Введіть більше 2-х символів для пошуку групи";
      }
    };

    LoadYears();
    LoadAttests();

  }]);
