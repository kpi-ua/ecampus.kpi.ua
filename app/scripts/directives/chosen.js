'use strict';

/**
 * chosen
 * AngularJS directive for chosen controls
 * https://github.com/vitalets/checklist-model
 * License: MIT http://opensource.org/licenses/MIT
 */

angular
  .module('ecampusApp')
  .directive('chosen', chosen);

function chosen() {
  var linker = function(scope, element) {
    scope.$watch('allSubdivisions', function() {
      element.trigger('chosen:updated');
    });
    element.chosen({ width: '100%' });
  };
  return {
    restrict: 'A',
    link: linker
  };
}
