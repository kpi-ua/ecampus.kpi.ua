'use strict';

angular.module('ecampusApp')
  .directive('tableChoiceResult', function() {
    return {
      restrict: 'A',
      // templateUrl: 'views/directives/table-choice-result-old.html'
      templateUrl: 'views/directives/table-choice-result.html'
    };
  });
