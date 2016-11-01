'use strict';

/**
 * @ngdoc directive
 * @name ecampusApp.directive:header
 * @description
 * # header
 */
angular.module('ecampusApp')
    .directive('navigation', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: "views/directives/navigation.html",
            controller: ['$scope', 'Api', function($scope, Api) {
                $scope.userAuthenticated = false;
                $scope.user = null;

                var user = Api.getCurrentUser();
                $scope.user = user;

                if (!!user) {
                    $scope.userAuthenticated = true;
                }

                if ($scope.userAuthenticated) {
                    $scope.userName = user.name;
                    $scope.userImage = Api.getApiEndpoint() + "/Account/" + user.id + "/ProfileImage";
                }
            }]
        };
    });