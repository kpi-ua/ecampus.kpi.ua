'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:HomeBulletinsBoardCtrl
 * @description
 * # HomeBulletinsBoardCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
  .controller('HomeBulletinsBoardCtrl', ['$scope', 'Api', function($scope, Api) {
    $scope.errorMessage = '';
    $scope.tab = 1;

    $scope.setTab = function(newTab) {
      $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum) {
      return $scope.tab === tabNum;
    };

    $scope.stringToUaDate = function(str) {
      return stringToDate(str)
        .toLocaleString('uk-ua', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    function loadBoards() {
      var url = '/Board/All';

      Api.execute('GET', url)
        .then(function(response) {
          $scope.boardsList = response;

          sortBoards($scope.boardsList);
          $scope.allBoards = getAllBoards();
          $scope.boardsForProfile = getBoardsForProfile();
          $scope.boardsForSubdivision = getBoardsForSubdivision();

        });
    }

    function getAllBoards() {
      return $scope.boardsList.filter(function(board) {
        return board.actuality;
      });
    }

    function getBoardsForProfile() {
      var positions = [];
      Api.getCurrentUser().position.forEach(function(entry) {
        positions.push(entry.id);
      });

      return $scope.boardsList.filter(function(board) {
        return ~positions.indexOf(board.profileId);
      });
    }

    function getBoardsForSubdivision() {
      var subdivisions = [];

      Api.getCurrentUser().subdivision.forEach(function(entry) {
        subdivisions.push(entry.id);
      });

      return $scope.boardsList.filter(function(board) {
        return ~subdivisions.indexOf(board.subdivisionId);
      });
    }

    function sortBoards(boards) {
      boards.sort(function(a, b) {
        return stringToDate(b.dateCreate) - stringToDate(a.dateCreate);
      });
    }

    //Parse string to Date object. Standart parser doesn`t work with our format
    function stringToDate(s) {
      s = s.split(/[-: ]/);
      return new Date(s[0], s[1] - 1, s[2], s[3], s[4], s[5]);
    }

    loadBoards();
  }]);
