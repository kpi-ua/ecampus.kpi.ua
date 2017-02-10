'use strict';

/**
 * @ngdoc directive
 * @name ecampusApp.directive: patternImplementation
 * @description
 * # discipline-specialization page
 *          for section apply
 */
angular
  .module('ecampusApp')
  .directive('patternImplementation', handler);

function handler() {
  return {
    restrict: 'A',
    templateUrl: 'views/directives/pattern-implementation.html'
  };
}
