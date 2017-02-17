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

  function loadInfo() {
    var url = '/Account/student/group';

    api.execute('GET', url)
      .then(function(response) {
        $scope.info = response[0];
        $scope.info.currentStudyYear = getCurrStudyYear(+response[0].yearIntake, +response[0].studyCourse);
        $scope.tab = +response[0].studyCourse;
      });
  }

  function getCurrStudyYear(yearIntake, studyCourse) {
    var startYear = yearIntake + studyCourse - 1;
    var endYear = yearIntake + studyCourse;

    return startYear + '-' + endYear;
  }

  function loadDisciplines() {
    var url = '/SelectiveDiscipline/semesters/disciplines';

    api.execute('GET', url).then(function(response) {
      $scope.firstCourse = [];
      $scope.secondCourse = [];
      $scope.thirdCourse = [];
      $scope.fourthCourse = [];
      for (var i = 0; i < response.length; i++) {
        for (var j = 0; j < response[i].blocks.length; j++) {
          response[i].blocks[j]['selectedDiscipline'] = {
            id: null,
            name: null
          };
        }
        switch (response[i].course) {
          case 1: $scope.firstCourse.push(response[i]); break;
          case 2: $scope.secondCourse.push(response[i]); break;
          case 3: $scope.thirdCourse.push(response[i]); break;
          case 4: $scope.fourthCourse.push(response[i]); break;
        }
      }
    });
  }

  $scope.isDisciplinesSelected = function (object) {
    return Object.keys(object).some(function (key) {
      return object[key];
    });
  };

  // TODO: Зробити димічне відображення інфи про предмети як у прикладі за посиланням
  // link: http://www.w3schools.com/angular/tryit.asp?filename=try_ng_form_radio

  loadInfo();
  loadDisciplines();
}
