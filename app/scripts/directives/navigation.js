'use strict';

/**
 * @ngdoc directive
 * @name ecampusApp.directive:header
 * @description
 * # header
 */
angular
  .module('ecampusApp')
  .directive('navigation', handler);

function handler() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/directives/navigation.html',
    controller: [
      '$scope', '$cookies', '$window', 'api',
      function($scope, $cookies, $window, api) {
        $scope.userAuthenticated = false;
        $scope.user = null;
        init();

        $scope.redirectToLegacyCampus = function() {
          var user = api.getCurrentUser();
          $cookies.put('SID', user.sid, { domain: 'kpi.ua' });
          $cookies.put('SID', user.sid, { domain: 'campus.kpi.ua' });
          $window.location.href = 'http://campus.kpi.ua';
        };

        $scope.logout = function() {
          api.logout();
          $cookies.put('SID', null, { domain: 'kpi.ua' });
          $cookies.put('SID', null, { domain: 'campus.kpi.ua' });
          $window.location.href = '/#!/';
        };

        $scope.$on('update-navigation', function() {
          init();
        });

        function init() {
          var user = api.getCurrentUser();
          $scope.disableDisciplineChoiceForNotStudent = false;
          $scope.enableDisciplineForNotStudent = false;
          $scope.user = user;
          if (user) $scope.userAuthenticated = true;

          if ($scope.userAuthenticated) {
            $scope.userName = user.name;
            $scope.userImage = (
              api.getApiEndpoint() + '/Account/' + user.id + '/ProfileImage'
            );
            if (user.position[0].id !== 5) {
              $scope.disableDisciplineChoiceForNotStudent = true;
              $scope.enableDisciplineForNotStudent = true;
            }
          }
        }
      }
    ]
  };
}
