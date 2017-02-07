'use strict';

angular
  .module('ecampusApp')
  .filter('unique', function() {
    return function(collection, discipline) {
      // array of output data, array of data with repetitions
      var output = [];
      var YearData = [];
      var RepeatableValuesPosition = [];

      var ifAlreadyTaken = function(num) {
        for (var i = 0; i < RepeatableValuesPosition.length; i++) {
          if (num === RepeatableValuesPosition[i]) {
            return true;
          } else {
            return false;
          }
        }
      };

      for (var i = 0; i < collection.length; i++) {
        //current object
        var item = collection[i];
        //add the very first object to output array
        if (i === 0) {
          output.push(item);
          continue;
        }

        var ifPresent = false; // temp var
        var j = 0; // indicates the number of current object in output array

        while (!ifPresent) {
          if (
            output[j].okr === item.okr &&
            output[j].blockName === item.blockName &&
            output[j].nameUkr === item.nameUkr
          ) {
            // if three fields watche then add
            // current object to array with repetitions
            YearData.push(item);
            ifPresent = true;
            //
            if (!ifAlreadyTaken(j)) {
              RepeatableValuesPosition.push(j);
            }
          } else if (j !== (output.length - 1)) {
            // if not the end of output array, then go to another its object
            j++;
          } else {
            // if we reach the end of output array, then we discover
            // that current object is unique and add it to output
            output.push(item);
            ifPresent = true;
          }
        }
      }
      //add repeatable values array
      for (var k = 0; k < RepeatableValuesPosition.length; k++) {
        YearData.push(output[RepeatableValuesPosition[k]]);
      }
      return output;
    };
  });
