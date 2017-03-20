'use strict';

angular
    .module('ecampusApp')
    .directive('tableFromArray', tableFromArray);

tableFromArray.$inject = ['api'];

function tableFromArray(api) {
    return {
        link: link,
        templateUrl: 'views/directives/tableFromArray.html',
        restrict: 'EA',
        scope: {
            table: '=',
            tableHeadersArray: '=',
            midHeader: '='
        },
    };

    function link(scope, element, attr) {

    }
}