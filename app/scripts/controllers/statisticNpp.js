'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:StatisticNppCtrl
 * @description
 * # StatisticNppCtrl
 * Controller of the ecampusApp
 */
angular
  .module('ecampusApp')
  .controller('NppCtrl', StatisticNppCtrl);

StatisticNppCtrl.$inject = ['$scope', 'api'];

function StatisticNppCtrl($scope, api) {
  $scope.cathedras = [];
  $scope.subdivisions = [];
  $scope.errorLabelText = '';
  $scope.tabIdForShow = -1;
  $scope.npps = [];
  $scope.chosenSubdivision = null;
  $scope.check = check;
  $scope.showTabById = showTabById;

  // activate();
  //
  // function activate() {
  //
  // }

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
  function check(chosenСathedra) {
    $scope.errorLabelText = '';
    var cathedraId = chosenСathedra.cathedraId;
    var path = (
      'Statistic/Cathedras/' + cathedraId +
      '/Emplloyers/WithIndividualLoad/List'
    );
    api.execute('GET', path).then(function(response) {
      if (!response || response === '' || response.length === 0) {
        $scope.errorLabelText = 'На жаль, записи у базі даних відсутні.';
      } else {
        $scope.semesters = response;
        console.log($scope.semesters);
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
  }

  function showTabById(id) {
    if ($scope.tabIdForShow !== id) {
      $scope.tabIdForShow = id;
    } else {
      $scope.tabIdForShow = -1;
    }
  }

}
