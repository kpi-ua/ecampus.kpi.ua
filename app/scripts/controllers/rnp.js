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
  .controller('RnpCtrl', handler);

function handler($scope, $cookies, $window, api, $filter, $http) {

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

  // $scope.display = {
  //   StudyGroups: [],
  //   RnpRows: []
  // };
  $scope.RnpRows = null;
  $scope.errorLabelText = '';

  $scope.$on('rnpIdSelect', function SetGroups(event, param) {
    $scope.errorLabelText = '';
    var path = (
      'Rnp/' + param.userAccountId + '/StudyGroup/' +
      param.chosenDepartmentId + '/' + param.chosenDepartmentMark +
      '/' + param.rnpId
    );
    api.execute('GET', path).then(function(response) {
      if (!response || response === '') {
        $scope.errorLabelText = 'На жаль, дані відсутні';
        $scope.StudyGroups = null;
      } else {
        $scope.StudyGroups = response;
        setRnpRows(
          param.userAccountId,
          param.chosenDepartmentId,
          param.chosenDepartmentMark,
          param.rnpId
        );
      }
    });
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
    api.execute('GET',path).then(function (response) {
      if (!response || response === '') {
        $scope.errorLabelText = 'На жаль, дані відсутні';
        $scope.RnpRows = null;
      } else {
        $scope.RnpRows = response;
      }
    });
  }
}
