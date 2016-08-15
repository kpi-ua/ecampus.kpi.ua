'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:VotingProfileCtrl
 * @description
 * # VotingProfileCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
    .controller('VotingProfileCtrl', function($scope, $location, $routeParams, Api) {

        $scope.currentUser = null;
        $scope.criterions = [];

        $scope.course = null;

        $scope.selectedEmployeeId = null;

        function reload() {

            $scope.currentUser = Api.getCurrentUser();
            $scope.selectedEmployeeId = $routeParams.id;

            if (!$scope.currentUser) {
                $location.path("/login");
            }

            Api.execute("GET", "Vote/Criterions").then(function(data) {
                $scope.criterions = data;
                $scope.$apply();
            });

        }

        $scope.vote = function() {
            debugger;
            $scope.criterions.forEach(function(c) {

                //debugger;

                var vote = {
                    VoteTermId: 1,
                    EmployeeId: $scope.selectedEmployeeId,
                    DateVote: new Date(),
                    Actuality: true,
                    ChangeDate: new Date(),
                    PersonalityId: $scope.currentUser.Id,
                    VoteCriterionId: c.id,
                    Course: $scope.course,
                    Mark: c.mark,
                };

                Api.execute("POST", "Vote/Marks").then(function(data) {
                    $scope.criterions = data;
                    $scope.$apply();
                });

            });

        };

        reload();

    });