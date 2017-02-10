'use strict';

angular
  .module('ecampusApp')
  .service('uniqueElemsInList', function() {
    var unmodifiedElementsOfQuery = [];
    var finalArr = [];
    var listAccordingToSubdivision = [];
    var item, ifPresent;

    this.setData = function(currListOfObj) {
      for (var i = 0; i < currListOfObj.length; i++) {
        unmodifiedElementsOfQuery.push(currListOfObj[i]);
      }
    };

    this.getData = function() {
      return unmodifiedElementsOfQuery;
    };

    this.getDataFiltered = function(field) {
      listAccordingToSubdivision = [];
      for (var i = 0; i < unmodifiedElementsOfQuery.length; i++) {
        if (field === unmodifiedElementsOfQuery[i].subdivisionName) {
          listAccordingToSubdivision.push(unmodifiedElementsOfQuery[i]);
        }
      }
      return listAccordingToSubdivision;
    };

    this.getDataUnique = function(field) {
      finalArr = [];
      finalArr.push('testStr');

      for (var i = 0; i < unmodifiedElementsOfQuery.length; i++) {
        // unmodifiedElementsOfQuery[i][field].discipline is not working
        item = unmodifiedElementsOfQuery[i];
        switch (field) {
          case 'discipline': item = item.discipline; break;
          case 'okr': item = item.okr; break;
          case 'studyyear': item = item.studyyear; break;
          case 'studyPeriod.all':
            item = item.studyPeriod.start + '-' + item.studyPeriod.end;
            break;
          case 'subdivisionName': item = item.subdivisionName; break;
          case 'forSelectFullname': item = item.forSelectFullname; break;
        }
        for (var j = 0; j < finalArr.length; j++) {
          ifPresent = item === finalArr[j];
          if (ifPresent) break;
        }
        if (!ifPresent) finalArr.push(item);
      }
      finalArr.shift();
      return finalArr;
    };

    this.getArrayOfBlocksAndDisc = function(year, okr, initialArr) {

      unmodifiedElementsOfQuery = [];
      var studyYearFrom = year.substr(0, 4);
      var studyYearTo = year.substr(5);

      for (var i = 0; i < initialArr.length; i++) {        
        if (
          studyYearFrom === (''+initialArr[i].studyPeriod.start) &&
          studyYearTo === (''+initialArr[i].studyPeriod.end) &&
          okr === initialArr[i].okr
        ) {         
          unmodifiedElementsOfQuery.push({
            block: initialArr[i].blockName,
            discipline: initialArr[i].discipline,
            subdivision: initialArr[i].subdivision,
            maxCountStudent: initialArr[i].maxCountStudent,
            countLecture: initialArr[i].countLecture
          });
        }
      }

      return unmodifiedElementsOfQuery;
    };

    this.clearData = function() {
      unmodifiedElementsOfQuery = [];
    };

    this.getStudyYearsArray = function(from, to) {
      var studyYears = [];
      for (var i = from; i < to; i++) {
        studyYears.push(i + '-' + (i + 1));
      }
      return studyYears;
    };

    this.setCurrentYear = function(allYears) {
      var currDate = new Date();
      var actualYear = currDate.getFullYear();
      var actualMonth = currDate.getMonth() + 1;

      if (actualMonth < 7) actualYear -= 1;

      for (var i = 0; i < allYears.length; i++) {
        if (allYears[i].name) {
          if (('' + actualYear) === allYears[i].name.substr(0, 4)) {
            // return allYears[i].name;
            return allYears[i];
          }
        } else if (('' + actualYear) === allYears[i].substr(0, 4)) {
          return allYears[i];
        }
      }
    };

  });
