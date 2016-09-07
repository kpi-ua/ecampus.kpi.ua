'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
  .controller('MainCtrl', function ($scope, $cookies, $window, Api) {

    $scope.login = '';
        $scope.password = '';

    $scope.auth = function () {
      Api.auth($scope.login, $scope.password).then(function (token) {

        $scope.error = !token;
        $scope.$apply();

        if (!$scope.error) {
          var user = Api.getCurrentUser();
          $cookies.put('SID', user.sid, { domain: 'kpi.ua' });
          $cookies.put('SID', user.sid, { domain: 'campus.kpi.ua' });
          $window.location.href = 'http://campus.kpi.ua/';
        }
      });
    };

  });
