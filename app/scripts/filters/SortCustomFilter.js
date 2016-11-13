'use strict';

angular
  .module('ecampusApp')
  .filter('orderObjectBy', function () {
    return function (items, field, reverse) {
      var filtered = [];

      angular.forEach(items, function (item) {
        filtered.push(item);
      });

      filtered.sort(function (a, b) {
        switch (field) {
          case 'blockName':
            return (a.blockName.localeCompare(b.blockName));
            break;
          case 'nameUkr':
            return (a.nameUkr.localeCompare(b.nameUkr));
            break;
          case 'okr':
            return (a.okr.localeCompare(b.okr));
            break;
          default:
        }
      });

      if (reverse) filtered.reverse();
      return filtered;
    };
  });
