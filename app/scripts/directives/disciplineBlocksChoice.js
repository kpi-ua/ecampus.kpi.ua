(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name ecampusApp.directive:disciplinesBlocksChoice
   * @description
   * # disciplineBlocksChoice
   */
  angular.module('ecampusApp')
    .directive('disciplineBlocksChoice', disciplineBlocksChoice);

  function disciplineBlocksChoice() {
    return {
      templateUrl: 'views/directives/disciplineBlocksChoice.html',
      restrict: 'E',
      link: postLink
    };

    function filterSemesters(response, currentSemester) {
      return response.map(function (responseElement) {
        var responseSemester = responseElement.semester;

        if (responseSemester === currentSemester) {
          return Object.assign({}, responseElement, {
            blocks: []
          });
        }
      });
    }

    function filterDisciplines(response, arrayValue) {
      return Object.assign({}, response, {
        blockDisc: response.blockDisc.filter(function (blockDiscElement) {
          for (var i = 0; i < arrayValue.length; i++) {
            var disciplineId = blockDiscElement.cDisciplineBlockYear8Id;
            var selectedDisciplineId = arrayValue[i].id;

            if (disciplineId === selectedDisciplineId) {
              return blockDiscElement;
            }
          }
        })
      });
    }

    function removeFilteredValue(result, value) {
      return result.filter(function (element) {
        return element !== value;
      })[0];
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

    function postLink(scope, element, attrs) {
      scope.course = scope[attrs['course']];
      scope.studyYear = scope[attrs['year']];

      scope.isDisabledChoiceButton = function (block) {
        var selected = block.selectedDiscipline;
        var count = block.disciplineCount;

        return (
          selected.length !== count ||
          selected.id === null ||
          selected.length === 0
        );
      };

      scope.addBlock = function (courseElement, course, block) {
        var filteredSemester = filterSemesters(course, courseElement.semester);
        var filteredDisciplines = filterDisciplines(block, block.selectedDiscipline);

        block.isSelected = true;
        courseElement.payload = removeFilteredValue(filteredSemester, undefined);
        courseElement.block.push(filteredDisciplines);
        courseElement.payload.blocks = uniqueBlocks(courseElement.block);
      };

      scope.removeCheckedItems = function(block) {
        block.selectedDiscipline = [];
      };

      scope.clearPayloadInfo = function(courseElement, block) {
        block.isSelected = false;
        courseElement.payload = [];
        courseElement.block = [];
        courseElement.payload.blocks = [];
      };

    }

  }
})();
