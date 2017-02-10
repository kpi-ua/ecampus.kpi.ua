'use strict';

angular
  .module('ecampusApp')
  .filter('yearOutput', function() {
    return function(yearObject) {
      return yearObject.name;
    };
  });
