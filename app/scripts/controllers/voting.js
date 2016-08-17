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
                $location.path("/login");
            }

            Api.execute("GET", "Vote/Term/Current").then(function(data) {
                $scope.voteTerm = !!data && data.length > 0 ? data[0] : null;

                if (!$scope.voteTerm) {
                    //Voting is closed
                }

                getAllPersons();
                getAlreadyVotedPersons();

            });

            function getAllPersons() {
                var action = "Vote/Persons/" + $scope.currentUser.id;

                var payload = {
                    page: 1,
                    size: 100,
                    envelope: false
                };

                Api.execute("GET", action, payload).then(function(data) {
                    $scope.personsForVote = data;
                    $scope.$apply();

                    console.log('$scope.personsForVote', $scope.personsForVote);
                });
            }

            function getAlreadyVotedPersons() {

                var action = "Vote/Persons/" + $scope.currentUser.id + "/Voted";

                var payload = {
                    voteTermId: $scope.voteTerm.id,
                    page: 1,
                    size: 100,
                    envelope: false
                };
                Api.execute("GET", action, payload).then(function(data) {
                    $scope.personsAlreadyVoted = data;
                    $scope.$apply();
                    console.log('$scope.personsAlreadyVoted', $scope.personsAlreadyVoted);
                });

            }

        }

        reload();

    });