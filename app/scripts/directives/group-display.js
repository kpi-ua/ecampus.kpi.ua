'use strict';

angular
  .module('ecampusApp')
  .directive('groupDisplay', groupDisplay);

function groupDisplay() {
  return {
    templateUrl: 'views/directives/group-display.html',
    restrict: 'E',
    link: function(scope, element, attrs) {
      scope.data = scope[attrs['group']];
    }
  };
}
