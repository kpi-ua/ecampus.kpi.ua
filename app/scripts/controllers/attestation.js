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
    $scope.attestationPeriodId = null;
    $scope.Semesters = [
      {id: 1, name: 'Перший семестр'},
      {id: 2, name: 'Другий семестр'}
    ];

    $scope.errorLoadGroupsResult = '';
    $scope.getGroupsResults = false;
    $scope.disciplinesList = [];

    $scope.errorMessageLecturers = '';
    $scope.teacherGroupsList = [];
    $scope.getLecturersResults = false;

    $scope.setPill = function (newPill) {
      $scope.pill = newPill;
    };

    $scope.isSet = function (pillNum) {
      return $scope.pill === pillNum;
    };

    function loadYears() {
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

    function loadAttests() {
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

    function DisciplinesTeachersModel(disciplineName, disciplineShortName, teacherName) {
      this.disciplineFullName = disciplineName;
      this.disciplineShortName = disciplineShortName;
      this.teacherName = teacherName;
    }

    function getDisciplineName(fullName) {
      var result = fullName.split(",");
      return result[0];
    }

    function getStudentsAndDisciplinesLists(response) {
      var allDisciplinesList = [];
      var allStudentsList = [];
      for (var i = 0; i < response.length; i++) {
        allDisciplinesList.push(
          new DisciplinesTeachersModel(
            response[i].disciplineFullName,
            getDisciplineName(response[i].disciplineFullName),
            response[i].teacher
          )
        );
        allStudentsList.push(response[i].student);
      }
      $scope.disciplinesList = uniqueLoadGroupsResultElements(allDisciplinesList);
      $scope.studentsList = uniqueElements(allStudentsList);
    }

    function uniqueLoadGroupsResultElements(arr) {
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

    function uniqueElements(arr) {
      var obj = {};

      for (var i = 0; i < arr.length; i++) {
        var str = arr[i];
        obj[str] = true;
      }

      return Object.keys(obj);
    }

    function sortByStudentNameThenDiscName(a, b) {

      var name1 = a.student;
      var name2 = b.student;

      var disc1 = a.disciplineFullName;
      var disc2 = b.disciplineFullName;

      return name1.localeCompare(name2) || disc1.localeCompare(disc2);
    }

    function sortByStudyGroupName(a, b) {
      var name1 = a.studyGroupName;
      var name2 = b.studyGroupName;

      return name1.localeCompare(name2);
    }

    function generateUrlForAttestPeriod(year, semester, attestNum) {
      return 'Attestation/period?dcStudingYearId=' + year + '&semesterYear=' + semester + '&dcLoadId=' + attestNum;
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

    $scope.loadGroups = function (namePattern) {
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

    $scope.loadGroupsResult = function (rtStudyGroupId, cAttestationPeriodId) {
      var url = 'Attestation/group/' + rtStudyGroupId + '/period/' + cAttestationPeriodId + '/result';
      Api.execute("GET", url)
        .then(function (response) {
            $scope.errorLoadGroupsResult = "";
            $scope.GroupsResult = response.sort(sortByStudentNameThenDiscName);
            getStudentsAndDisciplinesLists(response);
            $scope.getGroupsResults = true;
          },
          function () {
            $scope.errorLoadGroupsResult = "Не вдалося завантажити результати для даної групи";
            $scope.GroupsResult = null;
          });
    };

    $scope.loadLecturers = function (namePattern) {
      if (namePattern.length > 2) {
        var url = 'Attestation/lecturer/find/' + namePattern;
        // url + namePattern (3 first symbol of group)
        Api.execute("GET", url)
          .then(function (response) {
              $scope.errorMessageLecturers = "";
              $scope.Lecturers = response;
            },
            function () {
              $scope.errorMessageLecturers = "Не вдалося завантажити список груп";
              $scope.Lecturers = null;
            });
      }
      else {
        $scope.errorMessageLecturers = "Введіть більше 3-х символів для пошуку групи";
      }
    };

    $scope.loadLecturersResult = function (eEmployees1Id, cAttestationPeriodId) {
      var url = 'Attestation/lecturer/' + eEmployees1Id + '/period/' + cAttestationPeriodId + '/disciplines';
      Api.execute("GET", url)
        .then(function (response) {
            $scope.errorLecturersResult = "";
            $scope.LecturersResult = response.sort(sortByStudyGroupName);
            console.log(response);
            var allTeacherGroupsList = [];
            for (var i = 0; i < response.length; i++) {
              allTeacherGroupsList.push(response[i].studyGroupName);
            }
            $scope.teacherGroupsList = uniqueElements(allTeacherGroupsList);
            console.log($scope.teacherGroupsList);
          },
          function () {
            $scope.errorLecturersResult = "Не вдалося завантажити результати для даного викладача";
            $scope.LecturersResult = null;
          });
    };

    loadYears();
    loadAttests();

  }]);
