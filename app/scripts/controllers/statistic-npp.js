'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:NppCtrl
 * @description
 * # NppCtrl
 * Controller of the ecampusApp
 */
angular
  .module('ecampusApp')
  .controller('NppCtrl', handler);

function handler($scope, $cookies, $window, api) {
  var NTUUKpiSubdivisionId = 9998;
  var InstituteTypeId = 26;
  var FacultyTypeId = 77;
  var CampusKpiSubsystemId = 1;

  $scope.cathedras = [];
  $scope.subdivisions = [];
  $scope.errorLabelText = '';
  $scope.tabIdForShow = -1;
  $scope.npps = [];
  $scope.chosenSubdivision = null;

  reload();

  function reload() {
    if (api.getToken()) {
      var sClaim = api.decodeToken(api.getToken());
      if (sClaim) {
        sClaim = JSON.parse(sClaim);
      }
    }
    if (api.getToken()) {
      setFacultyAndInstitute();
      setSubdivisionDetails();
    }
  }

  function getParent(obj, parentTagName) {
    return (
      obj.tagName === parentTagName ?
      obj : getParent(obj.parentNode, parentTagName)
    );
  }

  function setRadioBtnForCathedras(responsive) {

    var subdivisionId = responsive.Subdivision.Id;
    var subdivisionName = responsive.Subdivision.Name;

    if (~subdivisionName.indexOf('Кафедра')) {
      $scope.cathedras.push({
        cathedraId: subdivisionId,
        cathedraName: subdivisionName
      });
    }
  }

  function setSubdivisionDetails() {

    var sClaim = api.decodeToken(api.getToken());
    sClaim = JSON.parse(sClaim);

    if (typeof(sClaim.resp) === 'object') {
      sClaim.resp.forEach(function(item) {
        var itemJSON = JSON.parse(item);
        if (itemJSON.Subsystem === CampusKpiSubsystemId) {
          setRadioBtnForCathedras(itemJSON);
        }
      });
    } else if (typeof(sClaim.resp) === 'string') {
      var responsive = JSON.parse(sClaim.resp);
      if (responsive.Subsystem === CampusKpiSubsystemId) {
        setRadioBtnForCathedras(responsive);
      }
    }
  }

  function setFacultyAndInstitute() {
    var kpiQuery = false;
    var sClaim = api.decodeToken(api.getToken());

    sClaim = JSON.parse(sClaim);

    if (typeof(sClaim.resp) === 'object') {
      sClaim.resp.forEach(function(item) {
        kpiQuery = setFacultyAndInstituteLogic(item, kpiQuery);
      });
    } else if (typeof(sClaim.resp) === 'string') {
      kpiQuery = setFacultyAndInstituteLogic(sClaim.resp, kpiQuery);
    }

  }

  function setFacultyAndInstituteLogic(item, kpiQuery) {

    kpiQuery = !!kpiQuery;

    var itemJSON = JSON.parse(item);

    if (itemJSON.Subsystem === CampusKpiSubsystemId) {

      var subdivisionId = itemJSON.Subdivision.Id;
      var subdivisionName = itemJSON.Subdivision.Name;

      if (subdivisionId === NTUUKpiSubdivisionId && !kpiQuery) {
        kpiQuery = true;
        var pathFaculty = 'Subdivision';
        api.execute('GET', pathFaculty).then(function(response) {
          response.forEach(function(item) {
            if (
              item.type.id === InstituteTypeId ||
              item.type.id === FacultyTypeId
            ) {
              var subdivisionName = item.name;
              var subdivisionId = item.id;
              $scope.subdivisions.push({
                subdivisionId: subdivisionId,
                subdivisionName: subdivisionName
              });
            }
          });
        });
      }
      if (
        document.getElementById(subdivisionId + '') === null &&
        (
          ~subdivisionName.indexOf('факультет') ||
          ~subdivisionName.indexOf('Факультет') ||
          ~subdivisionName.indexOf('інститут') ||
          ~subdivisionName.indexOf('Інститут')
        )
      ) {
        $scope.subdivisions.push({
          subdivisionId: subdivisionId,
          subdivisionName: subdivisionName
        });
      }
    }
    return kpiQuery;
  }

  function loadCathedras() {
    $scope.npps = [];
    if (!$scope.chosenSubdivision) return;

    var parentId = $scope.chosenSubdivision.subdivisionId;
    var subdivisionPath = 'Subdivision/' + parentId + '/children';

    api.execute('GET', subdivisionPath).then(function(response) {
      $scope.cathedras = [];
      response.forEach(function(cathedra, i, arr) {
        if (arr[i + 1] !== undefined) {
          $scope.cathedras.push({
            cathedraId: cathedra.id,
            cathedraName: cathedra.name
          });
        }
      });
    });
  }

  function clearTableWithId(id, wrapperId) {
    var curTable = getAngularDOMElement('#' + id);
    if (curTable) curTable.remove();
    var newTable = angular.element('<table>');
    newTable.attr('id', id);
    getAngularDOMElement('#' + wrapperId).append(newTable);
  }

  function createTableRow() {
    return angular.element('<tr>');
  }

  function createTableHeaderCell() {
    return angular.element('<th>');
  }

  function createTableCell() {
    return angular.element('<td>');
  }

  function fillTableRow(colspanNumber, content, isHeader) {
    var row = createTableRow();
    content.forEach(function(cellText) {
      var cell = isHeader ? createTableHeaderCell() : createTableCell();
      cell.attr('colspan', colspanNumber);
      cell.text(cellText);
      row.append(cell);
    });

    return row;
  }

  function getAngularDOMElement(query) {
    return angular.element(document.querySelector(query));
  }

  //  For section npp
  $scope.checkNpp = function(chosenСathedraId) {
    $scope.errorLabelText = '';
    var cathedraId = chosenСathedraId;
    var path = (
      'Statistic/Cathedras/' + cathedraId +
      '/Emplloyers/WithIndividualLoad/List'
    );
    api.execute('GET', path).then(function(response) {
      if (!response || response === '') {
        $scope.errorLabelText = 'На жаль, записи у базі даних відсутні.';
      } else {
        $scope.semesters = response;

        //for download
        var wrapperTableForDownloadId = 'wrapper-for-download';
        var tableForDownloadId = 'table-for-download';
        clearTableWithId(tableForDownloadId, wrapperTableForDownloadId);
        var tableForDownload = getAngularDOMElement('#' + tableForDownloadId);
        response.forEach(function(employees, i, ar) {
          if (i === 0) {
            tableForDownload.append(
              fillTableRow('3', ['Перше півріччя (осінній семестр)'], true)
            );
          } else {
            tableForDownload.append(
              fillTableRow('3', ['Друге півріччя (весняний семестр)'], true)
            );
          }
          employees.forEach(function(employee, iter, arr) {
            tableForDownload.append(
              fillTableRow('3', [employee.name], false)
            );
            console.log(employee);
            employee.subjects.forEach(function(subj, innerIter, arr) {
              tableForDownload.append(
                fillTableRow(
                  '1',
                  [subj.name, (subj.groupsNames).join('\n'), subj.year],
                  false
                )
              );
            });
          });
        });
      }
    });
  };

  $scope.showTabById = function(id) {
    if ($scope.tabIdForShow !== id) {
      $scope.tabIdForShow = id;
    } else {
      $scope.tabIdForShow = -1;
    }
  };

  $scope.$watch('chosenSubdivision', function() {
    loadCathedras();
  });

}
