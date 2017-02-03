angular.module('ecampusApp')
    .directive('groupDisplay', function() {
        return{
            templateUrl: 'views/directives/group-display.html',
            restrict: 'E',
            link: function (scope, element, attrs) {

                scope.data = scope[attrs["group"]];
                console.log(scope.data);

            }
        }
    });