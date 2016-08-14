'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:VotingCtrl
 * @description
 * # VotingCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
    .controller('VotingCtrl', function($scope, $location, Api) {

        $scope.currentUser = null;
        $scope.personsForVote = [];

        function reload() {

            $scope.currentUser = Api.getCurrentUser();

            if (!$scope.currentUser) {
                $location.path("/login.html");
            }

            var payload = {
                page: 1,
                size: 100,
                envelope: false
            };

            var action = "Vote/Persons/" + $scope.currentUser.id;

            Api.execute("GET", action, payload).then(function(data) {
                $scope.personsForVote = data;
                $scope.$apply();
            });
        }

        reload();

    });