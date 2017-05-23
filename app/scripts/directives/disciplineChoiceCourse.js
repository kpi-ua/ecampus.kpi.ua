(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name ecampusApp.directive:disciplineChoiceCourse
   * @description
   * # disciplineChoiceCourse
   */
  angular.module('ecampusApp')
    .directive('disciplineChoiceCourse', disciplineChoiceCourse);

  function disciplineChoiceCourse() {
    return {
      templateUrl: 'views/directives/disciplineChoiceCourse.html',
      restrict: 'E',
      scope: {
        studyCourse: '=studyCourse'
      },
      link: postLink
    };


    function postLink(scope, element, attrs) {
      scope.translateStatus = function (englishStatus) {
        switch (englishStatus) {
          case 'not available':
            return 'вибір не доступний';
          case 'available':
            return 'вибір доступний';
          case 'done':
            return 'вибір здійснено';
        }
      };

      scope.countSelectedDiscipline = function(response) {
        var i, res, result = 0;

        for (i = 0; i < response.blocks.length; i++) {
          res = response.blocks[i].selectedDiscipline;
          if (res.id !== null) {
            result++;
          }
        }
        return result;
      };

      scope.isDisabledSaveButton = function(semester, length) {
        var className = "btn-cancel-" + semester + "-";

        for (var i = 0; i < length; i++) {
          var button = document.getElementsByClassName(className + i);
          var isFirstButtonDisabled = button[0].disabled;

          if (isFirstButtonDisabled) {
            return true;
          }
        }
        return false;
      };
    }

  }

})();
