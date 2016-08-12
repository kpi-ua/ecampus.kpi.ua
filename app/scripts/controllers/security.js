'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:SecurityCtrl
 * @description
 * # SecurityCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
    .controller('SecurityCtrl', function($scope) {

        $scope.step = 1;
        $scope.captcha = '';
        $scope.userId = '';
        $scope.loader = false;
        $scope.captchaImage = '';

        function restorePassword() {

            var url = 'Account/Recovery';

            var payload = {
                Captcha: $scope.captcha,
                UserIdentifier: $scope.userId
            };

            $scope.loader = true;

            Campus.execute("POST", url, JSON.stringify(payload))
                .done(function(result) {
                    step(3);
                    $scope.loader = false;
                    $scope.$apply();
                })
                .fail(function(result) {
                    $scope.loader = false;

                    if (result.status === 403) {
                        showMessage("Невiрний код пiдтвердження");
                        $scope.captcha = '';
                        getCaptcha();
                    } else if (result.status === 404) {
                        showMessage("Користувач з таким логiном, або електроною поштою не знайдений");
                        location.reload();
                    } else if (result.status === 409) {
                        step(4);
                    }

                    $scope.$apply();
                });
        }

        function getCaptcha() {
            step(2);
            $scope.captchaImage = Campus.ApiEndpoint + 'Account/Recovery/' + encodeURIComponent($scope.userId) + '/token?d=' + new Date().getTime();
        }

        function showMessage(message) {
            alert(message);
        }

        function step(n) {
            $scope.step = n;
        }

        function reload() {
            step(1);
        }

        $scope.getCaptcha = function() {
            getCaptcha();
        }

        $scope.restorePassword = function() {
            restorePassword();
        }

    });