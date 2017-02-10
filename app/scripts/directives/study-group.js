'use strict';

/**
 * @ngdoc directive
 * @name ecampusApp.directive: study group
 * @description
 * # discipline-specialization page
 *          for section study-group
 */

angular
  .module('ecampusApp')
  .directive('studyGroup', handler);

function handler() {
  return {
    restrict: 'A',
    templateUrl: 'views/directives/study-group.html'
  };
}
