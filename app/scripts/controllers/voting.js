'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:VotingCtrl
 * @description
 * # VotingCtrl
 * Controller of the ecampusApp
 */
angular
  .module('ecampusApp')
  .controller('VotingCtrl', VotingCtrl);

VotingCtrl.$inject = ['$scope', '$location', 'api'];

function VotingCtrl($scope, $location, api) {

  $scope.currentUser = null;
  $scope.voteTerm = null;
  $scope.personsForVote = [];

  function reload() {

    $scope.currentUser = api.getCurrentUser();

    if (!$scope.currentUser) {
      $location.path('/');
    }

    api.execute('GET', 'Vote/Term/Current').then(function(data) {
      $scope.voteTerm = (!!data && data.length > 0) ? data[0] : null;

      if ($scope.voteTerm) {
        getAllPersons();
        getAlreadyVotedPersons();
      }

    });

    function getAllPersons() {
      var action = 'Vote/Persons/' + $scope.currentUser.id;

      var payload = {
        page: 1,
        size: 100,
        envelope: false
      };

      api.execute('GET', action, payload).then(function(data) {
        $scope.personsForVote = data;

        console.log('$scope.personsForVote', $scope.personsForVote);
      });
    }

    function getAlreadyVotedPersons() {

      var action = 'Vote/Persons/' + $scope.currentUser.id + '/Voted';

      var payload = {
        voteTermId: $scope.voteTerm.id,
        page: 1,
        size: 100,
        envelope: false
      };

      api.execute('GET', action, payload).then(function(data) {
        $scope.personsAlreadyVoted = data;
        console.log('$scope.personsAlreadyVoted', $scope.personsAlreadyVoted);
      });

    }

    $scope.personVoted = function(person) {
      var result = false;
      if ($scope.personsAlreadyVoted) {
        $scope.personsAlreadyVoted.forEach(function(p) {
          if (p.employeesId === person.employeesId) {
            result = true;
          }
        });
      }
      return result;
    };

  }

  reload();

}
