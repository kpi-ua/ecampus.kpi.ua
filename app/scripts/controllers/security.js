'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:SecurityCtrl
 * @description
 * # SecurityCtrl
 * Controller of the ecampusApp
 */
angular
  .module('ecampusApp')
  .controller('SecurityCtrl', SecurityCtrl);

SecurityCtrl.$inject = ['$scope', 'api'];

function SecurityCtrl($scope, api) {
  $scope.step = 1;
  $scope.captcha = '';
  $scope.userId = '';
  $scope.captchaImage = '';

  function restorePassword() {

    var url = 'Account/Recovery';

    var payload = {
      Captcha: $scope.captcha,
      UserIdentifier: $scope.userId
    };


    api.execute('POST', url, payload)
      .then(function() {
        step(3);
      }, function(result) {

        if (result.status === 403) {
          showMessage('Невiрний код пiдтвердження');
          $scope.captcha = '';
          getCaptcha();
        } else if (result.status === 404) {
          showMessage(
            'Користувач з таким логiном, або електроною поштою не знайдений'
          );
          location.reload();
        } else if (result.status === 409) {
          step(4);
        }

      });
  }

  function getCaptcha() {
    step(2);
    $scope.captchaImage = (
      api.getApiEndpoint() + 'Account/Recovery/' +
      encodeURIComponent($scope.userId) + '/token?d=' +
      new Date().getTime()
    );
  }

  function showMessage(message) {
    alert(message);
  }

  function step(n) {
    $scope.step = n;
  }

  $scope.getCaptcha = function() {
    getCaptcha();
  };

  $scope.restorePassword = function() {
    restorePassword();
  };
}
