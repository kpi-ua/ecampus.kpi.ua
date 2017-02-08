'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:AttestationCtrl
 * @description
 * # AttestationCtrl
 * Controller of the ecampusApp
 */
angular
  .module('ecampusApp')
  .controller('AttestationCtrl', ['$scope', 'api', handler]);

function handler($scope, api) {
  $scope.errorMessageYears = '';
  $scope.errorMessageAttests = '';
  $scope.errorMessageGroups = '';

  function initAttestationPeriodId() {
    $scope.attestationPeriodId = 'not get';
  }

  $scope.errorLoadGroupsResult = '';

  function initGroupsResult() {
    $scope.getGroupsResults = false;
    $scope.disciplinesListForGroups = [];
    $scope.groupsResult = [];
  }

  $scope.errorMessageLecturers = '';

  function initLecturersResult() {
    $scope.getLecturersResults = false;
    $scope.groupsListForLecturers = [];
    $scope.coursesListForLecturers = [];
    $scope.disciplinesListForLecturers = [];
  }

  $scope.errorMessageStudents = '';
  function initStudentsResult() {
    $scope.getStudentsResult = false;
    $scope.studentsResult = [];
  }

  $scope.setPill = function(newPill) {
    $scope.pill = newPill;
  };

  $scope.isSet = function(pillNum) {
    return $scope.pill === pillNum;
  };

  function setCurrentStudyYear(response) {
    for (var i = 0; i < response.length; i++) {
      var current = response[i];
      if (current.isActual) {
        return current;
      }
    }
  }

  function loadStudyYears() {
    var url = 'Attestation/studyYear';
    api.execute('GET', url)
      .then(function(response) {
        $scope.studyYears = response;
        $scope.studyYears.selected = setCurrentStudyYear(response);
      },
        function() {
          $scope.errorMessageYears = (
            'Не вдалося завантажити список навчальних років'
          );
          $scope.studyYears = null;
        });
  }

  function getCurrentStudySemester() {
    var currentStudySemester = 0;
    var currentDate = new Date();
    var month = currentDate.getMonth();
    if (month >= 8 && month <= 11) {
      currentStudySemester = 1;
    } else {
      currentStudySemester = 2;
    }
    return currentStudySemester;
  }

  function setCurrentStudySemester(response) {
    var currentStudySemester = getCurrentStudySemester();
    if (currentStudySemester !== 0) {
      for (var i = 0; i < response.length; i++) {
        var current = response[i];
        if (current.id === currentStudySemester) {
          return current;
        }
      }
    }
  }

  function loadSemesters() {
    $scope.studySemesters = [
      { id: 1, name: 'Перший семестр' },
      { id: 2, name: 'Другий семестр' }
    ];
    $scope.studySemesters.selected = setCurrentStudySemester(
      $scope.studySemesters
    );
  }

  // 1 period - (7 - 9) study year week
  // 2 period - (13 - 15) study year week
  function getCurrentStudyAttestationPeriod() {
    Date.prototype.getWeek = function() {
      var date = new Date(this.getTime());
      date.setHours(0, 0, 0, 0);
      // Thursday in current week decides the year.
      date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
      // January 4 is always in week 1.
      var week1 = new Date(date.getFullYear(), 0, 4);
      // Adjust to Thursday in week 1 and
      // count number of weeks from date to week1.
      return (
        1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 -
        3 + (week1.getDay() + 6) % 7) / 7)
      );
    };

    var currentStudyAttestationPeriod = 'не визначено';
    var currentDate = new Date();
    var week = currentDate.getWeek();

    if ((week >= 42 && week <= 44) || (week >= 12 && week <= 14)) {
      currentStudyAttestationPeriod = 'Атестація №1';
    } else if ((week >= 48 && week <= 50) || (week >= 18 && week <= 20)) {
      currentStudyAttestationPeriod = 'Атестація №2';
    }
    return currentStudyAttestationPeriod;
  }

  function setCurrentStudyAttestationPeriod(response) {
    var currentStudyAttestationPeriod = getCurrentStudyAttestationPeriod();
    if (currentStudyAttestationPeriod !== 0) {
      for (var i = 0; i < response.length; i++) {
        var current = response[i];
        if (current.name === currentStudyAttestationPeriod) {
          return current;
        }
      }
    }
  }

  function loadAttestations() {
    var url = 'Attestation';
    api.execute('GET', url)
      .then(function(response) {
        $scope.studyAttestationPeriod = response;
        $scope.studyAttestationPeriod.selected = (
          setCurrentStudyAttestationPeriod(response)
        );
      },
      function() {
        $scope.errorMessageAttests = 'Не вдалося завантажити список атестацій';
        $scope.attestations = null;
      });
  }

  function DisciplinesTeachersModel(disciplineName, teacherName) {
    this.disciplineFullName = disciplineName;
    this.teacherName = teacherName;
  }

  $scope.getDisciplineName = function(name) {
    var result = name.split(',');
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

    $scope.disciplinesListForGroups = uniqueLoadGroupsResultElements(
      allDisciplinesList
    );
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
      var result = response[i].rnpRow.name.split(',');
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
          if (
            (result[j].disciplineFullName === str.disciplineFullName) &&
            (result[j].teacherName === str.teacherName) &&
            (result[j].disciplineShortName === str.disciplineShortName)
          ) {
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
    var course1 = +(a.course);
    var course2 = +(b.course);

    var disc1 = a.rnpRow.name;
    var disc2 = b.rnpRow.name;

    var group1 = a.studyGroup.name;
    var group2 = b.studyGroup.name;

    var student1 = a.student.name;
    var student2 = b.student.name;

    return (
      course1 - course2 || disc1.localeCompare(disc2) ||
      group1.localeCompare(group2) || student1.localeCompare(student2)
    );
  }

  // sort response in this order:
  // 1 - by disciplines name
  function sortStudentsResults(a, b) {
    var name1 = a.rnpRow.name;
    var name2 = b.rnpRow.name;

    return name1.localeCompare(name2);
  }

  function generateUrlForAttestPeriod(year, semester, attestNum) {
    return (
      'Attestation/period?dcStudingYearId=' + year +
      '&semesterYear=' + semester + '&dcLoadId=' + attestNum
    );
  }

  $scope.getAttestationPeriodId = function(
    dcStudingYearId,
    semesterYear,
    dcLoadId
  ) {
    var url = generateUrlForAttestPeriod(
      dcStudingYearId,
      semesterYear,
      dcLoadId
    );
    api.execute('GET', url)
      .then(function(response) {
        if (response) {
          $scope.attestationPeriodId = +response;
        } else {
          $scope.attestationPeriodId = null;
        }
      });
  };

  $scope.clearAttestationPeriodId = function() {
    initAttestationPeriodId();
  };

  $scope.loadGroups = function(namePattern, year) {
    if (namePattern.length > 1) {
      var url = 'Attestation/group/find/' + namePattern + '/year/' + year;
      // url + namePattern (2 first symbol of group)
      api.execute('GET', url)
        .then(function(response) {
          $scope.errorMessageGroups = '';
          $scope.Groups = response;
        },
        function() {
          $scope.errorMessageGroups = 'Не вдалося завантажити список груп';
          $scope.Groups = null;
        });
    } else {
      $scope.errorMessageGroups = (
        'Введіть більше 2-х символів для пошуку групи'
      );
    }
  };

  $scope.loadGroupsResult = function(rtStudyGroupId, cAttestationPeriodId) {
    initGroupsResult();
    var url = (
      'Attestation/group/' + rtStudyGroupId + '/period/' +
      cAttestationPeriodId + '/result'
    );
    api.execute('GET', url)
      .then(function(response) {
        $scope.errorLoadGroupsResult = '';
        $scope.groupsResult = response.sort(sortRuleForGroupsResult);
        getStudentsAndDisciplinesLists(response);
        $scope.getGroupsResults = true;
      },
      function() {
        $scope.errorLoadGroupsResult = (
          'Не вдалося завантажити результати для даної групи'
        );
        $scope.groupsResult = null;
      });
  };

  $scope.clearGroupsResult = function() {
    initGroupsResult();
  };

  $scope.loadLecturers = function(namePattern) {
    if (namePattern.length > 2) {
      var url = 'Attestation/lecturer/find/' + namePattern;
      // url + namePattern (3 first symbol of group)
      api.execute('GET', url)
        .then(function(response) {
          $scope.errorMessageLecturers = '';
          $scope.lecturersList = response;
        },
        function() {
          $scope.errorMessageLecturers = 'Не вдалося завантажити список груп';
          $scope.lecturersList = null;
        });
    } else {
      $scope.errorMessageLecturers = (
        'Введіть більше 3-х символів для пошуку викладача'
      );
    }
  };

  $scope.loadLecturersResult = function(eEmployees1Id, cAttestationPeriodId) {
    initLecturersResult();
    var url = (
      'Attestation/lecturer/' + eEmployees1Id + '/period/' +
      cAttestationPeriodId + '/result'
    );
    api.execute('GET', url)
      .then(function(response) {
        var sortedResponse = response.sort(sortRuleForLecturersResult);
        getGroupsList(sortedResponse);
        getCoursesList(sortedResponse);
        getDisciplinesList(sortedResponse);
        $scope.errorLecturersResult = '';
        $scope.getLecturersResults = true;
        $scope.lecturersResult = sortedResponse;
      },
      function() {
        $scope.errorLecturersResult = (
          'Не вдалося завантажити результати для даного викладача'
        );
        $scope.lecturersResult = null;
        $scope.getLecturersResults = false;
      });
  };

  $scope.clearLecturersResult = function() {
    initLecturersResult();
  };

  $scope.loadStudents = function(namePattern) {
    if (namePattern.length > 2) {
      var url = 'Attestation/student/find/' + namePattern;
      // url + namePattern (3 first symbol of group)
      api.execute('GET', url)
        .then(function(response) {
          $scope.errorMessageStudents = '';
          $scope.students = response;
        },
        function() {
          $scope.errorMessageStudents = 'Не вдалося завантажити список груп';
          $scope.students = null;
        });
    } else {
      $scope.errorMessageStudents = (
        'Введіть більше 3-х символів для пошуку студента'
      );
    }
  };

  $scope.loadStudentsResult = function(sPersonalityId, cAttestationPeriodId) {
    initStudentsResult();
    var url = (
      'Attestation/student/' + sPersonalityId + '/period/' +
      cAttestationPeriodId + '/result'
    );
    api.execute('GET', url)
      .then(function(response) {
        $scope.getStudentsResult = true;
        $scope.studentsResult = response.sort(sortStudentsResults);
      },
      function() {
        $scope.studentsResult = null;
      });
  };

  $scope.clearStudentsResult = function() {
    initStudentsResult();
  };

  initAttestationPeriodId();
  loadStudyYears();
  loadSemesters();
  loadAttestations();

}
