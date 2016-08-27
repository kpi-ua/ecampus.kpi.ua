'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:SecurityCtrl
 * @description
 * # SecurityCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
    .controller('SecurityCtrl', function ($scope, $cookies, $window, Api) {

        $scope.step = 1;
        $scope.captcha = '';
        $scope.userId = '';
        $scope.loader = false;
        $scope.captchaImage = '';

        $scope.login = '';
        $scope.password = '';

        function restorePassword() {

            var url = 'Account/Recovery';

            var payload = {
                Captcha: $scope.captcha,
                UserIdentifier: $scope.userId
            };

            $scope.loader = true;

            Api.execute("POST", url, payload)
                .done(function () {
                    step(3);
                    $scope.loader = false;
                    $scope.$apply();
                })
                .fail(function (result) {
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
            $scope.captchaImage = Api.getApiEndpoint() + 'Account/Recovery/' + encodeURIComponent($scope.userId) + '/token?d=' + new Date().getTime();
        }

        function showMessage(message) {
            alert(message);
        }

        function step(n) {
            $scope.step = n;
        }

        $scope.auth = function () {
            Api.auth($scope.login, $scope.password).then(function (token) {

                $scope.error = !token;
                $scope.$apply();

                if (!$scope.error) {
                    var user = Api.getCurrentUser();
                    $cookies.put('SID', user.sid, {domain: 'kpi.ua'});
                    $cookies.put('SID', user.sid, {domain: 'campus.kpi.ua'});
                    $window.location.href = 'http://campus.kpi.ua/';                    
                }
            });
        };

        $scope.getCaptcha = function () {
            getCaptcha();
        };

        $scope.restorePassword = function () {
            restorePassword();
        };
    });