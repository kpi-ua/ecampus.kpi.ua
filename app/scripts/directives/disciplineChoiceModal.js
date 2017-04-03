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

  disciplineChoiceModal.$inject = ['api'];

  function disciplineChoiceModal(api) {
    return {
      templateUrl: 'views/directives/disciplineChoiceModal.html',
      restrict: 'E',
      scope: {
        modalCourse: '=modalCourse',
        modalIndex: '=modalIndex'
      },
      link: postLink
    };

    function postLink(scope, element, attrs) {

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

      scope.saveDisciplinesChoice = function(payload, semester) {
        var url = 'SelectiveDiscipline/semesters/disciplines';

        api.execute('POST', url, payload)
          .then(function(response) {
            semester.saveChoiceResult = response;
          });
      };
    }

  }
})();
