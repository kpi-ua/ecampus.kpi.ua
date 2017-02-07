'use strict';

angular.module('ecampusApp').directive('rnpRowsDisplay', function() {
  return {
    templateUrl: 'views/directives/rnp-rows-display.html',
    restrict: 'E',
    link: function($scope, element, attr) {
      $scope.data = $scope[attr['rows']];
      var watch = attr['rows'];
      $scope.$watch(watch, function() {
        $scope.data = $scope[attr['rows']];
      });
    }
  };
});
