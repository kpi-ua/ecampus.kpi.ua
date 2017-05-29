'use strict';

/**
 * @ngdoc function
 * @name ecampusApp.controller:RnpCtrl
 * @description
 * # RnpCtrl
 * Controller of the ecampusApp
 */
angular
  .module('ecampusApp')
  .controller('RnpCtrl', RnpCtrl);

RnpCtrl.$inject = ['$scope', 'api'];

function RnpCtrl($scope, api) {
  $scope.hoursPerCredit = 36;
  $scope.options = {
    StudyYears: [],
    Departments: [],
    Okrs: [],
    Specializations: [],
    StudyForms: [],
    XmlCodes: []
  };

  $scope.model = {
    studyYearName: null,
    departmentItem: null,
    okrName: null,
    specializationCodeName: null,
    studyFormName: null,
    xmlCode: null
  };

  $scope.selectData = {
    studyYearId: null,
    departmentId: null,
    departmentMark: null,
    okrId: null,
    specializationId: null,
    studyFormId: null,
    xmlCodeId: null
  };

  $scope.RnpRows = null;

  $scope.errorLabelText = '';

  $scope.$on('rnpIdSelect', function SetGroups(event, param) {
    $scope.errorLabelText = '';
    var path = (
      'Rnp/' + param.userAccountId + '/StudyGroup/' +
      param.chosenDepartmentId + '/' + param.chosenDepartmentMark +
      '/' + param.rnpId
    );
    api.execute('GET', path)
      .then(function(response) {
        if (!response || response === '' || response.length === 0) {
          $scope.errorLabelText = 'На жаль, дані відсутні';
          $scope.StudyGroups = null;
        } else {
          $scope.StudyGroups = response.sort(GroupCompare);
          setRnpRows(
            param.userAccountId,
            param.chosenDepartmentId,
            param.chosenDepartmentMark,
            param.rnpId
          );
        }
      })
      .catch(errorHandlerMy);
  });

  function setRnpRows(
    useId,
    chosenSubdivisionId,
    chosenSubdivisionMar,
    rnpId
  ) {
    var path = (
      'Rnp/' + useId + '/RNPRows/' + chosenSubdivisionId + '/' +
      chosenSubdivisionMar + '/' + rnpId
    );
    api.execute('GET', path)
      .then(function(response) {
        if (!response || response === '' || response.length === 0) {
          $scope.errorLabelText = 'На жаль, дані відсутні';
          $scope.RnpRows = null;
        } else {
          var tempArray = response;
          tempArray.forEach(function (rnp) {
            rnp.rnpRows.forEach(function (row) {
              row.creditsHours = row.credits * $scope.hoursPerCredit;
              row.totalCount = row.countLaboratory + row.countLecture+ row.countPractice;
            })
          });
          $scope.RnpRows = tempArray;
        }
      })
      .catch(errorHandlerMy);
  }

  function GroupCompare(groupA,groupB) {
      if (groupA.name < groupB.name)
        return -1;
      if (groupA.name > groupB.name)
        return 1;
      return 0;
  }
  function errorHandlerMy(response, status, headers) {
    $scope.errorLabelText = api.errorHandler(response);
  }
}
