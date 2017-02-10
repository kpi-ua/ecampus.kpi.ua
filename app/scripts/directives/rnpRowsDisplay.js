'use strict';

angular
  .module('ecampusApp')
  .directive('rnpRowsDisplay', rnpRowsDisplay);

function rnpRowsDisplay() {
  return {
    templateUrl: 'views/directives/rnpRowsDisplay.html',
    restrict: 'E',
    link: function($scope, element, attr) {
      $scope.data = $scope[attr['rows']];
      var watch = attr['rows'];
      $scope.$watch(watch, function() {
        $scope.data = $scope[attr['rows']];
      });
    }
  };
}
