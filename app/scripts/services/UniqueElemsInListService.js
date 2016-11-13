'use strict';

angular
  .module('ecampusApp')
  .service('UniqueElemsInList', function () {
    var listOfObjects = [], finalArr = [], listAccordingToSubdivision = [];
    var tmpItem, ifPresent;

    this.setData = function (currListOfObj) {
      for (var i = 0; i < currListOfObj.length; i++) {
        listOfObjects.push(currListOfObj[i]);
      }
    };

    this.getData = function () {
      return listOfObjects;
    };

    this.getDataFiltered = function (field) {
      listAccordingToSubdivision = [];
      for (var i = 0; i < listOfObjects.length; i++) {
        if (field == listOfObjects[i].subdivisionName) {
          listAccordingToSubdivision.push(listOfObjects[i]);
        }
      }
      return listAccordingToSubdivision;
    };

    this.getDataUnique = function (field) {
      finalArr = [];
      finalArr.push('testStr');

      for (var i = 0; i < listOfObjects.length; i++) {
        //listOfObjects[i][field].discipline is not working
        switch (field) {
          case 'discipline':
            tmpItem = listOfObjects[i].discipline;
            break;
          case 'okr':
            tmpItem = listOfObjects[i].okr;
            break;
          case 'studyyear':
            tmpItem = listOfObjects[i].studyyear;
            break;
          case 'subdivisionName':
            tmpItem = listOfObjects[i].subdivisionName;
            break;
          default:
            tmpItem = listOfObjects[i];
            break;
        }
        for (var j = 0; j < finalArr.length; j++) {
          if (tmpItem == finalArr[j]) {
            ifPresent = true;
            break;
          }
          else {
            ifPresent = false;
          }
        }
        if (ifPresent == false) {
          finalArr.push(tmpItem);
        }
      }
      finalArr.shift();
      return finalArr;
    };

    this.getArrayOfBlocksAndDisc = function (year, okr, initialArr) {

      listOfObjects = [];

      for (var i = 0; i < initialArr.length; i++) {

        if ((year == initialArr[i].studyyear) && (okr == initialArr[i].okr)) {
          listOfObjects.push({

            block: initialArr[i].blockName,
            discipline: initialArr[i].discipline
          });

        }

      }


      return listOfObjects;
    };

    this.clearData = function () {
      listOfObjects = [];
    }


  });
