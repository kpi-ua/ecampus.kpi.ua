'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:DisciplinesBlockCtrl
 * @description
 * # DisciplinesBlockCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
  .controller('DisciplinesBlockCtrl', function($scope, $http, Api, UniqueElemsInList) {
    reload();

    $scope.InitializeTree = function() {
      if (
        ($scope.selectedYear !== undefined) &&
        ($scope.selectedOkr !== undefined)
      ) {
        $scope.dataInTree = UniqueElemsInList.getArrayOfBlocksAndDisc(
          $scope.selectedYear, $scope.selectedOkr, $scope.alldata
        );
      }
    };

    $scope.ifYearAndOkr0Chosen = function() {
      if (($scope.dataInTree) && ($scope.dataInTree.length !== 0)) {
        return Boolean($scope.dataInTree);
      }
    };

    $scope.ifTreeLengthZero = function() {
      if (($scope.selectedYear === null) || ($scope.selectedOkr === null)) {
        return true;
      }
      if ($scope.dataInTree) {
        if ($scope.dataInTree.length !== 0) {
          return false;
        }
      } else {
        return true;
      }
    };

    $scope.ifNull = function(inputData) {
      if (inputData === null) {
        inputData = 'Не визначено';
      }
    };

    function reload() {
      if (Api.getToken()) {
        var sClaim = Api.decodeToken(Api.getToken());
        if (sClaim) sClaim = JSON.parse(sClaim);
        var path = 'SelectiveDiscipline/Blocksyear';
        Api.execute('GET', path).then(function(response) {
          if (!response || response === '') {
            $scope.errorLabelText = 'На жаль, роки  у базі даних відсутні.';
          } else {
            $scope.alldata = response;
            for (var i = 0; i < $scope.alldata.length; i++) {
              if ($scope.alldata[i].countLecture === null) {
                $scope.alldata[i].countLecture = 'Не визначено';
              }
            }
            UniqueElemsInList.setData($scope.alldata);
            $scope.allYears = UniqueElemsInList.getDataUnique('studyPeriod.all');
            $scope.allYears.sort();
            $scope.allOkrs = UniqueElemsInList.getDataUnique('okr');
            $scope.selectedYear = UniqueElemsInList.setCurrentYear($scope.allYears);
          }
        }, function(response, status, headers) {
          //
        });
      }
    }

  });
