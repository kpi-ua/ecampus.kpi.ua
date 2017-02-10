'use strict';

/**
 * @ngdoc directive
 * @name ecampusApp.directive:breadcrumbs
 * @description
 * # breadcrumbs
 */
angular
  .module('ecampusApp')
  .directive('breadcrumbs', breadcrumbs);

function breadcrumbs() {
  return {
    templateUrl: 'views/directives/breadcrumbs.html',
    restrict: 'E',
    transclude: true,
    link: function postLink(scope, element, attrs) {
      //
    }
  };
}
