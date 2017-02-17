'use strict';

angular
  .module('ecampusApp')
  .directive('groupDisplay', groupDisplay);

function groupDisplay() {
  return {
    templateUrl: 'views/directives/groupDisplay.html',
    restrict: 'E',
    link: link
  };
  function link(scope, element, attrs) {
    scope.data = scope[attrs['group']];
  }
}
