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
  .directive('studyGroup', studyGroup);

function studyGroup() {
  return {
    restrict: 'A',
    templateUrl: 'views/directives/study-group.html'
  };
}
