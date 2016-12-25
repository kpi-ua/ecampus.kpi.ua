'use strict';

/**
 * @ngdoc directive
 * @name ecampusApp.directive: study group
 * @description
 * # discipline-specialization page
 *          for section study-group
 */

angular.module('ecampusApp')
    .directive('studyGroup',function () {
        return {
            restrict: "A",
            templateUrl: "views/directives/study-group.html"
        }
    });