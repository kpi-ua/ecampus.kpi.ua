'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:DisciplinesChoiceCtrl
 * @description
 * # DisciplinesChoiceCtrl
 * Controller of the ecampusApp
 */
angular
  .module('ecampusApp')
  .controller('DisciplineChoiceStudentCtrl', DisciplineChoiceStudentCtrl);

DisciplineChoiceStudentCtrl.$inject = ['$scope', 'api'];

function DisciplineChoiceStudentCtrl($scope, api) {
  $scope.selectedForInfo = {'cDisciplineBlockYear8Id': null};
  $scope.errorMessage = '';
  $scope.hideInfo = false;
  $scope.errorMessageDisc = '';
  $scope.hideInfoDisc = false;

  $scope.setTab = function(newTab) {
    $scope.tab = newTab;
  };

  $scope.isSet = function(tabNum) {
    return $scope.tab === tabNum;
  };

  $scope.translateStatus = function(englishStatus) {
    switch (englishStatus) {
      case 'not available': return 'вибір не доступний';
      case 'available': return 'вибір доступний';
      case 'done': return 'вибір здійснено';
    }
  };

  $scope.getStudyCoursesWithYears = function(yearIntake) {
    return {
      firstCourse: yearIntake + '-' + (1 + yearIntake),
      secondCourse: (1 + yearIntake) + '-' + (2 + yearIntake),
      thirdCourse: (2 + yearIntake) + '-' + (3 + yearIntake),
      fourthCourse: (3 + yearIntake) + '-' + (4 + yearIntake),
      fifthCourse: (4 + yearIntake) + '-' + (5 + yearIntake),
      sixthCourse: (5 + yearIntake) + '-' + (6 + yearIntake)
    };
  };

  function getCurrStudyYear(yearIntake, studyCourse) {
    var startYear = yearIntake + studyCourse - 1;
    var endYear = yearIntake + studyCourse;
    return startYear + '-' + endYear;
  }

  function loadInfo() {
    var url = 'Account/student/group';

    api.execute('GET', url)
      .then(function(response) {
        $scope.info = response[0];
        $scope.info.currentStudyYear = getCurrStudyYear(
          +response[0].yearIntake,
          +response[0].studyCourse
        );
        $scope.tab = +response[0].studyCourse;
      });
  }

  function loadDisciplines() {
    var url = 'SelectiveDiscipline/semesters/disciplines';

    api.execute('GET', url).then(function(response) {
      $scope.firstCourse = [];
      $scope.secondCourse = [];
      $scope.thirdCourse = [];
      $scope.fourthCourse = [];
      var i, j, res, resBlocks;
      for (i = 0; i < response.length; i++) {
        res = response[i];
        res['payload'] = {};
        res['block'] = [];
        for (j = 0; j < res.blocks.length; j++) {
          resBlocks = res.blocks[j];
          resBlocks['selectedDiscipline'] = {
            id: null,
            name: null
          };
        }
        switch (res.course) {
          case 1: $scope.firstCourse.push(res); break;
          case 2: $scope.secondCourse.push(res); break;
          case 3: $scope.thirdCourse.push(res); break;
          case 4: $scope.fourthCourse.push(res); break;
        }
      }
    });
  }

  $scope.isDisciplinesSelected = function(object) {
    return Object.keys(object).some(function(key) {
      return object[key];
    });
  };

  $scope.toggleDisciplineDescription = function(id) {
    $scope.selectedForInfo.cDisciplineBlockYear8Id = (
      $scope.selectedForInfo.cDisciplineBlockYear8Id === null ||
      $scope.selectedForInfo.cDisciplineBlockYear8Id !== id ? id : null
    );
  };

  $scope.countSelectedDiscipline = function(response) {
    var i, res, result = 0;
    for (i = 0; i < response.blocks.length; i++) {
      res = response.blocks[i].selectedDiscipline;
      if (res.id !== null) {
        result++;
      }
    }
    return result;
  };

  function removeFilteredValue(result, value) {
    return result.filter(function(element) {
      return element !== value;
    })[0];
  }

  function filterDisciplines(response, arrayValue) {
    return Object.assign({}, response, {
      blockDisc: response.blockDisc.filter(function (blockDiscElement) {
        for (var i = 0; i < arrayValue.length; i++) {
          if (blockDiscElement.cDisciplineBlockYear8Id === arrayValue[i].id) {
            return blockDiscElement;
          }
        }
      })
    });
  }

  function filterSemesters(response, semester) {
    return response.map(function(responseElement) {
      if (responseElement.semester === semester) {
        return Object.assign({}, responseElement, {
          blocks: []
        });
      }
    });
  }

  function uniqueBlocks(array) {
    var result = [];

    nextInput:
      for (var i = 0; i < array.length; i++) {
        var str = array[i];
        for (var j = 0; j < result.length; j++) {
          if (
            JSON.stringify(str) === JSON.stringify(array[j])
          ) {
            continue nextInput;
          }
        }
        result.push(str);
      }
    return result;
  }

  $scope.deleteAdditionalProperties = function(object) {
    var result = object;
    delete result.payload;
    delete result.block;
    delete result.saveChoiceResult;
    for (var i = 0; i < result.blocks.length; i++) {
      var block = result.blocks[i];
      delete block.selectedDiscipline;
    }
    return result;
  };

  $scope.saveDisciplinesChoice = function(payload, semester) {
    var url = 'SelectiveDiscipline/semesters/disciplines';

    api.execute('POST', url, payload)
      .then(function(response) {
        semester.saveChoiceResult = response;
    });
  };

  $scope.isDisabledSaveButton = function(semester, length) {
    var className = "btn-save-choice-result-" + semester + "-";
    for (var i = 0; i < length; i++) {
      var button = document.getElementsByClassName(className + i);
      var isFirstButtonDisabled = button[0].disabled;
      if (isFirstButtonDisabled) {
        return true;
      }
    }
    return false;
  };

  $scope.isDisabledChoiceButton = function(block) {
    var selected = block.selectedDiscipline;
    var count = block.disciplineCount;

    return (
      selected.length > count ||
      selected.id === null ||
      selected.length === 0
    );
  };

  $scope.addBlock = function(courseElement, course, block) {
    var filteredSemester = filterSemesters(course, courseElement.semester);
    var filteredDisciplines = filterDisciplines(block, block.selectedDiscipline);

    courseElement.payload = removeFilteredValue(filteredSemester, undefined);
    courseElement.block.push(filteredDisciplines);
    courseElement.payload.blocks = uniqueBlocks(courseElement.block);
  };

  loadInfo();
  loadDisciplines();
}
