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

        $scope.selectedEmploye = null;
        $scope.selectedEmployeId = null;


        function reload() {

            $scope.currentUser = Api.getCurrentUser();
            $scope.selectedEmployeId = $routeParams.id;

            if (!$scope.currentUser) {
                $location.path("/");
            }

            Api.execute("GET", "Account/Employee/" + $scope.selectedEmployeId).then(function(data) {
                $scope.selectedEmploye = data;
            });


            Api.execute("GET", "Vote/Criterions").then(function(data) {
                $scope.criterions = data;
            });

        }

        $scope.formIsValid = function() {
            var result = true;

            if (!$scope.criterions) {
                return false;
            }

            $scope.criterions.forEach(function(c) {
                if (!c.mark || c.mark == 0) {
                    result = false;
                }
            });

            return result;
        }

        $scope.vote = function() {

            var votes = [];

            $scope.criterions.forEach(function(c) {

                var vote = {
                    VoteTermId: 1,
                    EmployeeId: $scope.selectedEmployeId,
                    DateVote: new Date(),
                    Actuality: true,
                    ChangeDate: new Date(),
                    PersonalityId: $scope.currentUser.Id,
                    VoteCriterionId: c.id,
                    Course: 1,
                    Mark: c.mark,
                };

                votes.push(vote);
            });

            Api.execute("POST", "Vote", votes).then(function() {
                alert('Дякуємо!');
                $location.path("/voting");
            }).catch(function(reason) {
                alert(reason.responseText);
            });

        };

        reload();

    });
