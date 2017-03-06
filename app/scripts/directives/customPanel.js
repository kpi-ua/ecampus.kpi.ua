'use strict';

angular
    .module('ecampusApp')
    .directive('tablePanel', tablePanel);

tablePanel.$inject = ['api'];

function tablePanel(api) {
    return {
        link: link,
        templateUrl: 'views/directives/customPanel.html',
        restrict: 'EA',
        transclude: true,
        scope: {
            panelHeader: '=',
            labelContent: '='
        },
    };

    function link($scope, element, attr) {
        $scope.isClose= true;
    }
}