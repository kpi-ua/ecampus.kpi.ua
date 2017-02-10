'use strict';

angular
  .module('ecampusApp')
  .directive('chosen', handler);

function handler() {
  var linker = function(scope, element, attr) {
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
