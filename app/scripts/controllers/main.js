'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
    .controller('MainCtrl', function($scope, $cookies, $window, Api) {

        $scope.login = '';
        $scope.password = '';

        $scope.vkAuthUrl = '';
        $scope.fbAuthUrl = '';

        var config = {
            fb: {
                appId: '1214335051921931',
                redirectUrl: Api.getApiEndpoint() + 'account/oauth/login/fb'
            },
            vk: {
                appId: '5621042',
                redirectUrl: Api.getApiEndpoint() + 'account/oauth/login/vk'
            }
        };

        function init() {
            $scope.vkAuthUrl = generateVkAuthUrl();
            $scope.fbAuthUrl = generateFbAuthUrl();

            if (Api.getCurrentUser() != null) {
                $window.location.href = '/home';
            }

        }

        function generateVkAuthUrl() {
            return 'https://oauth.vk.com/authorize?client_id=' + config.vk.appId + '&scope=notify, email, status&redirect_uri=' + config.vk.redirectUrl + '&response_type=code&v=5.28&display=popup&state="SESSION_STATE"';
        }

        function generateFbAuthUrl() {
            var scope = "email";
            return 'https://www.facebook.com/dialog/oauth?client_id=' + config.fb.appId + '&redirect_uri=' + config.fb.redirectUrl + '&scope=' + scope;
        }

        init();

        $scope.auth = function() {

            Api.auth($scope.login, $scope.password).then(function(token) {

                $scope.error = !token;
                $scope.$apply();

                if (!$scope.error) {
                    var user = Api.getCurrentUser();
                    $cookies.put('SID', user.sid, { domain: 'kpi.ua' });
                    $cookies.put('SID', user.sid, { domain: 'campus.kpi.ua' });
                    $window.location.href = '/home';
                }
            });
        };

    });