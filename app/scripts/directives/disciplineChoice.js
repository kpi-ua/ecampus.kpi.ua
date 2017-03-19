(function() {
'use strict';

/**
 * @ngdoc directive
 * @name ecampusApp.directive:DisciplineChoice
 * @description
 * # DisciplineChoice
 */
angular.module('ecampusApp')
  .directive('disciplineChoice', disciplineChoice);

  function disciplineChoice() {
    return {
      templateUrl: 'views/directives/disciplineChoice.html',
      restrict: 'E',
      link: postLink
    };
  }

  function postLink(scope, element, attrs) {
    scope.block = scope[attrs['block']];
    scope.course = scope[attrs['course']];
    scope.selectedForInfo = {'cDisciplineBlockYear8Id': null};

    scope.isDisciplinesSelected = function(object) {
      return Object.keys(object).some(function(key) {
        return object[key];
      });
    };

    scope.toggleDisciplineDescription = function(id) {
      scope.selectedForInfo.cDisciplineBlockYear8Id = (
        scope.selectedForInfo.cDisciplineBlockYear8Id === null ||
        scope.selectedForInfo.cDisciplineBlockYear8Id !== id ? id : null
      );
    };

    scope.calculatePercent = function(currentDiscipline) {
      var currentStudentCount = + (currentDiscipline.studentCount);
      var maxStudentCount = + (currentDiscipline.maxCountStudent);

      return (
        (currentStudentCount/maxStudentCount)*100
      )
    };
  }

})();
