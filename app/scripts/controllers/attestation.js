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
    $scope.attestationPeriodId = '';

    $scope.Semesters = [
      {id: 1, name: 'Перший семестр'},
      {id: 2, name: 'Другий семестр'}
    ];

    $scope.errorLoadGroupsResult = '';
    $scope.getGroupsResults = false;
    $scope.disciplinesListForGroups = [];
    $scope.loaderGroupsResult = false;

    $scope.errorMessageLecturers = '';
    $scope.getLecturersResults = false;
    $scope.groupsListForLecturers = [];
    $scope.coursesListForLecturers = [];
    $scope.disciplinesListForLecturers = [];

    $scope.errorMessageStudents = '';
    $scope.loaderStudentsResult = false;
    $scope.getStudentsResult = false;

    $scope.setPill = function (newPill) {
      $scope.pill = newPill;
    };

    $scope.isSet = function (pillNum) {
      return $scope.pill === pillNum;
    };

    function loadStudyYears() {
      var url = 'Attestation/studyYear';
      Api.execute("GET", url)
        .then(function (response) {
            $scope.studyYears = response;
          },
          function () {
            $scope.errorMessageYears = "Не вдалося завантажити список навчальних років";
            $scope.studyYears = null;
          });
    }

    function loadAttestations() {
      var url = 'Attestation';
      Api.execute("GET", url)
        .then(function (response) {
            $scope.attestations = response;
          },
          function () {
            $scope.errorMessageAttests = "Не вдалося завантажити список атестацій";
            $scope.attestations = null;
          });
    }

    function DisciplinesTeachersModel(disciplineName, teacherName) {
      this.disciplineFullName = disciplineName;
      this.teacherName = teacherName;
    }

    $scope.getDisciplineName = function (name) {
      var result = name.split(",");
      return result[0];
    };

    function getStudentsAndDisciplinesLists(response) {
      var allDisciplinesList = [];
      var allStudentsList = [];

      for (var i = 0; i < response.length; i++) {
        allDisciplinesList.push(
          new DisciplinesTeachersModel(
            response[i].rnpRow.name,
            response[i].lecturer.name
          )
        );
        allStudentsList.push(response[i].student.name);
      }

      $scope.disciplinesListForGroups = uniqueLoadGroupsResultElements(allDisciplinesList);
      $scope.studentsList = uniqueElements(allStudentsList);
    }

    function getGroupsList(response) {
      var allGroupsList = [];

      for (var i = 0; i < response.length; i++) {
        allGroupsList.push(response[i].studyGroup.name);
      }

      $scope.groupsListForLecturers = uniqueElements(allGroupsList);
    }

    function getCoursesList(response) {
      var allCoursesList = [];

      for (var i = 0; i < response.length; i++) {
        allCoursesList.push(response[i].course);
      }

      $scope.coursesListForLecturers = uniqueElements(allCoursesList);
    }

    function getDisciplinesList(response) {
      var allDisciplinesList = [];

      for (var i = 0; i < response.length; i++) {
        var result = response[i].rnpRow.name.split(",");
        allDisciplinesList.push(result[0]);
      }

      $scope.disciplinesListForLecturers = uniqueElements(allDisciplinesList);
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

    // sort response in this order:
    // 1 - by student name 2 - by discipline name
    function sortRuleForGroupsResult(a, b) {
      var name1 = a.student.name;
      var name2 = b.student.name;

      var disc1 = a.rnpRow.name;
      var disc2 = b.rnpRow.name;

      return name1.localeCompare(name2) || disc1.localeCompare(disc2);
    }

    // sort response in this order:
    // 1 - by course 2 - by discipline name
    // 3 - by study group name 4 - by student name
    function sortRuleForLecturersResult(a, b) {
      var course1 = + (a.course);
      var course2 = + (b.course);

      var disc1 = a.rnpRow.name;
      var disc2 = b.rnpRow.name;

      var group1 = a.studyGroup.name;
      var group2 = b.studyGroup.name;

      var student1 = a.student.name;
      var student2 = b.student.name;

      return course1 - course2 || disc1.localeCompare(disc2) ||
        group1.localeCompare(group2) || student1.localeCompare(student2);
    }

    // sort response in this order:
    // 1 - by disciplines name
    function sortStudentsResults(a, b) {
      var name1 = a.rnpRow.name;
      var name2 = b.rnpRow.name;

      return name1.localeCompare(name2) || disc1.localeCompare(disc2);
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

    $scope.loadGroups = function (namePattern, year) {
      if (namePattern.length > 1) {
        var url = 'Attestation/group/find/' + namePattern + '/year/' + year;
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
      $scope.loaderGroupsResult = true;
      var url = 'Attestation/group/' + rtStudyGroupId + '/period/' + cAttestationPeriodId + '/result';
      Api.execute("GET", url)
        .then(function (response) {
            $scope.errorLoadGroupsResult = "";
            $scope.GroupsResult = response.sort(sortRuleForGroupsResult);
            getStudentsAndDisciplinesLists(response);
            $scope.getGroupsResults = true;
            $scope.loaderGroupsResult = false;
          },
          function () {
            $scope.errorLoadGroupsResult = "Не вдалося завантажити результати для даної групи";
            $scope.GroupsResult = null;
            $scope.loaderGroupsResult = false;
          });
    };

    $scope.loadLecturers = function (namePattern) {
      if (namePattern.length > 2) {
        var url = 'Attestation/lecturer/find/' + namePattern;
        // url + namePattern (3 first symbol of group)
        Api.execute("GET", url)
          .then(function (response) {
              $scope.errorMessageLecturers = "";
              $scope.lecturersList = response;
            },
            function () {
              $scope.errorMessageLecturers = "Не вдалося завантажити список груп";
              $scope.lecturersList = null;
            });
      }
      else {
        $scope.errorMessageLecturers = "Введіть більше 3-х символів для пошуку групи";
      }
    };

    $scope.loadLecturersResult = function (eEmployees1Id, cAttestationPeriodId) {
      var url = 'Attestation/lecturer/' + eEmployees1Id + '/period/' + cAttestationPeriodId + '/result';
      Api.execute("GET", url)
        .then(function (response) {
            var sortedResponse = response.sort(sortRuleForLecturersResult);
            getGroupsList(sortedResponse);
            getCoursesList(sortedResponse);
            getDisciplinesList(sortedResponse);
            $scope.errorLecturersResult = "";
            $scope.getLecturersResults = true;
            $scope.lecturersResult = sortedResponse;
          },
          function () {
            $scope.errorLecturersResult = "Не вдалося завантажити результати для даного викладача";
            $scope.lecturersResult = null;
            $scope.getLecturersResults = false;
          });
    };

    $scope.loadStudents = function (namePattern) {
      if (namePattern.length > 2) {
        var url = 'Attestation/student/find/' + namePattern;
        // url + namePattern (3 first symbol of group)
        Api.execute("GET", url)
          .then(function (response) {
              $scope.errorMessageStudents = "";
              $scope.students = response;
            },
            function () {
              $scope.errorMessageStudents = "Не вдалося завантажити список груп";
              $scope.students = null;
            });
      }
      else {
        $scope.errorMessageStudents = "Введіть більше 3-х символів для пошуку групи";
      }
    };

    $scope.loadStudentsResult = function (sPersonalityId, cAttestationPeriodId) {
      $scope.loaderStudentsResult = true;
      var url = 'Attestation/student/' + sPersonalityId + '/period/' + cAttestationPeriodId + '/result';
      Api.execute("GET", url)
        .then(function (response) {
            $scope.getStudentsResult = true;
            $scope.studentsResult = response.sort(sortStudentsResults);
            $scope.loaderStudentsResult = false;
          },
          function () {
            $scope.studentsResult = null;
            $scope.loaderStudentsResult = false;
          });
    };

    loadStudyYears();
    loadAttestations();

  }]);
