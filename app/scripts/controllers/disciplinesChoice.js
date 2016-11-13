'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:DisciplinesChoiceCtrl
 * @description
 * # DisciplinesChoiceCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
  .controller('DisciplinesChoiceCtrl', ['$scope', 'Api', function ($scope, Api) {
    $scope.tab = 1;
    $scope.errorMessage = '';
    $scope.hideInfo = false;
    $scope.loader = false;
    $scope.errorMessageDisc = '';
    $scope.hideInfoDisc = false;
    $scope.loaderDisc = false;

    $scope.setTab = function (newTab) {
      $scope.tab = newTab;
    };

    $scope.isSet = function (tabNum) {
      return $scope.tab === tabNum;
    };

    function loadInfo() {
      var url = '/Account/student/group';
      $scope.loader = true;

      Api.execute("GET", url)
        .done(function (response) {
          $scope.info = response[0];
          $scope.info.currentStudyYear = getCurrStudyYear(+response[0].yearIntake, +response[0].studyCourse);
          $scope.loader = false;
          $scope.$apply();
        })
        .fail(function (result) {

          if (result.status === 401) {
            $scope.errorMessage = "Потрібно авторизуватися";
          } else {
            $scope.errorMessage = "Помилка на стороні сервера";
          }

          $scope.hideInfo = true;
          $scope.$apply();
        })
    }

    function getCurrStudyYear(yearIntake, studyCourse) {
      var startYear = yearIntake + studyCourse - 1;
      var endYear = yearIntake + studyCourse;

      return startYear + '-' + endYear;
    }

    function loadDisciplines() {
      var url = '/SelectiveDiscipline/semesters/disciplines';
      $scope.loaderDisc = true;

      Api.execute("GET", url)
        .done(function (response) {
          $scope.loaderDisc = true;
          $scope.disciplines = response;
          $scope.firstCourse = [];
          $scope.secondCourse = [];
          $scope.thirdCourse = [];
          $scope.fourthCourse = [];

          for (var i = 0; i < response.length; i++) {
            switch (response[i].course) {
              case 1:
                $scope.firstCourse.push(response[i]);
                break;
              case 2:
                $scope.secondCourse.push(response[i]);
                break;
              case 3:
                $scope.thirdCourse.push(response[i]);
                break;
              case 4:
                $scope.fourthCourse.push(response[i]);
                break;
            }
          }
          $scope.loaderDisc = false;
          $scope.$apply();
        })
        .fail(function (result) {
          if (result.status === 401) {
            $scope.errorMessageDisc = "Потрібно авторизуватися";
          } else {
            $scope.errorMessageDisc = "Помилка на стороні сервера";
          }
          $scope.hideInfoDisc = true;
          $scope.$apply();
        })
    }

    loadInfo();
    loadDisciplines();
  }]);
