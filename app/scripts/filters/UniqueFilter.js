'use strict';

angular
  .module('ecampusApp')
  .filter('unique', function() {
    return function(collection, discipline) {
      // array of output data, array of data with repetitions
      var output = [];
      var yearData = [];
      var repeatableValuesPosition = [];

      var ifAlreadyTaken = function(num) {
        for (var i = 0; i < repeatableValuesPosition.length; i++) {
          return num === repeatableValuesPosition[i];
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
            yearData.push(item);
            ifPresent = true;
            //
            if (!ifAlreadyTaken(j)) {
              repeatableValuesPosition.push(j);
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
      for (var k = 0; k < repeatableValuesPosition.length; k++) {
        yearData.push(output[repeatableValuesPosition[k]]);
      }
      return output;
    };
  });
