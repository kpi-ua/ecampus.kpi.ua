'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:NppCtrl
 * @description
 * # NppCtrl
 * Controller of the ecampusApp
 */
angular.module('ecampusApp')
  .controller('NppCtrl', function ($scope, $cookies, $window, Api) {
    $scope.cathedras = [];
    $scope.subdivisions = [];
    $scope.errorLabelText = "";
    $scope.tabIdForShow = -1;

    reload();

    function reload() {
      if (!!Campus.getToken()) {
        var sClaim = Api.decodeToken(Campus.getToken());

        if (!!sClaim) {
          sClaim = JSON.parse(sClaim);
        }
      }
      if (!!Campus.getToken()) {
        $scope.preloader = true;
        setFacultyAndInstitute();
        setSubdivisionDetails();
        $scope.preloader = false;
      }
    }

    function getParent(obj, parentTagName) {
      return (obj.tagName == parentTagName) ? obj : getParent(obj.parentNode, parentTagName);
    }

    function setRadioBtnForCathedras(responsive) {
      var subdivisionId = responsive.Subdivision.SubdivisionId;
      var subdivisionName = responsive.Subdivision.Name;
      if (~subdivisionName.indexOf("Кафедра")) {
        $scope.cathedras.push({
          cathedraId: subdivisionId,
          cathedraName: subdivisionName
        });
      }
    }

    function setSubdivisionDetails() {

      var sClaim = Api.decodeToken(Campus.getToken());
      sClaim = JSON.parse(sClaim);

      if (typeof(sClaim.resp) == "object") {
        sClaim.resp.forEach(function (itemForEach, i, arr) {
          var itemForEachJSON = JSON.parse(itemForEach);
          if (itemForEachJSON.Subsystem == 1) {
            setRadioBtnForCathedras(itemForEachJSON);
          }
        });
      } else {
        if (typeof(sClaim.resp) == "string") {
          var responsive = JSON.parse(sClaim.resp);
          if (responsive.Subsystem == 1) {
            setRadioBtnForCathedras(responsive);
          }
        }
      }
    }

    function setFacultyAndInstitute() {
      var kpiQuery = false;
      var sClaim = Api.decodeToken(Campus.getToken());

      sClaim = JSON.parse(sClaim);

      if (typeof(sClaim.resp) == "object") {
        sClaim.resp.forEach(function (itemForEach, i, arr) {
          kpiQuery = setFacultyAndInstituteLogic(itemForEach, kpiQuery);
        });
      } else {
        if (typeof(sClaim.resp) == "string") {
          kpiQuery = setFacultyAndInstituteLogic(sClaim.resp, kpiQuery);
        }
      }

    }

    function setFacultyAndInstituteLogic(item, kpiQuery) {
      kpiQuery = !!kpiQuery;

      var itemForEachJSON = JSON.parse(item);
      if (itemForEachJSON.Subsystem == 1) {
        var subdivisionId = itemForEachJSON.Subdivision.SubdivisionId;
        var subdivisionName = itemForEachJSON.Subdivision.Name;
        if (subdivisionId == 9998 && !kpiQuery) {
          kpiQuery = true;
          var pathFaculty = "Subdivision";
          Campus.execute("GET", pathFaculty).then(function (response) {
            response.forEach(function (itemForEach, i, arr) {
              if (itemForEach.typeId == 26 || itemForEach.typeId == 77) {
                var subdivisionName = itemForEach.name;
                var subdivisionId = itemForEach.subdivisionId;
                $scope.subdivisions.push({
                  subdivisionId: subdivisionId,
                  subdivisionName: subdivisionName
                });
              }
            });
            safeApply();
            var config = {
              '.chosen-select': {},
              '.chosen-select-deselect': {allow_single_deselect: true},
              '.chosen-select-no-single': {disable_search_threshold: 10},
              '.chosen-select-no-results': {no_results_text: 'Співпадінь не знайдено...'},
              '.chosen-select-width': {width: "95%"}
            };
            for (var selector in config) {
              $(selector).chosen(config[selector]);
            }
          });
        }
        if (document.getElementById(subdivisionId + "") == null &&
          (~subdivisionName.indexOf("факультет") || ~subdivisionName.indexOf("Факультет") || ~subdivisionName.indexOf("інститут") || ~subdivisionName.indexOf("Інститут"))) {
          $scope.subdivisions.push({
            subdivisionId: subdivisionId,
            subdivisionName: subdivisionName
          });
        }

      }
      return kpiQuery;
      safeApply();
    }

    function subjectModel(name) {
      this.name = name;
      this.groups = [];
    }

    function employeeModel(id, name) {
      this.id = id;
      this.name = name;
      this.subjects = [];
    }

    function nppModel(semestr) {
      this.semestr = semestr;
      this.employees = [];
    }

    function safeApply(fn) {
      $scope.safeApply(fn);
    }

    $scope.safeApply = function (fn) {
      var phase = this.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn)
          fn();
      } else {
        this.$apply(fn);
      }
    };

    $scope.chosenSelectChange = function () {
      var parentId = $scope.chosenSubdivisionId;
      var subdivisionPath = "Subdivision/" + parentId + "/children";
      $scope.preloader = true;
      Campus.execute("GET", subdivisionPath).then(function (response) {
        $scope.cathedras = [];
        response.forEach(function (itemForEach, i, arr) {
          if (arr[i + 1] != undefined) {
            var cathedraId = itemForEach.id;
            var cathedraName = itemForEach.name;
            $scope.cathedras.push({
              cathedraId: cathedraId,
              cathedraName: cathedraName
            });
          }
        });
        $scope.preloader = false;
        safeApply();
      })
    };

    //  For section npp
    $scope.checkNpp = function (chosenСathedraId) {
      $scope.npps = null;
      $scope.errorLabelText = "";
      $scope.preloader = true;
      $scope.safeApply();

      $("#semester1, #semester2").empty();

      var cathedraId = chosenСathedraId;
      var path = "Statistic/Cathedras/" + cathedraId + "/Emplloyers/WithIndividualLoad/List";
      Campus.execute("GET", path).then(function (response) {
        var npp = [new nppModel(1), new nppModel(2)];
        if (!response || response == "") {
          $scope.errorLabelText = "На жаль, записи у базі даних відсутні.";
          $scope.safeApply();
        } else {
          var baseEmplFullName = "";
          var baseCounter = -1;
          var baseSubName = "";
          var collectGroupsString = "";
          response.forEach(function (itemForEach, i, arr) {
            var emplFullName = itemForEach.employeeName;
            var subLongNameFull = itemForEach.rnpName;
            var studStudyGroupName = itemForEach.studyGroup;
            var studSemesterYear = itemForEach.years;
            if (studSemesterYear[0] != 0) {
              if (baseEmplFullName != emplFullName) {
                baseEmplFullName = emplFullName;
                baseCounter++;
                npp[0].employees.push(new employeeModel('npp' + baseCounter + '1', emplFullName));
                npp[1].employees.push(new employeeModel('npp' + baseCounter + '2', emplFullName));
                // for download
                $("#semester" + studSemesterYear[0]).append('<tr><th colspan="3">' + emplFullName + '</th></tr>');
              }
              var lastIndexOfEmployee = npp[studSemesterYear[0] - 1].employees.length - 1;
              var currentEmployee = npp[studSemesterYear[0] - 1].employees[lastIndexOfEmployee];
              var lastIndexOfSubject;
              var currentSubject;
              if (baseSubName != subLongNameFull) {
                baseSubName = subLongNameFull;
                currentEmployee.subjects.push(new subjectModel(subLongNameFull));
                lastIndexOfSubject = currentEmployee.subjects.length - 1;
                currentSubject = currentEmployee.subjects[lastIndexOfSubject];
                currentSubject.groups.push(studStudyGroupName);
                collectGroupsString = studStudyGroupName + "<br> ";
              } else {
                lastIndexOfSubject = npp[studSemesterYear[0] - 1].employees[lastIndexOfEmployee].subjects.length - 1;
                currentSubject = currentEmployee.subjects[lastIndexOfSubject];
                currentSubject.groups.push(studStudyGroupName);
                collectGroupsString += studStudyGroupName + "<br> ";
              }
              if (arr[i + 1] == undefined || arr[i + 1].rnpName != baseSubName) {
                // for download
                $("#semester" + studSemesterYear[0]).append('<tr>' +
                  '<td>' + baseSubName + ' </td>' +
                  '<td>' + collectGroupsString + '</td>' +
                  '<td>' + studSemesterYear + '</td></tr>');
              }
            }
          });
          console.log(npp);
          $scope.npps = npp;
          $scope.preloader = false;
          $scope.safeApply();
        }
      });
    };

    $scope.showTabById = function (id) {
      if ($scope.tabIdForShow != id) {
        $scope.tabIdForShow = id;
      } else {
        $scope.tabIdForShow = -1;
      }
    }
  });
