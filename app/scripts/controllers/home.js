'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
  .controller('HomeCtrl', function (Api, $scope) {
    $scope.sessionExpired = false;
    angular.element(document).ready(function () {
      var isLogged = Api.getToken();
      if (isLogged) {
        $scope.sessionExpired = Api.removeToken();
        $scope.$apply();
      }
    });
  });
