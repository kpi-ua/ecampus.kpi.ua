'use strict';

/**
 * @ngdoc directive
 * @name ecampusApp.directive:header
 * @description
 * # header
 */
angular.module('ecampusApp')
    .directive('pageHeader', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: "views/directives/pageHeader.html",
            controller: ['$scope', 'Api', function($scope, Api) {
                $scope.userAuthenticated = false;
                $scope.userResp = false;

                var user = Api.getCurrentUser();
                if (!!user) {
                    $scope.userAuthenticated = true;
                }

                if ($scope.userAuthenticated) {
                    $scope.userName = user.name;
                    $scope.userImage = Api.getApiEndpoint() + "/Account/" + user.id + "/ProfileImage";
                }

                var decodedToken = jwt_decode(Api.getToken())
                if (decodedToken.resp) {
                    $scope.userResp = true;
                }
            }]
        };
    });