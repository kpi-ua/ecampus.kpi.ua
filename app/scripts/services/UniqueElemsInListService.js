'use strict';

angular
  .module('ecampusApp')
  .service('UniqueElemsInList', function () {
    var unmodifiedElementsOfQuery = [], finalArr = [], listAccordingToSubdivision = [];
    var tmpItem, ifPresent;

    this.setData = function (currListOfObj) {
      for (var i = 0; i < currListOfObj.length; i++) {
        unmodifiedElementsOfQuery.push(currListOfObj[i]);
      }
    };

    this.getData = function () {
      return unmodifiedElementsOfQuery;
    };

    this.getDataFiltered = function (field) {
      listAccordingToSubdivision = [];
      for (var i = 0; i < unmodifiedElementsOfQuery.length; i++) {
        if (field == unmodifiedElementsOfQuery[i].subdivisionName) {
          listAccordingToSubdivision.push(unmodifiedElementsOfQuery[i]);
        }
      }
      return listAccordingToSubdivision;
    };

    this.getDataUnique = function (field) {
      finalArr = [];
      finalArr.push('testStr');

      for (var i = 0; i < unmodifiedElementsOfQuery.length; i++) {
        //unmodifiedElementsOfQuery[i][field].discipline is not working
        switch (field) {
          case 'discipline':
            tmpItem = unmodifiedElementsOfQuery[i].discipline;
            break;
          case 'okr':
            tmpItem = unmodifiedElementsOfQuery[i].okr;
            break;
          case 'studyyear':
            tmpItem = unmodifiedElementsOfQuery[i].studyyear;
            break;
          case 'studyPeriod.all':
            tmpItem = unmodifiedElementsOfQuery[i].studyPeriod.start+"-"+unmodifiedElementsOfQuery[i].studyPeriod.end;
            break;
          case 'subdivisionName':
            tmpItem = unmodifiedElementsOfQuery[i].subdivisionName;
            break;
          default:
            tmpItem = unmodifiedElementsOfQuery[i];
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

      unmodifiedElementsOfQuery = [];
      var studyYearFrom = year.substr(0,4),
          studyYearTo = year.substr(5);

      for (var i = 0; i < initialArr.length; i++) {

        console.log("initialArr[i]");
        console.log(initialArr[i]);
        if ((studyYearFrom == initialArr[i].studyPeriod.start) && (studyYearTo == initialArr[i].studyPeriod.end) && (okr == initialArr[i].okr)) {
        //if ((year == initialArr[i].studyyear) && (okr == initialArr[i].okr)) {
          console.log("pushed!");
          unmodifiedElementsOfQuery.push({

            block: initialArr[i].blockName,
            discipline: initialArr[i].discipline,
            subdivision: initialArr[i].subdiv,
            maxCountStudent: initialArr[i].maxCountStudent,
            countLecture: initialArr[i].countLecture
          });

        }

      }


      return unmodifiedElementsOfQuery;
    };

    this.clearData = function () {
      unmodifiedElementsOfQuery = [];
    }


  });
