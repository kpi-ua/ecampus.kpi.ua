'use strict';

/**
 * @ngdoc directive
 * @name ecampusApp.directive:toggle
 * @description
 * # toggle
 */
angular.module('ecampusApp')
  .directive('toggle', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        if (attrs.toggle === "tooltip") {
          element.tooltip();
        }
      }
    };
  });