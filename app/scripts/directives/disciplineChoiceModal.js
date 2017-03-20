(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name ecampusApp.directive:disciplineChoiceModal
   * @description
   * # disciplineChoiceModal
   */
  angular.module('ecampusApp')
    .directive('disciplineChoiceModal', disciplineChoiceModal);

  function disciplineChoiceModal() {
    return {
      templateUrl: 'views/directives/disciplineChoiceModal.html',
      restrict: 'E',
      link: postLink
    }
  }

  function postLink(scope, element, attrs) {
    scope.course = scope[attrs['course']];
    scope.index = scope[attrs['index']];

    scope.deleteAdditionalProperties = function(object) {
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
  }

})();
