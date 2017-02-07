'use strict';

/**
 * @ngdoc directive
 * @name ecampusApp.directive:breadcrumbs
 * @description
 * # breadcrumbs
 */
angular.module('ecampusApp')
  .directive('breadcrumbs', function() {
    return {
      templateUrl: 'views/directives/breadcrumbs.html',
      restrict: 'E',
      transclude: true,
      link: function postLink(scope, element, attrs) {

      }
    };
  });
