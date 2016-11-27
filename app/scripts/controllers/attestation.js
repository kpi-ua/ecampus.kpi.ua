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
    $scope.errorLoadGroupsResult = '';
    $scope.attestationPeriodId = null;
    $scope.getGroupsResults = false;
    $scope.disciplinesList = [];

    $scope.Semesters = [
      {id: 1, name: 'Перший семестр'},
      {id: 2, name: 'Другий семестр'}
    ];

    function disciplinesTeachersModel(disciplineName, disciplineShortName, teacherName) {
      this.disciplineFullName = disciplineName;
      this.disciplineShortName = disciplineShortName;
      this.teacherName = teacherName;
    }

    $scope.setPill = function (newPill) {
      $scope.pill = newPill;
    };

    $scope.isSet = function (pillNum) {
      return $scope.pill === pillNum;
    };

    function getDisciplineName(fullName) {
      var result = fullName.split(",");
      return result[0];
    }

    function uniqueElements(arr) {
      var result = [];

      nextInput:
        for (var i = 0; i < arr.length; i++) {
          var str = arr[i];
          for (var j = 0; j < result.length; j++) {
            if ((result[j].disciplineFullName == str.disciplineFullName)
              && (result[j].teacherName == str.teacherName)
              && (result[j].disciplineShortName == str.disciplineShortName)) {
              continue nextInput;
            }
          }
          result.push(str);
        }
      return result;
    }


    function sortByStudentNameThenDiscName(a, b) {
      var name1 = a.student;
      var name2 = b.student;

      var disc1 = a.disciplineFullName;
      var disc2 = b.disciplineFullName;

      return name1.localeCompare(name2) || disc1.localeCompare(disc2);
    }

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
      return 'Attestation/period?dcStudingYearId=' + year + '&semesterYear=' + semester + '&dcLoadId=' + attestNum;
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
      Api.execute("GET", url)
        .then(function (response) {
            $scope.attestationPeriodId = +(response);
          },
          function () {
            $scope.attestationPeriodId = null;
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

    $scope.LoadGroupsResult = function (rtStudyGroupId, cAttestationPeriodId) {
      var url = 'Attestation/group/' + rtStudyGroupId + '/period/' + cAttestationPeriodId + '/result';
      Api.execute("GET", url)
        .then(function (response) {
            $scope.errorLoadGroupsResult = "";
            $scope.GroupsResult = response.sort(sortByStudentNameThenDiscName);
            console.log(response);
            var allDisciplinesList = [];
            for (var i = 0; i < response.length; i++) {
              allDisciplinesList.push(
                new disciplinesTeachersModel(response[i].disciplineFullName,
                  getDisciplineName(response[i].disciplineFullName),
                  response[i].teacher));
            }
            $scope.disciplinesList = uniqueElements(allDisciplinesList);
          },
          function () {
            $scope.errorLoadGroupsResult = "Не вдалося завантажити результати для даної групи";
            $scope.GroupsResult = null;
          });
    };


    LoadYears();
    LoadAttests();

  }]);
